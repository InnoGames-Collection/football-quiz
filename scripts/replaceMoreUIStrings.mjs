import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uiDir = path.join(__dirname, '..', 'src', 'ui', 'screens');

// Define replacements per file
const replacements = {
    'MatchStatsScreen.ts': [
        [/>Loading Rewards...</g, ">\\${t('match.loadingRewards')}<"],
        [/>Overview</g, ">\\${t('match.overview')}<"],
        [/>Correct</g, ">\\${t('match.correct')}<"],
        [/>Wrong</g, ">\\${t('match.wrong')}<"],
        [/>Accuracy</g, ">\\${t('match.accuracy')}<"],
        [/>REVIEW GAME</g, ">\\${t('match.reviewGame')}<"],
        [/>Question \\$\\{idx \+ 1\\}</g, ">\\${t('match.question')} \\${idx + 1}<"],
        [/>YOUR SELECTED ANSWER</g, ">\\${t('match.yourAnswer')}<"],
        [/>Like</g, ">\\${t('match.like')}<"],
        [/>Post</g, ">\\${t('match.post')}<"],
        [/import \{ UIManager \} from '\.\.\/\.\.\/core\/managers\/UIManager';/g, "import { UIManager } from '../../core/managers/UIManager';\\nimport { t } from '../../localization/i18n';"]
    ],
    'DailyChallengeScreen.ts': [
        [/>DAILY CHALLENGE</g, ">\\${t('daily.title')}<"],
        [/>Prizes</g, ">\\${t('daily.prizes')}<"],
        [/>Top 100 Players get \\$\\{Math\.floor/g, ">\\${t('daily.prizeDesc').replace('{amount}', Math.floor"],
        [/>Top 100 Players get {amount}/g, ">\\${t('daily.prizeDesc')}"], // Fallback
        [/>KICK OFF</g, ">\\${t('daily.kickOff')}<"],
        [/>Leaderboard</g, ">\\${t('daily.leaderboard')}<"],
        [/import \{ UIManager \} from '\.\.\/\.\.\/core\/managers\/UIManager';/g, "import { UIManager } from '../../core/managers/UIManager';\\nimport { t } from '../../localization/i18n';"]
    ],
    'LiveMatchScreen.ts': [
        [/>Live Match</g, ">\\${t('live.title')}<"],
        [/>Opponent</g, ">\\${t('live.opponent')}<"],
        [/>Waiting for Opponent</g, ">\\${t('live.waiting')}<"],
        [/>Time's Up</g, ">\\${t('live.timesUp')}<"],
        [/>VS</g, ">\\${t('live.vs')}<"],
        [/import \{ UIManager \} from '\.\.\/\.\.\/core\/managers\/UIManager';/g, "import { UIManager } from '../../core/managers/UIManager';\\nimport { t } from '../../localization/i18n';"]
    ],
    'MainMenuScreen.ts': [
        [/>QUIZ</g, ">\\${t('menu.quiz')}<"],
        [/>BEST: \\$\\{highScore\\} PTS</g, ">\\${t('menu.best').replace('{score}', String(highScore))}<"],
        [/text: 'PLAY'/g, "text: t('common.play')"],
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
