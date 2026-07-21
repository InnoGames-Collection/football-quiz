import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { MatchStats } from '../../core/quiz/QuizEngine';
import { ProgressionManager } from '../../core/managers/ProgressionManager';

export class MatchStatsScreen {
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _stats: MatchStats;
    private _gameId: string;
    private _onContinue: () => void;

    constructor(
        uiManager: UIManager,
        saveManager: SaveManager,
        audioManager: AudioManager,
        stats: MatchStats,
        gameId: string,
        onContinue: () => void
    ) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._stats = stats;
        this._gameId = gameId;
        this._onContinue = onContinue;

        // Persist XP earnings
        this._saveManager.addXp(this._stats.xpEarned);
        this._saveManager.updateHighScore(this._gameId, this._stats.goals * 100);
    }

    public render(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);
        const rank = ProgressionManager.getRank(profile.xp);
        const seasonInfo = ProgressionManager.getSeasonPassInfo(profile.xp);
        const achievementsUnlocked = this._stats.accuracy >= 80 ? '🎯 Perfect Matchmaster' : '⚽ League Match Finisher';
        const isMvp = this._stats.matchRating >= 7.5;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto;">
                <!-- Floodlight FX -->
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <!-- Top TV Broadcast Overlay Banner -->
                <div class="tv-broadcast-header">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="tv-live-badge" style="background: rgba(34, 197, 94, 0.15); border-color: #22C55E; color: #22C55E;">
                            <span class="tv-live-dot" style="background: #22C55E; box-shadow: 0 0 8px #22C55E;"></span> POST-MATCH BROADCAST
                        </span>
                        <span class="tv-channel-logo">ETHIO TELECOM <span>SPORTS HD</span></span>
                    </div>

                    <div style="font-family: var(--tv-mono); font-weight: 800; font-size: 13px; color: var(--tv-gold-primary);">
                        FINAL SCORE: ${this._stats.goals} GOALS
                    </div>
                </div>

                <div style="max-width: 620px; margin: 20px auto 40px auto; position: relative; z-index: 10; padding: 0 20px;">
                    <!-- Glassmorphism Broadcast Report Card -->
                    <div class="glass-card" style="
                        padding: 32px 26px;
                        text-align: center;
                        border-color: var(--tv-gold-primary);
                        box-shadow: 0 20px 60px rgba(0,0,0,0.85);
                        background: rgba(2, 6, 23, 0.9);
                    ">
                        <!-- Post-Match Title Header -->
                        <div style="font-size: 12px; font-weight: 900; color: var(--tv-pitch-green); letter-spacing: 3px; text-transform: uppercase;">
                            MATCHDAY OFFICIAL REPORT
                        </div>
                        <h1 style="font-size: 40px; font-weight: 900; color: var(--tv-gold-primary); margin: 6px 0 14px 0; letter-spacing: 1px;">
                            FULL TIME SUMMARY
                        </h1>

                        <!-- Player of the Match MVP Banner -->
                        <div class="glass-card" style="
                            padding: 12px 20px;
                            margin-bottom: 20px;
                            background: ${isMvp ? 'rgba(255, 215, 0, 0.15)' : 'rgba(30, 41, 59, 0.6)'};
                            border-color: ${isMvp ? '#FFD700' : 'rgba(255,255,255,0.1)'};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 12px;
                        ">
                            <span style="font-size: 24px;">🌟</span>
                            <div style="text-align: left;">
                                <div style="font-size: 10px; font-weight: 900; color: var(--tv-gold-primary); letter-spacing: 1.5px; text-transform: uppercase;">
                                    PLAYER OF THE MATCH (MVP)
                                </div>
                                <div style="font-size: 16px; font-weight: 900; color: white;">
                                    ${profile.username} <span style="font-size: 12px; color: #60A5FA;">(${rank.icon} ${rank.name})</span>
                                </div>
                            </div>
                        </div>

                        <!-- Match Rating Badge -->
                        <div style="
                            display: inline-block;
                            background: rgba(255, 215, 0, 0.12);
                            border: 1px solid var(--tv-gold-primary);
                            border-radius: 30px;
                            padding: 8px 22px;
                            font-weight: 900;
                            font-size: 15px;
                            color: var(--tv-gold-primary);
                            margin-bottom: 24px;
                            font-family: var(--tv-mono);
                        ">
                            MATCH RATING: ⭐ ${this._stats.matchRating} / 10.0
                        </div>

                        <!-- 6-Metric Match Telemetry Grid -->
                        <div style="
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 12px;
                            text-align: left;
                            margin-bottom: 24px;
                        ">
                            <!-- Goals -->
                            <div class="tv-stat-widget">
                                <div class="tv-stat-label">⚽ GOALS SCORED</div>
                                <div class="tv-stat-val" style="color: var(--tv-pitch-green);">${this._stats.goals} Goals</div>
                            </div>

                            <!-- Accuracy -->
                            <div class="tv-stat-widget">
                                <div class="tv-stat-label">🎯 ACCURACY</div>
                                <div class="tv-stat-val" style="color: #60A5FA;">${this._stats.accuracy}%</div>
                            </div>

                            <!-- Average Time -->
                            <div class="tv-stat-widget">
                                <div class="tv-stat-label">⏱️ AVG RESPONSE TIME</div>
                                <div class="tv-stat-val" style="color: #C084FC;">${this._stats.avgResponseTime}s</div>
                            </div>

                            <!-- Longest Streak -->
                            <div class="tv-stat-widget">
                                <div class="tv-stat-label">🔥 LONGEST STREAK</div>
                                <div class="tv-stat-val" style="color: #F59E0B;">${this._stats.maxCombo}x Streak</div>
                            </div>

                            <!-- XP Earned -->
                            <div class="tv-stat-widget">
                                <div class="tv-stat-label">⚡ XP EARNED</div>
                                <div class="tv-stat-val" style="color: #60A5FA;">+${this._stats.xpEarned} XP</div>
                            </div>

                            <!-- League Points -->
                            <div class="tv-stat-widget">
                                <div class="tv-stat-label">🏆 LEAGUE POINTS</div>
                                <div class="tv-stat-val" style="color: var(--tv-gold-primary);">+${this._stats.goals * 25} PTS</div>
                            </div>
                        </div>

                        <!-- Season Pass Progress Section -->
                        <div class="glass-card" style="padding: 16px; margin-bottom: 16px; text-align: left; border-color: #60A5FA;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="font-size: 11px; font-weight: 900; color: #60A5FA; letter-spacing: 1px;">
                                    🏆 SEASON 1 PASS PROGRESS
                                </span>
                                <span style="font-size: 12px; font-weight: 900; color: white; font-family: var(--tv-mono);">
                                    LEVEL ${seasonInfo.seasonLevel} / 50
                                </span>
                            </div>
                            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden;">
                                <div style="width: ${seasonInfo.progressPercent}%; height: 100%; background: linear-gradient(90deg, #60A5FA 0%, #3B82F6 100%);"></div>
                            </div>
                        </div>

                        <!-- Division Progress Section -->
                        <div class="glass-card" style="padding: 16px; margin-bottom: 20px; text-align: left; border-color: ${division.color};">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="font-size: 11px; font-weight: 900; color: ${division.color}; letter-spacing: 1px;">
                                    ${division.badge} PLAYER DIVISION PROGRESSION
                                </span>
                                <span style="font-size: 12px; font-weight: 900; color: white; font-family: var(--tv-mono);">
                                    ${division.name}
                                </span>
                            </div>
                            <div style="font-size: 11px; color: var(--tv-text-muted);">
                                WEEKLY PROMOTION ZONE: <strong style="color: white;">${division.weeklyPromotionZone}</strong>
                            </div>
                        </div>

                        <!-- Achievement Unlocks Badge Banner -->
                        <div style="
                            background: rgba(255, 215, 0, 0.08);
                            border: 1px dashed var(--tv-gold-primary);
                            border-radius: 12px;
                            padding: 12px 16px;
                            margin-bottom: 24px;
                            font-size: 13px;
                            color: #F8FAFC;
                            font-weight: bold;
                        ">
                            🎖️ UNLOCKED ACHIEVEMENT: <span style="color: var(--tv-gold-primary);">${achievementsUnlocked}</span>
                        </div>

                        <!-- Continue Button -->
                        <button id="claim-rewards-btn" class="broadcast-btn broadcast-btn-gold" style="width: 100%; font-size: 18px; padding: 18px;">
                            CLAIM REWARDS & RETURN TO MATCHDAY HUB 🏆
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('claim-rewards-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onContinue();
        });
    }
}
