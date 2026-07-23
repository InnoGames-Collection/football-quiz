import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'en.ts');
const amPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'am.ts');
const omPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'om.ts');

const newEnKeys = `
  daily: {
    title: "DAILY CHALLENGE",
    prizes: "Prizes",
    prizeDesc: "Top 100 Players get {amount} ETB",
    kickOff: "KICK OFF",
    leaderboard: "Leaderboard"
  },
  live: {
    title: "Live Match",
    opponent: "Opponent",
    waiting: "Waiting for Opponent",
    timesUp: "Time's Up",
    vs: "VS"
  },
  menu: {
    quiz: "QUIZ",
    best: "BEST: {score} PTS"
  },
  match: {
    ready: "Ready to test your knowledge, {playerName}?",
    loadingRewards: "Loading Rewards...",
    overview: "Overview",
    correct: "Correct",
    wrong: "Wrong",
    accuracy: "Accuracy",
    reviewGame: "REVIEW GAME",
    question: "Question",
    yourAnswer: "YOUR SELECTED ANSWER",
    like: "Like",
    post: "Post",
    questionCount: "QUESTION {current} OF {total}",
    goal: "⚽ GOAL!!!!!",
    saved: "🧤 SAVED!",
    halfTime: "HALF TIME",
    fullTime: "FULL TIME",
    matchStats: "MATCH STATISTICS",
    matchRating: "MATCH RATING",
    possession: "POSSESSION",
    maxCombo: "MAX COMBO",
    coinsEarned: "COINS EARNED",
    xpEarned: "XP EARNED",
    continue: "CONTINUE TO HUB",
    leaveMatch: "Leave Match?",
    leaveWarning: "Your progress will be abandoned.",
    leaveBtn: "Leave",
    continueBtn: "Continue"
  }
`;

const newAmKeys = `
  daily: {
    title: "የዕለቱ ተግዳሮት",
    prizes: "ሽልማቶች",
    prizeDesc: "ምርጥ 100 ተጫዋቾች {amount} ብር ያገኛሉ",
    kickOff: "ጀምር",
    leaderboard: "ደረጃ"
  },
  live: {
    title: "ቀጥታ ጨዋታ",
    opponent: "ተጋጣሚ",
    waiting: "ተጋጣሚ በመጠበቅ ላይ",
    timesUp: "ጊዜ አልቋል",
    vs: "ጋር"
  },
  menu: {
    quiz: "ጥያቄዎች",
    best: "ምርጥ: {score} ነጥብ"
  },
  match: {
    ready: "{playerName}፣ እውቀትዎን ለመፈተሽ ዝግጁ ነዎት?",
    loadingRewards: "ሽልማቶችን በመጫን ላይ...",
    overview: "አጠቃላይ እይታ",
    correct: "ትክክል",
    wrong: "ስህተት",
    accuracy: "ትክክለኛነት",
    reviewGame: "ጨዋታን ገምግም",
    question: "ጥያቄ",
    yourAnswer: "የመረጡት መልስ",
    like: "ወደድኩት",
    post: "ለጥፍ",
    questionCount: "ጥያቄ {current} ከ {total}",
    goal: "⚽ ጎል!!!!!",
    saved: "🧤 ተመለሰ!",
    halfTime: "እረፍት",
    fullTime: "ሙሉ ጊዜ",
    matchStats: "የጨዋታ ስታቲስቲክስ",
    matchRating: "የጨዋታ ደረጃ",
    possession: "ኳስ ቁጥጥር",
    maxCombo: "ከፍተኛ ተከታታይ",
    coinsEarned: "የተገኘ ሳንቲም",
    xpEarned: "የተገኘ XP",
    continue: "ወደ መነሻ ገጽ ተመለስ",
    leaveMatch: "ጨዋታውን ትተህ ውጣ?",
    leaveWarning: "ያለዎት እድገት ይጠፋል።",
    leaveBtn: "ውጣ",
    continueBtn: "ቀጥል"
  }
`;

const newOmKeys = `
  daily: {
    title: "QORUMSA GUYYAA",
    prizes: "Badhaasa",
    prizeDesc: "Taphattoota 100ffaa {amount} ETB argatu",
    kickOff: "EGGALI",
    leaderboard: "Sadarkaa"
  },
  live: {
    title: "Tapha Kallattii",
    opponent: "Morkataa",
    waiting: "Morkataa Eegaa Jira",
    timesUp: "Yeroon Dhumera",
    vs: "VS"
  },
  menu: {
    quiz: "GAAFFII",
    best: "OLAANAA: {score} FIRI"
  },
  match: {
    ready: "{playerName}, beekumsa kee qoruuf qophaa'aa?",
    loadingRewards: "Badhaasa Fe'aa Jira...",
    overview: "Waliigala",
    correct: "Sirrii",
    wrong: "Dogoggora",
    accuracy: "Sirreessuu",
    reviewGame: "TAPHA IRRA DEEBI'I ILAALI",
    question: "Gaaffii",
    yourAnswer: "DEEBII FILATTE",
    like: "Jaalladhu",
    post: "Maxxansi",
    questionCount: "GAAFFII {current} KEESSAA {total}",
    goal: "⚽ GOOLII!!!!!",
    saved: "🧤 QABAMEERA!",
    halfTime: "BOQONNAA",
    fullTime: "XUMURAMEERA",
    matchStats: "RAGAA TAPHA",
    matchRating: "SADARKAA TAPHA",
    possession: "QABACHUU",
    maxCombo: "WAL-IRRAA OLAANAA",
    coinsEarned: "SANTIIMA ARGAME",
    xpEarned: "XP ARGATAME",
    continue: "GARA FUULA DURAA DEEBI'I",
    leaveMatch: "Tapha Dhiiftee Baataa?",
    leaveWarning: "Guddinni kee ni bada.",
    leaveBtn: "Bahi",
    continueBtn: "Itti Fufi"
  }
`;

function fixFile(filePath, keysStr) {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Slice at the "daily:" block
    let idx = content.indexOf('daily: {');
    if (idx !== -1) {
        content = content.substring(0, idx - 1); // remove the comma before daily: {
    } else {
        // Find auth end
        idx = content.indexOf('guest: "');
        if (idx !== -1) {
            let nextBrace = content.indexOf('}', idx);
            content = content.substring(0, nextBrace + 1);
        }
    }
    
    // Now append the rest
    content = content.trim();
    if (content.endsWith('};')) {
        content = content.slice(0, -2);
    } else if (content.endsWith('}')) {
        content = content.slice(0, -1);
    }
    
    content += ",\\n" + keysStr + "\\n};";
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Fixed " + filePath);
}

fixFile(enPath, newEnKeys);
fixFile(amPath, newAmKeys);
fixFile(omPath, newOmKeys);
