import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ws from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY / VITE_SUPABASE_ANON_KEY in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
    global: { fetch: fetch.bind(globalThis) },
    realtime: { transport: ws as any }
});

async function main() {
    const jsonPath = path.join(__dirname, '..', 'questions.json');
    
    if (!fs.existsSync(jsonPath)) {
        console.error(`❌ Could not find questions.json at ${jsonPath}`);
        console.log('Please paste the ChatGPT JSON output into a file named questions.json in the project root.');
        process.exit(1);
    }

    console.log('Reading questions.json...');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    
    let parsed;
    try {
        parsed = JSON.parse(rawData);
    } catch (e) {
        console.error('❌ Invalid JSON in questions.json. Ensure it is purely valid JSON with no markdown wrapping.');
        process.exit(1);
    }

    const questions = parsed.questions || parsed;

    if (!Array.isArray(questions)) {
        console.error('❌ JSON must contain an array of questions. Found:', typeof questions);
        process.exit(1);
    }

    console.log(`Found ${questions.length} questions. Inserting into Supabase...`);
    if (!process.env.SUPABASE_SECRET_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('⚠️ Warning: Neither SUPABASE_SECRET_KEY nor SUPABASE_SERVICE_ROLE_KEY is set in .env. Using anon key which may fail if RLS (Row Level Security) blocks inserts on the "questions" table.');
    }

    // Add is_active flag to all before insert
    const insertPayload = questions.map(q => ({
        ...q,
        is_active: q.is_active !== undefined ? q.is_active : true
    }));

    const BATCH_SIZE = 100;
    let totalInserted = 0;

    for (let i = 0; i < insertPayload.length; i += BATCH_SIZE) {
        const batch = insertPayload.slice(i, i + BATCH_SIZE);
        const { data, error } = await supabase.from('questions').insert(batch).select('id');

        if (error) {
            console.error(`❌ Supabase Insert Error on batch ${i / BATCH_SIZE + 1}:`, error);
            break;
        } else {
            totalInserted += data?.length || batch.length;
            console.log(` progress: inserted ${totalInserted}/${insertPayload.length} questions...`);
        }
    }

    if (totalInserted === insertPayload.length) {
        console.log(`✅ Successfully inserted all ${totalInserted} questions into the database!`);
    }
}

main().catch(console.error);
