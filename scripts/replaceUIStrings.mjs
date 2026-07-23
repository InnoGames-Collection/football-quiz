import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uiDir = path.join(__dirname, '..', 'src', 'ui', 'screens');

// Define replacements per file
const replacements = {
    'LeaderboardScreen.ts': [
        [/>GLOBAL</g, ">\\${t('leaderboard.global')}<"],
        [/>WEEKLY</g, ">\\${t('leaderboard.weekly')}<"],
        [/>FRIENDS</g, ">\\${t('leaderboard.friends')}<"],
        [/>RANK</g, ">\\${t('leaderboard.rank')}<"],
        [/>PLAYER</g, ">\\${t('leaderboard.player')}<"],
        [/>SCORE</g, ">\\${t('leaderboard.score')}<"],
        [/text: 'GLOBAL'/g, "text: t('leaderboard.global')"],
        [/text: 'WEEKLY'/g, "text: t('leaderboard.weekly')"],
        [/text: 'FRIENDS'/g, "text: t('leaderboard.friends')"],
        [/>TOP PLAYERS</g, ">\\${t('leaderboard.topPlayers')}<"],
        [/Unranked/g, "\\${t('leaderboard.unranked')}"],
        [/import \{ UIManager \} from '\.\.\/\.\.\/core\/managers\/UIManager';/g, "import { UIManager } from '../../core/managers/UIManager';\\nimport { t } from '../../localization/i18n';"]
    ],
    'AuthScreen.ts': [
        [/>LOGIN</g, ">\\${t('auth.loginTitle')}<"],
        [/placeholder="Phone Number"/g, "placeholder=\"\\${t('auth.phonePlaceholder')}\""],
        [/placeholder="OTP Code"/g, "placeholder=\"\\${t('auth.otpPlaceholder')}\""],
        [/text: 'SEND OTP'/g, "text: t('auth.sendOtp')"],
        [/text: 'VERIFY'/g, "text: t('auth.verify')"],
        [/text: 'CONTINUE'/g, "text: t('auth.continue')"],
        [/text: 'PLAY AS GUEST'/g, "text: t('auth.guest')"],
        [/import \{ UIManager \} from '\.\.\/\.\.\/core\/managers\/UIManager';/g, "import { UIManager } from '../../core/managers/UIManager';\\nimport { t } from '../../localization/i18n';"]
    ]
};

function processFiles() {
    for (const [filename, rules] of Object.entries(replacements)) {
        const filePath = path.join(uiDir, filename);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf-8');
            for (const [pattern, replacement] of rules) {
                content = content.replace(pattern, replacement);
            }
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log("Processed " + filename);
        } else {
            console.warn("File not found: " + filePath);
        }
    }
}

processFiles();
