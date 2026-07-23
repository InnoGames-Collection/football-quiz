import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'ui', 'screens', 'LeaderboardScreen.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const t = (en, am, om) => "\\${i18n.currentLocale === 'am' ? '" + am + "' : (i18n.currentLocale === 'om' ? '" + om + "' : '" + en + "')}";

content = content.replace(/>GLOBAL</g, ">" + t('GLOBAL', 'ዓለም አቀፍ', 'ADDUUNYAA') + "<");
content = content.replace(/>WEEKLY</g, ">" + t('WEEKLY', 'ሳምንታዊ', 'TORBEE') + "<");
content = content.replace(/>FRIENDS</g, ">" + t('FRIENDS', 'ጓደኞች', 'HIRIYYOOTA') + "<");
content = content.replace(/>RANK</g, ">" + t('RANK', 'ደረጃ', 'SADARKAA') + "<");
content = content.replace(/>PLAYER</g, ">" + t('PLAYER', 'ተጫዋች', 'TAPHATAA') + "<");
content = content.replace(/>SCORE</g, ">" + t('SCORE', 'ውጤት', 'FIRI') + "<");
content = content.replace(/>TOP PLAYERS</g, ">" + t('TOP PLAYERS', 'ምርጥ ተጫዋቾች', 'TAPHATTOOTA CICCIMOO') + "<");
content = content.replace(/Unranked/g, "\\${i18n.currentLocale === 'am' ? 'ያልተመደበ' : (i18n.currentLocale === 'om' ? 'Sadarkaa hin qabu' : 'Unranked')}");

// Also the SegmentedControl options:
content = content.replace(/'GLOBAL'/g, "\\${i18n.currentLocale === 'am' ? 'ዓለም አቀፍ' : (i18n.currentLocale === 'om' ? 'ADDUUNYAA' : 'GLOBAL')}");
content = content.replace(/'WEEKLY'/g, "\\${i18n.currentLocale === 'am' ? 'ሳምንታዊ' : (i18n.currentLocale === 'om' ? 'TORBEE' : 'WEEKLY')}");
content = content.replace(/'FRIENDS'/g, "\\${i18n.currentLocale === 'am' ? 'ጓደኞች' : (i18n.currentLocale === 'om' ? 'HIRIYYOOTA' : 'FRIENDS')}");

if (!content.includes("import { i18n } from '../../localization/i18n';")) {
    content = content.replace(/import { SaveManager }/, "import { i18n } from '../../localization/i18n';\\nimport { SaveManager }");
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('LeaderboardScreen updated successfully.');
