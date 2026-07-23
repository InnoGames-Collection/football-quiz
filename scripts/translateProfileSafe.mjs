import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'ui', 'screens', 'ProfileScreen.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const t = (en, am, om) => "\\${i18n.currentLocale === 'am' ? '" + am + "' : (i18n.currentLocale === 'om' ? '" + om + "' : '" + en + "')}";

// Top header
content = content.replace(/>MY PROFILE</g, ">" + t('MY PROFILE', 'መገለጫ', 'PIROFAAYILII') + "<");
content = content.replace(/div>EDIT</g, "div>" + t('EDIT', 'አስተካክል', 'SIRREESSI') + "<");

// Stats grid
content = content.replace(/>LEAGUE</g, ">" + t('LEAGUE', 'ሊግ', 'LIIGII') + "<");
content = content.replace(/>RANK</g, ">" + t('RANK', 'ደረጃ', 'SADARKAA') + "<");
content = content.replace(/>POINTS</g, ">" + t('POINTS', 'ነጥቦች', 'QABXII') + "<");
content = content.replace(/>Games Played</g, ">" + t('Games Played', 'የተጫወቱት ጨዋታዎች', 'Taphoota Taphataman') + "<");
content = content.replace(/>Win Rate</g, ">" + t('Win Rate', 'የማሸነፍ መጠን', 'Gita Injifannoo') + "<");
content = content.replace(/>Avg Time</g, ">" + t('Avg Time', 'አማካይ ጊዜ', 'Yeroo Giddugaleessaa') + "<");

// Lists
content = content.replace(/'Statistics'/g, t('Statistics', 'ስታቲስቲክስ', 'Istaatistiiksii'));
content = content.replace(/'Achievements'/g, t('Achievements', 'ስኬቶች', "Milkaa'ina"));
content = content.replace(/'My Awards'/g, t('My Awards', 'የእኔ ሽልማቶች', 'Badhaasa Koo'));
content = content.replace(/'Leaderboard'/g, t('Leaderboard', 'የመሪዎች ሰሌዳ', 'Gabatee Geggeessitootaa'));

content = content.replace(/'Invite Friends'/g, t('Invite Friends', 'ጓደኞችን ይጋብዙ', 'Hiriyoota Affeeri'));
content = content.replace(/'Subscription'/g, t('Subscription', 'ምዝገባ', 'Galmee'));
content = content.replace(/'Messages'/g, t('Messages', 'መልዕክቶች', 'Ergaawwan'));

content = content.replace(/'Settings'/g, t('Settings', 'ቅንብሮች', "Qindaa'inoota"));
content = content.replace(/'Help & Support'/g, t('Help & Support', 'እገዛ እና ድጋፍ', 'Gargaarsa & Deeggarsa'));
content = content.replace(/'About'/g, t('About', 'ስለ እኛ', "Waa'ee"));

// About me
content = content.replace(/>ABOUT ME</g, ">" + t('ABOUT ME', 'ስለ እኔ', "WAA'EE KOO") + "<");
content = content.replace(/>No bio added yet.</g, ">" + t('No bio added yet.', 'እስካሁን ምንም ባዮ አልታከለም።', 'Seenaan gabaabaa hin dabalatamne.') + "<");

// Missing Import
if (!content.includes("import { i18n } from '../../localization/i18n';")) {
    content = content.replace(/import { SaveManager }/, "import { i18n } from '../../localization/i18n';\\nimport { SaveManager }");
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('ProfileScreen updated successfully.');
