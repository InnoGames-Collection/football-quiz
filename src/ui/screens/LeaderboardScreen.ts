import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { LeaderboardService, LeaderboardDisplayEntry } from '../../core/leaderboard/LeaderboardService';
import { CompetitionRegistry } from '../../core/quiz/CompetitionRegistry';
import type { LeaderboardTimeRange } from '../../networking/supabase/types';

export class LeaderboardScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onClose: () => void;
    private _activeTimeRange: LeaderboardTimeRange = 'all_time';
    private _selectedCompetitionId: string = 'all';

    constructor(uiManager: UIManager, audioManager: AudioManager, onClose: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onClose = onClose;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        const competitions = CompetitionRegistry.getAll();
        const compId = this._selectedCompetitionId === 'all' ? undefined : this._selectedCompetitionId;
        const entries = await LeaderboardService.getInstance().getLeaderboard(compId, this._activeTimeRange);

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 860px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div>
                            <span style="font-size: 11px; font-weight: 800; color: var(--gold-primary); letter-spacing: 2px;">
                                FOOTBALL QUIZ LEAGUE
                            </span>
                            <h1 style="margin: 4px 0 0 0; font-size: 32px; font-weight: 900; color: white;">
                                📊 GLOBAL & LEAGUE STANDINGS
                            </h1>
                        </div>
                        <button id="lb-close-btn" class="broadcast-btn glass-card" style="color: white; padding: 10px 20px;">
                            ✖ CLOSE
                        </button>
                    </div>

                    <!-- Filter Controls Bar -->
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 16px;
                        margin-bottom: 24px;
                        flex-wrap: wrap;
                    ">
                        <!-- Time Range Pills -->
                        <div style="display: flex; gap: 8px;">
                            ${this._renderTimePill('all_time', '🏆 ALL TIME')}
                            ${this._renderTimePill('monthly', '📅 MONTHLY')}
                            ${this._renderTimePill('weekly', '⚡ WEEKLY')}
                            ${this._renderTimePill('daily', '🌅 TODAY')}
                        </div>

                        <!-- Competition Filter -->
                        <select id="lb-comp-select" style="
                            padding: 10px 14px;
                            background: rgba(15, 23, 42, 0.8);
                            border: 1px solid rgba(255, 215, 0, 0.3);
                            border-radius: 10px;
                            color: #FFD700;
                            font-weight: bold;
                            font-size: 13px;
                            outline: none;
                        ">
                            <option value="all">🌍 All Competitions (Global)</option>
                            ${competitions.map(c => `
                                <option value="${c.id}" ${this._selectedCompetitionId === c.id ? 'selected' : ''}>
                                    ${c.badge} ${c.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Top 3 Podium (If entries exist) -->
                    ${entries.length >= 3 ? this._renderPodium(entries.slice(0, 3)) : ''}

                    <!-- Leaderboard Table -->
                    <div class="glass-card" style="padding: 20px; overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94A3B8; font-size: 12px;">
                                    <th style="padding: 10px;">RANK</th>
                                    <th style="padding: 10px;">PLAYER</th>
                                    <th style="padding: 10px; text-align: center;">ELO RATING</th>
                                    <th style="padding: 10px; text-align: center;">MATCHES</th>
                                    <th style="padding: 10px; text-align: right;">SCORE</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${entries.map(e => `
                                    <tr style="
                                        border-bottom: 1px solid rgba(255,255,255,0.05);
                                        color: white;
                                        font-size: 14px;
                                    ">
                                        <td style="padding: 12px 10px; font-weight: 800;">
                                            ${e.rank === 1 ? '🥇 1' : e.rank === 2 ? '🥈 2' : e.rank === 3 ? '🥉 3' : `#${e.rank}`}
                                        </td>
                                        <td style="padding: 12px 10px; font-weight: bold;">
                                            👤 ${e.username}
                                        </td>
                                        <td style="padding: 12px 10px; text-align: center; color: #60A5FA; font-weight: bold;">
                                            ⚡ ${e.eloRating}
                                        </td>
                                        <td style="padding: 12px 10px; text-align: center; color: #94A3B8;">
                                            ${e.matchesPlayed} (${e.wins} W)
                                        </td>
                                        <td style="padding: 12px 10px; text-align: right; color: #FFD700; font-weight: 900;">
                                            ${e.score.toLocaleString()} PTS
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this._bindEvents();
    }

    private _renderTimePill(range: LeaderboardTimeRange, label: string): string {
        const isActive = this._activeTimeRange === range;
        return `
            <button class="lb-time-btn ${isActive ? 'active-pill' : ''}" data-range="${range}" style="
                padding: 8px 14px;
                border-radius: 20px;
                border: 1px solid ${isActive ? '#FFD700' : 'rgba(255,255,255,0.15)'};
                background: ${isActive ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : 'rgba(30, 41, 59, 0.6)'};
                color: ${isActive ? '#0F172A' : '#94A3B8'};
                font-weight: bold;
                font-size: 12px;
                cursor: pointer;
            ">${label}</button>
        `;
    }

    private _renderPodium(top3: LeaderboardDisplayEntry[]): string {
        const [first, second, third] = top3;
        return `
            <div style="
                display: flex;
                justify-content: center;
                align-items: flex-end;
                gap: 16px;
                margin-bottom: 28px;
            ">
                <!-- 2nd Place -->
                ${second ? `
                    <div class="glass-card" style="
                        padding: 18px;
                        width: 140px;
                        text-align: center;
                        border-color: #94A3B8;
                    ">
                        <div style="font-size: 32px;">🥈</div>
                        <div style="font-weight: bold; color: white; font-size: 14px; margin-top: 4px;">${second.username}</div>
                        <div style="font-size: 12px; color: #FFD700; font-weight: 900; margin-top: 2px;">${second.score} PTS</div>
                    </div>
                ` : ''}

                <!-- 1st Place -->
                ${first ? `
                    <div class="glass-card" style="
                        padding: 24px 18px;
                        width: 160px;
                        text-align: center;
                        border-color: #FFD700;
                        transform: translateY(-10px);
                        box-shadow: 0 10px 30px rgba(255,215,0,0.3);
                    ">
                        <div style="font-size: 42px;">👑</div>
                        <div style="font-weight: 800; color: white; font-size: 15px; margin-top: 4px;">${first.username}</div>
                        <div style="font-size: 14px; color: #FFD700; font-weight: 900; margin-top: 2px;">${first.score} PTS</div>
                    </div>
                ` : ''}

                <!-- 3rd Place -->
                ${third ? `
                    <div class="glass-card" style="
                        padding: 18px;
                        width: 140px;
                        text-align: center;
                        border-color: #CD7F32;
                    ">
                        <div style="font-size: 32px;">🥉</div>
                        <div style="font-weight: bold; color: white; font-size: 14px; margin-top: 4px;">${third.username}</div>
                        <div style="font-size: 12px; color: #FFD700; font-weight: 900; margin-top: 2px;">${third.score} PTS</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelector('#lb-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        root.querySelectorAll('.lb-time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this._audioManager.playClick();
                const range = (e.currentTarget as HTMLElement).getAttribute('data-range') as LeaderboardTimeRange;
                if (range) {
                    this._activeTimeRange = range;
                    this.render();
                }
            });
        });

        root.querySelector('#lb-comp-select')?.addEventListener('change', (e) => {
            this._audioManager.playClick();
            this._selectedCompetitionId = (e.target as HTMLSelectElement).value;
            this.render();
        });
    }
}
