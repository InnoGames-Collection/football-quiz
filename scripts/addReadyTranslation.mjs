import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'en.ts');
const amPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'am.ts');
const omPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'om.ts');

function updateFile(filePath, replacement) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/leaveBtn: "([^"]+)",\s*continueBtn: "([^"]+)"/, 'leaveBtn: "$1",\n    continueBtn: "$2",\n    ready: ' + replacement);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Updated " + filePath);
}

updateFile(enPath, '"Ready to test your knowledge, {playerName}?"');
updateFile(amPath, '"{playerName}፣ እውቀትዎን ለመፈተሽ ዝግጁ ነዎት?"');
updateFile(omPath, '"{playerName}, beekumsa kee qoruuf qophaa\'aa?"');
