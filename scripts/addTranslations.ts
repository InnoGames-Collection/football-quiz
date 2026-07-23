import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'en.ts');
const amPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'am.ts');
const omPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'om.ts');

const newEnKeys = `
    invite: "Invite",
    inviteDesc: "+200 XP per friend.",
    copyLink: "Copy Link",
    performance: "📊 Performance",
    details: "DETAILS",
    matches: "MATCHES",
    points: "POINTS",
    score: "SCORE",
    lobbies: "⚽ Lobbies",
    championship: "🏆 ETHIOFANTASY CHAMPIONSHIP",
    leaveMatch: "Leave Match?",
    leaveWarning: "Your progress will be abandoned.",
    leaveBtn: "Leave",
    continueBtn: "Continue",
    rankingsTitle: "🎖️ Rankings",
    loadingRankings: "Loading Rankings..."
`;

const newAmKeys = `
    invite: "ጋብዝ",
    inviteDesc: "+200 XP በአንድ ጓደኛ",
    copyLink: "ሊንክ ኮፒ አድርግ",
    performance: "📊 አፈጻጸም",
    details: "ዝርዝር",
    matches: "ጨዋታዎች",
    points: "ነጥቦች",
    score: "ውጤት",
    lobbies: "⚽ ሎቢ",
    championship: "🏆 የኢትዮፋንታሲ ሻምፒዮና",
    leaveMatch: "ጨዋታውን ትተህ ውጣ?",
    leaveWarning: "ያለዎት እድገት ይጠፋል።",
    leaveBtn: "ውጣ",
    continueBtn: "ቀጥል",
    rankingsTitle: "🎖️ ደረጃዎች",
    loadingRankings: "ደረጃዎችን በመጫን ላይ..."
`;

const newOmKeys = `
    invite: "Afeeri",
    inviteDesc: "+200 XP hiriyaa tokkoon",
    copyLink: "Liinkii Kopi godhi",
    performance: "📊 Raawwii",
    details: "BAL'INA",
    matches: "TAPHOOTA",
    points: "QABXII",
    score: "FIRI",
    lobbies: "⚽ Lobbies",
    championship: "🏆 CHAMPIONSHIP ETHIOFANTASY",
    leaveMatch: "Tapha Dhiiftee Baataa?",
    leaveWarning: "Guddinni kee ni bada.",
    leaveBtn: "Bahi",
    continueBtn: "Itti Fufi",
    rankingsTitle: "🎖️ Sadarkaalee",
    loadingRankings: "Sadarkaalee fe'aa jira..."
`;

function injectKeys(filePath: string, keys: string) {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Find the end of the home section
    content = content.replace(/level: ".*"/, match => \`\${match},\${keys}\`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(\`Updated \${filePath}\`);
}

injectKeys(enPath, newEnKeys);
injectKeys(amPath, newAmKeys);
injectKeys(omPath, newOmKeys);

console.log("Translations added.");
