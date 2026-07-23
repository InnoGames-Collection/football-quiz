import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ws from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.script if present, else .env
dotenv.config({ path: path.join(__dirname, '..', '.env.script') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
// Use secret / service role key for bypassing RLS during seed, or anon key if RLS allows
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error('Missing required environment variables (VITE_SUPABASE_URL, SUPABASE_SECRET_KEY/SUPABASE_SERVICE_ROLE_KEY/VITE_SUPABASE_ANON_KEY, VITE_GEMINI_API_KEY)');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
    realtime: { transport: ws as any }
});



const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const CATEGORIES = [
    { id: 'world-cup', desc: 'FIFA World Cup history, records, hosts, and legend moments' },
    { id: 'champions-league', desc: 'UEFA Champions League history, European club football, iconic finals' },
    { id: 'caf-champions', desc: 'CAF Champions League, African club football' },
    { id: 'afcon', desc: 'Africa Cup of Nations (AFCON) history and records' },
    { id: 'ethiopian-premier', desc: 'Ethiopian Premier League (St. George, Ethiopian Coffee, Fasil Kenema, etc.)' },
    { id: 'walia-ibex', desc: 'Walia Ibex (Ethiopian National Team) history, players, and achievements' },
    { id: 'premier-league', desc: 'English Premier League clubs, managers, and top scorers' },
    { id: 'la-liga', desc: 'Spanish La Liga, El Clásico, Spanish giants' },
    { id: 'serie-a', desc: 'Italian Serie A history, tactical legends, and clubs' },
    { id: 'bundesliga', desc: 'German Bundesliga powerhouses and records' },
    { id: 'legendary-players', desc: 'All-time legendary football players (Maradona, Pelé, Messi, Ronaldo, etc.)' },
    { id: 'football-rules', desc: 'Laws of the game, offside rule, VAR, and refereeing' },
    { id: 'transfer-market', desc: 'Record transfer fees, notable contracts, and market moves' },
    { id: 'stadiums', desc: 'Iconic football stadiums, capacities, and host cities' },
    { id: 'football-history', desc: 'General football history, origins, and global lore' }
];

const QUESTIONS_PER_CATEGORY = 20; // Adjust this to generate more per run
const BATCH_SIZE = 5; // Gemini will generate 5 questions per request to avoid timeouts/limits

async function generateQuestionsForCategory(category: { id: string, desc: string }, count: number) {
    console.log(`\n========================================`);
    console.log(`Generating ${count} questions for category: ${category.id}`);
    console.log(`========================================`);

    const schema = {
        type: Type.OBJECT,
        properties: {
            questions: {
                type: Type.ARRAY,
                description: 'A list of generated football trivia questions.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        prompt_en: { type: Type.STRING, description: 'The question in English' },
                        prompt_am: { type: Type.STRING, description: 'The question translated to Amharic (አማርኛ)' },
                        prompt_om: { type: Type.STRING, description: 'The question translated to Afaan Oromoo' },
                        options_en: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'Exactly 4 multiple choice options in English'
                        },
                        options_am: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'Exactly 4 multiple choice options translated to Amharic'
                        },
                        options_om: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'Exactly 4 multiple choice options translated to Afaan Oromoo'
                        },
                        correct_index: { type: Type.INTEGER, description: 'The index of the correct option (0 to 3)' },
                        difficulty: { type: Type.INTEGER, description: 'Difficulty level from 1 (easy) to 5 (extremely hard)' }
                    },
                    required: ['prompt_en', 'prompt_am', 'prompt_om', 'options_en', 'options_am', 'options_om', 'correct_index', 'difficulty']
                }
            }
        },
        required: ['questions']
    };

    let totalGenerated = 0;

    while (totalGenerated < count) {
        const remaining = count - totalGenerated;
        const toGenerate = Math.min(BATCH_SIZE, remaining);

        console.log(`Generating batch of ${toGenerate} questions... (${totalGenerated}/${count})`);

        try {
            const prompt = `
                You are a world-class football trivia expert and professional translator (English, Amharic, Afaan Oromoo).
                Generate exactly ${toGenerate} unique, highly engaging football trivia questions for the category: "${category.id}" (${category.desc}).
                
                CRITICAL REQUIREMENTS:
                1. Ensure a mix of difficulties (1 to 5).
                2. Do NOT repeat questions that are commonly known; be creative.
                3. The translation to Amharic (prompt_am and options_am) must be grammatically correct and use proper football terminology in Ethiopia.
                4. The translation to Afaan Oromoo (prompt_om and options_om) must be accurate and natural.
                5. Provide EXACTLY 4 options for each language. The order of options must match across languages so the correct_index (0-3) applies to all.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema,
                    temperature: 0.7,
                }
            });

            const text = response.text;
            if (!text) throw new Error('Empty response from Gemini');

            const parsed = JSON.parse(text);
            const questions = parsed.questions;

            if (!questions || !Array.isArray(questions)) {
                throw new Error('Invalid JSON structure returned');
            }

            // Insert into Supabase
            const insertPayload = questions.map((q: any) => ({
                category: category.id,
                difficulty: q.difficulty,
                prompt_en: q.prompt_en,
                prompt_am: q.prompt_am,
                prompt_om: q.prompt_om,
                options_en: q.options_en,
                options_am: q.options_am,
                options_om: q.options_om,
                correct_index: q.correct_index,
                is_active: true
            }));

            const { error } = await supabase.from('questions').insert(insertPayload);
            if (error) {
                console.error('Supabase insert error:', error);
            } else {
                console.log(`✅ Successfully inserted ${insertPayload.length} questions.`);
                totalGenerated += insertPayload.length;
            }

            // Wait 15 seconds between successful batches to respect Free Tier Limits
            console.log('Waiting 15 seconds to respect Gemini API rate limits...');
            await new Promise(resolve => setTimeout(resolve, 15000));

        } catch (err: any) {
            console.error('Error generating batch, retrying...', err.message);
            // Wait 20 seconds before retry on 429 quota errors
            console.log('Waiting 20 seconds before retry...');
            await new Promise(resolve => setTimeout(resolve, 20000));
        }
    }
}

async function main() {
    console.log('Starting Massive Question Generation...');
    
    // For testing, just run one category first. 
    // To run all, uncomment the loop below.
    
    const targetCategory = CATEGORIES.find(c => c.id === 'ethiopian-premier');
    if (targetCategory) {
        await generateQuestionsForCategory(targetCategory, 10);
    }
    
    /*
    for (const cat of CATEGORIES) {
        await generateQuestionsForCategory(cat, QUESTIONS_PER_CATEGORY);
    }
    */
    
    console.log('Finished Massive Question Generation!');
}

main().catch(console.error);
