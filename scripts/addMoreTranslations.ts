import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'en.ts');
const amPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'am.ts');
const omPath = path.join(__dirname, '..', 'src', 'localization', 'locales', 'om.ts');

const newEnKeys = `
  settings: {
    title: "⚙️ SETTINGS",
    language: "Language",
    notifications: "Notifications",
    audio: "Audio & Sound",
    support: "Help & Support",
    legal: "Legal",
    account: "Account",
    signOut: "Sign Out",
    deleteAccount: "Delete Account",
    myProfile: "My Profile",
    soundFx: "Sound Effects",
    haptics: "Haptic Feedback",
    push: "Push Notifications",
    matchInvites: "Match Invites",
    dailyReminders: "Daily Reminders",
    backBtn: "❮ BACK"
  },
  profile: {
    title: "MY PROFILE",
    edit: "EDIT",
    gamesPlayed: "Games Played",
    winRate: "Win Rate",
    avgTime: "Avg Time",
    about: "ABOUT ME",
    noAbout: "No bio added yet.",
    achievements: "ACHIEVEMENTS",
    friends: "FRIENDS",
    invite: "Invite Friend",
    memberSince: "Member since {date}"
  },
  leaderboard: {
    global: "GLOBAL",
    weekly: "WEEKLY",
    friends: "FRIENDS",
    rank: "RANK",
    player: "PLAYER",
    score: "SCORE",
    topPlayers: "TOP PLAYERS",
    unranked: "Unranked"
  },
  auth: {
    loginTitle: "LOGIN",
    phonePlaceholder: "Phone Number",
    otpPlaceholder: "OTP Code",
    sendOtp: "SEND OTP",
    verify: "VERIFY",
    continue: "CONTINUE",
    guest: "PLAY AS GUEST"
  }
`;

const newAmKeys = `
  settings: {
    title: "⚙️ ቅንብሮች",
    language: "ቋንቋ",
    notifications: "ማሳወቂያዎች",
    audio: "ድምጽ",
    support: "እገዛ",
    legal: "ሕጋዊ",
    account: "መለያ",
    signOut: "ውጣ",
    deleteAccount: "መለያ አጥፋ",
    myProfile: "የእኔ መገለጫ",
    soundFx: "የድምጽ ውጤቶች",
    haptics: "ንዝረት",
    push: "የግፋ ማሳወቂያዎች",
    matchInvites: "የጨዋታ ጥሪዎች",
    dailyReminders: "የዕለት ማሳሰቢያዎች",
    backBtn: "❮ ተመለስ"
  },
  profile: {
    title: "መገለጫ",
    edit: "አስተካክል",
    gamesPlayed: "ጨዋታዎች",
    winRate: "የድል ምጣኔ",
    avgTime: "አማካይ ጊዜ",
    about: "ስለ እኔ",
    noAbout: "ምንም መግለጫ አልታከለም።",
    achievements: "ስኬቶች",
    friends: "ጓደኞች",
    invite: "ጓደኛ ጋብዝ",
    memberSince: "አባል ከ {date}"
  },
  leaderboard: {
    global: "ዓለም አቀፍ",
    weekly: "ሳምንታዊ",
    friends: "ጓደኞች",
    rank: "ደረጃ",
    player: "ተጫዋች",
    score: "ውጤት",
    topPlayers: "ምርጥ ተጫዋቾች",
    unranked: "ያልተመደበ"
  },
  auth: {
    loginTitle: "ግባ",
    phonePlaceholder: "ስልክ ቁጥር",
    otpPlaceholder: "OTP ኮድ",
    sendOtp: "ኮድ ላክ",
    verify: "አረጋግጥ",
    continue: "ቀጥል",
    guest: "እንደ እንግዳ ተጫወት"
  }
`;

const newOmKeys = `
  settings: {
    title: "⚙️ QINDEESSAA",
    language: "Afaan",
    notifications: "Beeksisoota",
    audio: "Sagalee",
    support: "Gargaarsa",
    legal: "Seera",
    account: "Herrega",
    signOut: "Bahi",
    deleteAccount: "Herrega Haqi",
    myProfile: "Pirofaayilii koo",
    soundFx: "Sagalee",
    haptics: "Haptics",
    push: "Beeksisoota",
    matchInvites: "Affeerraa Taphaa",
    dailyReminders: "Yaadachiisa Guyyaa",
    backBtn: "❮ DEEBI'I"
  },
  profile: {
    title: "PIROFAAYILII",
    edit: "SIRREESSI",
    gamesPlayed: "Taphoota",
    winRate: "Gita Injifannoo",
    avgTime: "Yeroo Giddugaleessaa",
    about: "WAA'EE KOO",
    noAbout: "Seenaan hin dabalatamne.",
    achievements: "MILKAA'INAA",
    friends: "HIRIYYOOTA",
    invite: "Hiriyaa Afeeri",
    memberSince: "Miseensa irraa {date}"
  },
  leaderboard: {
    global: "ADDUUNYAA",
    weekly: "TORBEE",
    friends: "HIRIYYOOTA",
    rank: "SADARKAA",
    player: "TAPHATAA",
    score: "FIRI",
    topPlayers: "TAPHATTOOTA CICCIMOO",
    unranked: "Sadarkaa hin qabu"
  },
  auth: {
    loginTitle: "SEENI",
    phonePlaceholder: "Lakkoofsa Bilbilaa",
    otpPlaceholder: "Koodii OTP",
    sendOtp: "Koodii Ergi",
    verify: "MIRKANEEFFADHU",
    continue: "ITTI FUFI",
    guest: "AKKA KEESSUMMAA TAPHA"
  }
`;

function appendToLocale(filePath: string, keysStr: string) {
    let content = fs.readFileSync(filePath, 'utf-8');
    // replace the last brace
    content = content.trim().replace(/};?$/, \`,\n\${keysStr}\n};\`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(\`Updated \${filePath}\`);
}

appendToLocale(enPath, newEnKeys);
appendToLocale(amPath, newAmKeys);
appendToLocale(omPath, newOmKeys);
