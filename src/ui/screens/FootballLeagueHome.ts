import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { UIManager } from '../../core/managers/UIManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { ReturningPlayerModal } from '../components/ReturningPlayerModal';
import { DesignSystem } from '../theme/DesignSystem';

export interface FootballHomeCallbacks {
    onKickOff: () => void;
    onLiveMatch: () => void;
    onDailyChallenge: () => void;
    onCompetitions: () => void;
    onLeaderboard: () => void;
    onAchievements: () => void;
    onAdminPanel: () => void;
    onSettings: () => void;
    onNotifications?: () => void;
    onViewStats?: () => void;
    onMessages?: () => void;
}

export class FootballLeagueHome {
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _uiManager: UIManager;
    private _callbacks: FootballHomeCallbacks;

    constructor(saveManager: SaveManager, audioManager: AudioManager, uiManager: UIManager, callbacks: FootballHomeCallbacks) {
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._uiManager = uiManager;
        this._callbacks = callbacks;
    }

    public render(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);
        
        const gamesPlayed = profile.totalMatches || 0;
        const winRate = gamesPlayed > 0 ? Math.round(((profile.totalWins || 0) / gamesPlayed) * 100) : 0;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- TOP APP BAR -->
                <div class="tv-broadcast-header" style="justify-content: space-between; padding: 12px 16px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <!-- Left: Masked MSISDN -->
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 16px;">👤</span>
                        <span style="font-weight: 800; font-size: 15px; color: #CBD5E1; font-family: var(--fds-font-mono);">${this._maskPhone(profile.phone || '251911223345')}</span>
                    </div>
                    <!-- Right: Notification & Settings Toggles -->
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <button id="btn-notif" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 4px; display: flex; align-items: center;">
                            🔔
                        </button>
                        <button id="btn-settings" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 4px; display: flex; align-items: center;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- COMPACT TELEMETRY ROW -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px; background: rgba(0,0,0,0.35); border-bottom: 1px solid rgba(255,255,255,0.06); text-align: center;">
                    <div>
                        <div style="font-size: 10px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Current League</div>
                        <div style="font-size: 14px; font-weight: 900; color: ${division.color}; margin-top: 4px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                            <span>${division.badge}</span> <span>${division.name}</span>
                        </div>
                    </div>
                    <div style="border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 10px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Current Rank</div>
                        <div style="font-size: 14px; font-weight: 900; color: white; margin-top: 4px;">#4</div>
                    </div>
                    <div>
                        <div style="font-size: 10px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Current Points</div>
                        <div style="font-size: 14px; font-weight: 900; color: var(--tv-gold-primary); margin-top: 4px;">${profile.xp} XP</div>
                    </div>
                </div>

                <!-- SCROLLABLE BODY CONTENT -->
                <div style="max-width: 960px; margin: 0 auto; padding: 16px;">
                    
                    <!-- AD BANNER PLACEHOLDER -->
                    <div class="glass-card" style="
                        background: linear-gradient(90deg, #1E3A8A 0%, #3B82F6 100%);
                        padding: 16px;
                        border-radius: 12px;
                        margin-bottom: 20px;
                        position: relative;
                        overflow: hidden;
                        border-color: rgba(59, 130, 246, 0.4);
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2;">
                            <div>
                                <div style="font-size: 10px; font-weight: 800; color: #93C5FD; text-transform: uppercase; letter-spacing: 1px;">SPONSORED ADVERTISEMENT</div>
                                <div style="font-size: 15px; font-weight: 900; color: white; margin-top: 4px;">ETHIO TELECOM 5G</div>
                                <div style="font-size: 12px; color: #DBEAFE; margin-top: 2px;">Experience Ultra-Fast Internet & Quiz Night Prizes!</div>
                            </div>
                            <div style="font-size: 28px; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));">🚀</div>
                        </div>
                        <div style="position: absolute; top: -50%; right: -20%; width: 120px; height: 120px; background: radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 60%); pointer-events: none; z-index: 1;"></div>
                    </div>

                    <!-- 1. DAILY CHALLENGE -->
                    <div class="glass-card" style="border-color: var(--tv-gold-primary); background: linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(15,23,42,0.85) 100%); padding: 20px; text-align: center; margin-bottom: 20px; cursor: pointer; position: relative;" id="card-daily">
                        <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
                        <div style="font-size: 18px; font-weight: 900; color: var(--tv-gold-primary); margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase;">DAILY CHALLENGE</div>
                        <div style="font-size: 13px; color: #CBD5E1; margin-bottom: 16px;">Test your knowledge in today's football quiz and double your reward points!</div>
                        ${DesignSystem.Button({ id: 'btn-daily-match', text: 'PLAY NOW (+500 XP)', variant: 'gold', fullWidth: true })}
                    </div>

                    <!-- 2. YOUR STATISTICS (MINIMAL) -->
                    <div class="glass-card" style="padding: 16px; border-color: #F472B6; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-size: 11px; font-weight: 800; color: #F472B6; text-transform: uppercase; letter-spacing: 0.5px;">📊 Your Statistics</div>
                            <button id="btn-view-all-stats" style="background: none; border: none; color: #F472B6; font-size: 12px; font-weight: 800; cursor: pointer; text-decoration: underline;">VIEW ALL</button>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); text-align: center;">
                            <div>
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">QUESTIONS</div>
                                <div style="font-size: 15px; font-weight: 900; color: white; margin-top: 4px;">${gamesPlayed * 10}</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.06);">
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">ACCURACY</div>
                                <div style="font-size: 15px; font-weight: 900; color: white; margin-top: 4px;">${winRate}%</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.06);">
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">POINTS</div>
                                <div style="font-size: 15px; font-weight: 900; color: white; margin-top: 4px;">${profile.xp} XP</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.06);">
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">SCORE</div>
                                <div style="font-size: 15px; font-weight: 900; color: var(--tv-gold-primary); margin-top: 4px;">${profile.eloRating || 1200}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. QUICK ACTIONS (Invite Friends, Leaderboard, Messages, Referral) -->
                    <div style="font-size: 11px; font-weight: 800; color: #38BDF8; margin-bottom: 8px; margin-left: 4px; text-transform: uppercase; letter-spacing: 0.5px;">⚡ Quick Actions</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                        <button id="btn-action-invite" class="glass-card" style="padding: 12px; border-color: var(--tv-pitch-green); display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(34,197,94,0.08); min-height: 80px; gap: 6px; cursor: pointer; transition: all 0.2s; border-radius: 12px;">
                            <span style="font-size: 24px;">👥</span>
                            <span style="font-size: 12px; font-weight: 800; color: var(--tv-pitch-green); text-transform: uppercase;">Invite Friends</span>
                        </button>
                        <button id="btn-action-leaderboard" class="glass-card" style="padding: 12px; border-color: var(--tv-gold-primary); display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,215,0,0.08); min-height: 80px; gap: 6px; cursor: pointer; transition: all 0.2s; border-radius: 12px;">
                            <span style="font-size: 24px;">📊</span>
                            <span style="font-size: 12px; font-weight: 800; color: var(--tv-gold-primary); text-transform: uppercase;">Leaderboard</span>
                        </button>
                        <button id="btn-action-messages" class="glass-card" style="padding: 12px; border-color: #38BDF8; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(56,189,248,0.08); min-height: 80px; gap: 6px; cursor: pointer; transition: all 0.2s; border-radius: 12px;">
                            <span style="font-size: 24px;">💬</span>
                            <span style="font-size: 12px; font-weight: 800; color: #38BDF8; text-transform: uppercase;">Messages</span>
                        </button>
                        <button id="btn-action-referral" class="glass-card" style="padding: 12px; border-color: #A78BFA; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(167,139,250,0.08); min-height: 80px; gap: 6px; cursor: pointer; transition: all 0.2s; border-radius: 12px;">
                            <span style="font-size: 24px;">🎁</span>
                            <span style="font-size: 12px; font-weight: 800; color: #A78BFA; text-transform: uppercase;">Referral</span>
                        </button>
                    </div>

                    <!-- 4. LATEST TOURNAMENT WINNERS -->
                    <div class="glass-card" style="padding: 16px; margin-bottom: 20px; border-color: rgba(255,215,0,0.2);">
                        <div style="font-size: 11px; font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🎖️ Tournament Winners</div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; font-weight: 700; color: white;">🥇 Abebe K.</span>
                                <span style="font-size: 12px; font-weight: 800; color: var(--tv-gold-primary);">5800 pts</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; font-weight: 700; color: #CBD5E1;">🥈 Yonas M.</span>
                                <span style="font-size: 12px; font-weight: 800; color: #94A3B8;">5100 pts</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; font-weight: 700; color: #94A3B8;">🥉 Biruk T.</span>
                                <span style="font-size: 12px; font-weight: 800; color: #64748B;">4950 pts</span>
                            </div>
                        </div>
                    </div>

                    <!-- 5. UPCOMING COMPETITIONS -->
                    <div class="glass-card" style="padding: 16px; margin-bottom: 20px; border-color: #A78BFA;">
                        <div style="font-size: 11px; font-weight: 800; color: #A78BFA; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📅 Upcoming Competitions</div>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-size: 13px; font-weight: 800; color: white;">⚽ Ethiopian Premier Derby</div>
                                    <div style="font-size: 11px; color: #A78BFA; margin-top: 2px;">Walia Cup Qualifier</div>
                                </div>
                                <span style="font-size: 12px; font-weight: 800; color: white; background: rgba(167,139,250,0.15); padding: 4px 8px; border-radius: 4px;">Today 20:00 EAT</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-size: 13px; font-weight: 800; color: white;">🌍 CAF Champions League Quiz</div>
                                    <div style="font-size: 11px; color: #A78BFA; margin-top: 2px;">Continental Trivia</div>
                                </div>
                                <span style="font-size: 12px; font-weight: 800; color: white; background: rgba(167,139,250,0.15); padding: 4px 8px; border-radius: 4px;">Saturday 18:00 EAT</span>
                            </div>
                        </div>
                    </div>

                    <!-- 6. RECENT ACTIVITY -->
                    <div class="glass-card" style="padding: 16px; border-color: #F472B6; margin-bottom: 20px;">
                        <div style="font-size: 11px; font-weight: 800; color: #F472B6; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">⏱️ Recent Activity</div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 24px;">🎯</span>
                            <div style="flex: 1;">
                                <div style="font-size: 13px; font-weight: 800; color: white;">Solo Match Completed</div>
                                <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">Walia Ibex Division</div>
                            </div>
                            <span style="font-size: 13px; font-weight: 800; color: #22C55E;">+240 XP</span>
                        </div>
                    </div>

                </div>
            </div>
            
            <!-- Quick Actions Modals Container -->
            <div id="quick-action-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; pointer-events: auto;">
                <div class="glass-card" style="width: 100%; max-width: 400px; padding: 24px; border-color: var(--tv-gold-primary); text-align: center; background: rgba(15,23,42,0.95); position: relative;">
                    <button id="btn-close-modal" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #94A3B8; font-size: 16px; cursor: pointer;">✖</button>
                    <div id="modal-content"></div>
                </div>
            </div>
        `;

        ReturningPlayerModal.checkAndShow(this._uiManager, this._saveManager, this._audioManager);
        this._bindEvents();
    }

    private _bindEvents(): void {
        document.getElementById('btn-settings')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._callbacks.onSettings) this._callbacks.onSettings();
        });

        document.getElementById('btn-notif')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._callbacks.onNotifications) this._callbacks.onNotifications();
        });

        document.getElementById('btn-view-all-stats')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._callbacks.onViewStats) this._callbacks.onViewStats();
        });

        document.getElementById('btn-action-leaderboard')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onLeaderboard();
        });

        document.getElementById('btn-action-messages')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._callbacks.onMessages) this._callbacks.onMessages();
        });

        document.getElementById('btn-daily-match')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this._audioManager.playClick();
            this._callbacks.onDailyChallenge();
        });
        document.getElementById('card-daily')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onDailyChallenge();
        });

        // Modal triggers
        const modal = document.getElementById('quick-action-modal');
        const modalContent = document.getElementById('modal-content');
        const closeModal = document.getElementById('btn-close-modal');

        const showModal = (html: string) => {
            if (modal && modalContent) {
                modalContent.innerHTML = html;
                modal.style.display = 'flex';
            }
        };

        closeModal?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (modal) modal.style.display = 'none';
        });

        document.getElementById('btn-action-invite')?.addEventListener('click', () => {
            this._audioManager.playClick();
            showModal(`
                <div style="font-size: 40px; margin-bottom: 12px;">👥</div>
                <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 8px; text-transform: uppercase;">Invite Friends</div>
                <div style="font-size: 13px; color: #CBD5E1; margin-bottom: 16px;">Share EthioFantasy with your friends and win 100 free coins on their first game!</div>
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.15); font-size: 12px; color: var(--tv-gold-primary); font-family: monospace; margin-bottom: 16px; word-break: break-all;">https://ethiofantasy.com/join?ref=251911223345</div>
                <button id="btn-copy-invite" style="width: 100%; padding: 12px; background: var(--tv-pitch-green); color: white; border: none; border-radius: 8px; font-weight: 800; cursor: pointer;">COPY LINK</button>
            `);
            document.getElementById('btn-copy-invite')?.addEventListener('click', () => {
                this._audioManager.playClick();
                navigator.clipboard.writeText('https://ethiofantasy.com/join?ref=251911223345');
                const btn = document.getElementById('btn-copy-invite');
                if (btn) {
                    btn.innerText = 'COPIED ✅';
                    btn.style.background = 'rgba(255,255,255,0.1)';
                }
            });
        });

        document.getElementById('btn-action-referral')?.addEventListener('click', () => {
            this._audioManager.playClick();
            showModal(`
                <div style="font-size: 40px; margin-bottom: 12px;">🎁</div>
                <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 8px; text-transform: uppercase;">Referral Code</div>
                <div style="font-size: 13px; color: #CBD5E1; margin-bottom: 16px;">Have a referral code from a friend? Enter it below to unlock a 200 Coin bonus!</div>
                <input type="text" id="referral-input" placeholder="ENTER CODE" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: white; text-align: center; font-weight: 800; font-size: 15px; outline: none; margin-bottom: 16px; box-sizing: border-box;">
                <button id="btn-claim-referral" style="width: 100%; padding: 12px; background: var(--tv-gold-primary); color: white; border: none; border-radius: 8px; font-weight: 800; cursor: pointer;">CLAIM BONUS</button>
            `);
            document.getElementById('btn-claim-referral')?.addEventListener('click', () => {
                this._audioManager.playClick();
                const code = (document.getElementById('referral-input') as HTMLInputElement)?.value.trim();
                const btn = document.getElementById('btn-claim-referral');
                if (btn) {
                    if (code) {
                        btn.innerText = 'BONUS CLAIMED ✅';
                        btn.style.background = 'rgba(255,255,255,0.1)';
                        this._saveManager.addCoins(200);
                    } else {
                        alert('Please enter a valid code.');
                    }
                }
            });
        });
    }

    private _maskPhone(phone: string): string {
        let clean = phone.replace(/[^0-9]/g, '');
        if (clean.length < 10) {
            clean = '251911223345';
        }
        if (!clean.startsWith('251')) {
            clean = '251' + clean.replace(/^0+/, '');
        }
        return clean.substring(0, 4) + '****' + clean.substring(clean.length - 2);
    }
}
