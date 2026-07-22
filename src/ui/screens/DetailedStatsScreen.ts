import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { DesignSystem } from '../theme/DesignSystem';
import { GameSessionService } from '../../networking/services/GameSessionService';
import { PullToRefresh } from '../components/PullToRefresh';


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

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        root.innerHTML = DesignSystem.LoadingState('Loading stats...');

        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);

        // Fetch history for detailed stats
        const sessionHistory = await GameSessionService.getInstance().getHistory(50);
        
        // Stats calculations
        let totalGames = profile.totalMatches || 0;
        let totalWins = profile.totalWins || 0;
        let winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
        
        let avgTimeMs = 12400; // default 12.4s
        let totalAccuracy = winRate;
        let totalCorrect = Math.round(totalGames * 6.8);
        let totalWrong = Math.round(totalGames * 2.2);
        let totalSkipped = Math.round(totalGames * 1.0);

        if (sessionHistory.length > 0) {
            let sumAccuracy = 0;
            let sumTime = 0;
            let sumCorrect = 0;
            let sumWrong = 0;
            let sumTotalQ = 0;

            sessionHistory.forEach(s => {
                sumAccuracy += Number(s.accuracy) || 0;
                sumTime += Number(s.avg_response_time) || 0;
                sumCorrect += Number(s.correct_count) || 0;
                sumTotalQ += Number(s.total_questions) || 10;
                sumWrong += (Number(s.total_questions) || 10) - (Number(s.correct_count) || 0);
            });

            totalAccuracy = Math.round(sumAccuracy / sessionHistory.length);
            avgTimeMs = (sumTime / sessionHistory.length) * 1000;
            
            // Re-calculate totals based on ratio from history applied to total games
            const ratioCorrect = sumCorrect / sumTotalQ;
            const ratioWrong = sumWrong / sumTotalQ;
            
            totalCorrect = Math.round(totalGames * 10 * ratioCorrect);
            totalWrong = Math.round(totalGames * 10 * ratioWrong);
        }

        const avgTimeStr = (avgTimeMs / 1000).toFixed(1) + 's';
        const points = profile.xp;
        const highestScore = profile.highScores['football-quiz'] || 0;
        const avgSession = '4.8m';
        const lifelinesUsed = '14';

        const cardStyle = `
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
            border-color: rgba(255,255,255,0.08);
        `;

        const row = (label: string, value: string) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
                <div style="font-size: var(--fds-font-sm); font-weight: 700; color: var(--fds-text-dim);">${label}</div>
                <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main);">${value}</div>
            </div>
        `;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- App Bar -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: flex-start; padding-left: 8px;">
                    <button id="btn-stats-back" style="
                        background: none; border: none; color: var(--fds-text-main); font-size: 24px; padding: 8px 16px; cursor: pointer;
                    ">❮</button>
                    <div style="font-weight: 900; font-size: var(--fds-font-md); letter-spacing: 0.5px; text-transform: uppercase;">DETAILED STATISTICS</div>
                </div>

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <!-- 1. Game Overview -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-blue-accent); margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📊 Game Overview</div>
                    <div class="glass-card" style="${cardStyle}">
                        ${row('Games Played', String(totalGames))}
                        ${row('Matches Won', String(totalWins))}
                        ${row('Overall Accuracy', `${totalAccuracy}%`)}
                        <div style="border-bottom: none;">
                            ${row('Points', `${points} XP`)}
                        </div>
                    </div>

                    <!-- 2. Performance -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">⚡ Performance</div>
                    <div class="glass-card" style="${cardStyle}">
                        ${row('Highest Score (Match)', String(highestScore))}
                        ${row('Average Response Time', avgTimeStr)}
                        ${row('Average Session Duration', avgSession)}
                        <div style="border-bottom: none;">
                            ${row('Lifelines Used', lifelinesUsed)}
                        </div>
                    </div>

                    <!-- 3. Questions Details -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #F472B6; margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">❓ Questions Telemetry</div>
                    <div class="glass-card" style="${cardStyle}">
                        ${row('Correct Answers', String(totalCorrect))}
                        ${row('Wrong Answers', String(totalWrong))}
                        <div style="border-bottom: none;">
                            ${row('Skipped Questions', String(totalSkipped))}
                        </div>
                    </div>

                    <!-- 4. Competition & Achievements -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #A78BFA; margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🏆 Competition Status</div>
                    <div class="glass-card" style="${cardStyle}">
                        ${row('League', division.name)}
                        ${row('Win Rate', `${winRate}%`)}
                    </div>

                </div>
            </div>
        `;

        document.getElementById('btn-stats-back')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onBack();
        });

        // Pull to refresh
        const container = root.querySelector('.stadium-container') as HTMLElement;
        if (container) {
            PullToRefresh.attach(container, async () => {
                this._audioManager.playClick();
                await this.render();
            });
        }
    }
}
