import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';

export class DetailedStatsScreen {
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _onBack: () => void;

    constructor(uiManager: UIManager, saveManager: SaveManager, audioManager: AudioManager, onBack: () => void) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._onBack = onBack;
    }

    public render(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);

        // Stats calculations
        const gamesPlayed = profile.totalMatches || 0;
        const completed = gamesPlayed; // assume all finished for Vas stats
        const winRate = gamesPlayed > 0 ? Math.round(((profile.totalWins || 0) / gamesPlayed) * 100) : 0;
        const accuracy = winRate; // simplified mapping for mock stats
        const points = profile.xp;
        const highestScore = profile.highScores['football-quiz'] || 0;
        const avgTime = '12.4s';
        const avgSession = '4.8m';
        const lifelinesUsed = '14';
        const correct = Math.round(gamesPlayed * 6.8);
        const wrong = Math.round(gamesPlayed * 2.2);
        const skipped = Math.round(gamesPlayed * 1.0);

        const cardStyle = `
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
            border-color: rgba(255,255,255,0.08);
        `;

        const row = (label: string, value: string) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
                <div style="font-size: 14px; font-weight: 700; color: #94A3B8;">${label}</div>
                <div style="font-size: 14px; font-weight: 900; color: white;">${value}</div>
            </div>
        `;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- App Bar -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: flex-start; padding-left: 8px;">
                    <button id="btn-stats-back" style="
                        background: none; border: none; color: white; font-size: 24px; padding: 8px 16px; cursor: pointer;
                    ">❮</button>
                    <div style="font-weight: 900; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase;">DETAILED STATISTICS</div>
                </div>

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <!-- 1. Game Overview -->
                    <div style="font-size: 12px; font-weight: 800; color: #38BDF8; margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📊 Game Overview</div>
                    <div class="glass-card" style="${cardStyle}">
                        ${row('Games Played', String(gamesPlayed))}
                        ${row('Completed Matches', String(completed))}
                        ${row('Overall Accuracy', `${accuracy}%`)}
                        <div style="border-bottom: none;">
                            ${row('Total Points Earned', `${points} XP`)}
                        </div>
                    </div>

                    <!-- 2. Performance -->
                    <div style="font-size: 12px; font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">⚡ Performance</div>
                    <div class="glass-card" style="${cardStyle}">
                        ${row('Highest Score (Match)', String(highestScore))}
                        ${row('Average Response Time', avgTime)}
                        ${row('Average Session Duration', avgSession)}
                        <div style="border-bottom: none;">
                            ${row('Lifelines Used', lifelinesUsed)}
                        </div>
                    </div>

                    <!-- 3. Questions Details -->
                    <div style="font-size: 12px; font-weight: 800; color: #F472B6; margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">❓ Questions Telemetry</div>
                    <div class="glass-card" style="${cardStyle}">
                        ${row('Correct Answers', String(correct))}
                        ${row('Wrong Answers', String(wrong))}
                        <div style="border-bottom: none;">
                            ${row('Skipped Questions', String(skipped))}
                        </div>
                    </div>

                    <!-- 4. Competition & Achievements -->
                    <div style="font-size: 12px; font-weight: 800; color: #A78BFA; margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🏆 Competition Status</div>
                    <div class="glass-card" style="${cardStyle}">
                        ${row('Current League', division.name)}
                        ${row('Tournament Rank', 'Top 5%')}
                        ${row('Weekly Rank', '#12')}
                        ${row('Monthly Rank', '#8')}
                        <div style="border-bottom: none;">
                            ${row('Achievements Unlocked', '8 / 16')}
                        </div>
                    </div>

                </div>
            </div>
        `;

        document.getElementById('btn-stats-back')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onBack();
        });
    }
}
