import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { MatchmakingService, OpponentMatchInfo } from '../../networking/multiplayer/MatchmakingService';
import { SaveManager } from '../../core/managers/SaveManager';
import type { UserRow } from '../../networking/supabase/types';

export class MatchmakingScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _saveManager: SaveManager;
    private _onMatchFound: (info: OpponentMatchInfo) => void;
    private _onCancel: () => void;

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        saveManager: SaveManager,
        onMatchFound: (info: OpponentMatchInfo) => void,
        onCancel: () => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._saveManager = saveManager;
        this._onMatchFound = onMatchFound;
        this._onCancel = onCancel;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;

        const currentUser: UserRow = {
            id: 'local-user',
            role: 'player',
            username: profile.username,
            phone: null,
            avatar_url: null,
            locale: 'en',
            elo_rating: profile.eloRating || 1200,
            coins: profile.coins,
            xp: profile.xp,
            total_matches: 10,
            total_wins: 6,
            subscription_tier: 'free',
            streak_count: profile.streakCount || 0,
            streak_last_date: null,
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString(),
            referral_code: null,
            referred_by: null
        };

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <!-- Top TV Broadcast Header Banner -->
                <div class="tv-broadcast-header" style="margin-bottom: 30px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="tv-live-badge">
                            <span class="tv-live-dot"></span> LIVE MATCHMAKING HD
                        </span>
                        <span class="tv-channel-logo">ETHIO TELECOM <span>SPORTS HD</span></span>
                    </div>

                    <div style="font-family: var(--tv-mono); font-weight: 800; font-size: 13px; color: var(--tv-gold-primary);">
                        ELO: ${profile.eloRating || 1200}
                    </div>
                </div>

                <div style="max-width: 500px; margin: 0 auto; position: relative; z-index: 10; text-align: center; padding: 0 20px;">
                    <div class="glass-card" style="
                        padding: 40px 28px;
                        border-color: rgba(96, 165, 250, 0.4);
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    ">
                        <span style="font-size: 11px; font-weight: 800; color: #60A5FA; letter-spacing: 2px;">
                            LIVE MULTIPLAYER MATCHMAKING
                        </span>
                        <h2 style="margin: 8px 0 24px 0; font-size: 26px; font-weight: 900; color: white;">
                            FINDING WORTHY OPPONENT...
                        </h2>

                        <!-- Radar Pulse Animation -->
                        <div style="position: relative; width: 140px; height: 140px; margin: 0 auto 30px auto;">
                            <div class="radar-circle circle-1"></div>
                            <div class="radar-circle circle-2"></div>
                            <div style="
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                font-size: 48px;
                            ">⚽</div>
                        </div>

                        <!-- Player Info Card -->
                        <div style="
                            background: rgba(15, 23, 42, 0.6);
                            border: 1px solid rgba(255,255,255,0.1);
                            border-radius: 14px;
                            padding: 16px;
                            margin-bottom: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: space-around;
                        ">
                            <div>
                                <div style="font-size: 12px; color: #94A3B8;">YOUR RATING</div>
                                <div style="font-size: 20px; font-weight: 900; color: #FFD700;">⚡ ${profile.eloRating || 1200} ELO</div>
                            </div>
                            <div style="height: 30px; width: 1px; background: rgba(255,255,255,0.1);"></div>
                            <div>
                                <div style="font-size: 12px; color: #94A3B8;">SEARCH RANGE</div>
                                <div style="font-size: 20px; font-weight: 900; color: #60A5FA;">±150 ELO</div>
                            </div>
                        </div>

                        <button id="cancel-mm-btn" class="broadcast-btn glass-card" style="width: 100%; color: #FCA5A5; border-color: rgba(239,68,68,0.3);">
                            ✖ CANCEL MATCHMAKING
                        </button>
                    </div>
                </div>
            </div>

            <style>
                .radar-circle {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 2px solid #60A5FA;
                    border-radius: 50%;
                    animation: pulseRadar 2s infinite ease-out;
                    box-sizing: border-box;
                }
                .circle-2 {
                    animation-delay: 1s;
                }
                @keyframes pulseRadar {
                    0% { transform: scale(0.3); opacity: 1; }
                    100% { transform: scale(1.3); opacity: 0; }
                }
            </style>
        `;

        const mmService = MatchmakingService.getInstance();
        const unsubscribe = mmService.onMatchFound((info) => {
            this._audioManager.playGoalCheer();
            this._onMatchFound(info);
        });

        root.querySelector('#cancel-mm-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            unsubscribe();
            mmService.leaveQueue(currentUser.id);
            this._onCancel();
        });

        await mmService.joinQueue(currentUser);
    }
}
