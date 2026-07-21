import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { LeaderboardService, LeaderboardDisplayEntry } from '../../core/leaderboard/LeaderboardService';
import { CompetitionRegistry } from '../../core/quiz/CompetitionRegistry';
import { DesignSystem } from '../theme/DesignSystem';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { SaveManager } from '../../core/managers/SaveManager';
import type { LeaderboardTimeRange } from '../../networking/supabase/types';

export class LeaderboardScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _saveManager: SaveManager;
    private _onClose: () => void;
    private _activeTimeRange: LeaderboardTimeRange = 'all_time';
    private _selectedCompetitionId: string = 'all';
    private _searchQuery: string = '';

    constructor(uiManager: UIManager, audioManager: AudioManager, saveManager: SaveManager, onClose: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._saveManager = saveManager;
        this._onClose = onClose;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        const competitions = CompetitionRegistry.getAll();
        const compId = this._selectedCompetitionId === 'all' ? undefined : this._selectedCompetitionId;
        const entries = await LeaderboardService.getInstance().getLeaderboard(compId, this._activeTimeRange);

        const filteredEntries = this._searchQuery
            ? entries.filter(e => e.username.toLowerCase().includes(this._searchQuery.toLowerCase()))
            : entries;

        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);

        // Calculate fake movement for demo if none exists from backend
        const movement = Math.floor(Math.random() * 5) + 1;
        const isUp = Math.random() > 0.5;
        const movementColor = isUp ? '#22C55E' : '#EF4444';
        const movementSymbol = isUp ? '▲' : '▼';

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; background: radial-gradient(circle at 50% 10%, #0B192C 0%, #050A13 80%);">

                <div class="tv-broadcast-header" style="border-bottom: 2px solid var(--fds-gold-primary);">
                    ${DesignSystem.Flex(`
                        <span style="font-size: 18px; font-weight: 900; letter-spacing: 1px; color: white;">RANKINGS & LEADERBOARD</span>
                        <button id="lb-close-btn" class="glass-card" style="padding: 6px 14px; color: white; font-weight: bold; cursor: pointer;">
                            ⬅️ HUB
                        </button>
                    `, { justify: 'space-between', align: 'center' })}
                </div>

                <div style="max-width: 960px; margin: 0 auto; position: relative; z-index: 10; padding: var(--fds-space-16) var(--fds-space-16) 100px var(--fds-space-16);">
                    
                    <!-- HERO: Your Position -->
                    ${DesignSystem.Card({
                        borderColor: division.color,
                        className: 'margin-bottom-20',
                        content: DesignSystem.Flex(`
                            <div>
                                ${DesignSystem.Text('⚽ YOUR CURRENT LEAGUE POSITION', { size: 'var(--fds-font-xs)', weight: '800', color: division.color, margin: '0 0 4px 0' })}
                                ${DesignSystem.Text(`${profile.username} <span style="font-size: var(--fds-font-sm); color: #94A3B8;">(${division.name})</span>`, { size: 'var(--fds-font-lg)', weight: '900', color: 'white' })}
                            </div>
                            <div style="text-align: right;">
                                ${DesignSystem.Flex(`
                                    <span style="color: ${movementColor}; font-size: var(--fds-font-sm); font-weight: 900; margin-right: 12px;">
                                        ${movementSymbol} ${movement}
                                    </span>
                                    ${DesignSystem.Text('RANK #4', { size: 'var(--fds-font-xl)', weight: '900', color: division.color, family: 'var(--fds-font-mono)' })}
                                `, { align: 'center', justify: 'flex-end' })}
                                ${DesignSystem.Text(`${profile.eloRating || 1200} PTS • PROMOTION ZONE`, { size: 'var(--fds-font-xs)', color: '#94A3B8', weight: 'bold' })}
                            </div>
                        `, { justify: 'space-between', wrap: true, gap: 'var(--fds-space-12)', align: 'center' })
                    })}

                    <!-- FILTER STRIP -->
                    ${DesignSystem.Card({
                        borderColor: 'transparent',
                        className: 'margin-bottom-20',
                        content: DesignSystem.Flex(`
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                ${this._renderTimePill('all_time', '🌍 GLOBAL')}
                                ${this._renderTimePill('daily', '🇪🇹 NATIONAL')}
                                ${this._renderTimePill('weekly', '⚡ WEEKLY')}
                                ${this._renderTimePill('monthly', '📅 MONTHLY')}
                            </div>
                            <select id="lb-comp-select" style="
                                padding: var(--fds-space-8) 14px;
                                background: rgba(15, 23, 42, 0.9);
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                border-radius: var(--radius-sm);
                                color: white;
                                font-weight: bold;
                                font-size: var(--fds-font-sm);
                                outline: none;
                                min-height: 48px;
                            ">
                                <option value="all">🏆 All Competitions (Global)</option>
                                ${competitions.map(c => `
                                    <option value="${c.id}" ${this._selectedCompetitionId === c.id ? 'selected' : ''}>
                                        ${c.badge} ${c.name}
                                    </option>
                                `).join('')}
                            </select>
                        `, { justify: 'space-between', wrap: true, gap: 'var(--fds-space-12)' })
                    })}

                    <div style="margin-bottom: var(--fds-space-20);">
                        ${DesignSystem.Input('lb-search-input', '🔍 Search Player Name...', this._searchQuery, 'text')}
                    </div>

                    ${entries.length >= 3 ? this._renderPodium(entries.slice(0, 3)) : ''}

                    <!-- LEADERBOARD TABLE -->
                    <div class="glass-card" style="padding: var(--fds-space-20); overflow-x: auto; border-color: rgba(255, 215, 0, 0.2);">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.15); color: #94A3B8; font-size: var(--fds-font-xs);">
                                    <th style="padding: 10px;">POS</th>
                                    <th style="padding: 10px;">PLAYER</th>
                                    <th style="padding: 10px; text-align: center;">LEVEL</th>
                                    <th style="padding: 10px; text-align: center;">MATCHES</th>
                                    <th style="padding: 10px; text-align: right;">PTS</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredEntries.map(e => `
                                    <tr style="
                                        border-bottom: 1px solid rgba(255,255,255,0.05);
                                        color: white;
                                        font-size: var(--fds-font-sm);
                                        background: ${e.rank === 4 ? 'rgba(34, 197, 94, 0.15)' : 'transparent'};
                                    ">
                                        <td style="padding: 16px 10px; font-weight: 900;">
                                            ${e.rank === 1 ? '🥇 1' : e.rank === 2 ? '🥈 2' : e.rank === 3 ? '🥉 3' : `#${e.rank}`}
                                        </td>
                                        <td style="padding: 16px 10px; font-weight: bold;">
                                            <div style="display: flex; align-items: center; gap: 8px;">
                                                <div style="width: 24px; height: 24px; border-radius: 50%; background: #334155; display: flex; align-items: center; justify-content: center; font-size: 12px;">👤</div>
                                                ${e.username}
                                            </div>
                                        </td>
                                        <td style="padding: 16px 10px; text-align: center; color: #60A5FA; font-weight: bold;">
                                            ${ProgressionManager.getLevel(e.score).level}
                                        </td>
                                        <td style="padding: 16px 10px; text-align: center; color: #94A3B8;">
                                            ${e.matchesPlayed}
                                        </td>
                                        <td style="padding: 16px 10px; text-align: right; color: var(--fds-gold-primary); font-weight: 900; font-family: var(--fds-font-mono);">
                                            ${e.score.toLocaleString()}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>
                .margin-bottom-20 { margin-bottom: var(--fds-space-20); }
            </style>
        `;

        this._bindEvents();
    }

    private _renderTimePill(range: LeaderboardTimeRange, label: string): string {
        const isActive = this._activeTimeRange === range;
        return `
            <button class="lb-time-btn ${isActive ? 'active-pill' : ''}" data-range="${range}" style="
                padding: var(--fds-space-8) 16px;
                border-radius: 24px;
                border: 1px solid ${isActive ? 'var(--fds-gold-primary)' : 'rgba(255,255,255,0.15)'};
                background: ${isActive ? 'var(--fds-gold-gradient)' : 'rgba(30, 41, 59, 0.8)'};
                color: ${isActive ? '#000' : '#94A3B8'};
                font-weight: 900;
                font-size: var(--fds-font-xs);
                cursor: pointer;
                min-height: 40px;
                transition: all 0.2s ease;
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
                gap: var(--fds-space-16);
                margin-bottom: var(--fds-space-32);
                margin-top: var(--fds-space-16);
            ">
                <!-- 2nd Place -->
                ${second ? `
                    <div class="glass-card" style="
                        padding: var(--fds-space-16);
                        width: 140px;
                        text-align: center;
                        border-color: #94A3B8;
                    ">
                        <div style="font-size: 32px;">🥈</div>
                        <div style="font-weight: bold; color: white; font-size: var(--fds-font-sm); margin-top: 4px;">${second.username}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-gold-primary); font-weight: 900; margin-top: 2px;">${second.score} PTS</div>
                    </div>
                ` : ''}

                <!-- 1st Place -->
                ${first ? `
                    <div class="glass-card" style="
                        padding: 22px var(--fds-space-16);
                        width: 160px;
                        text-align: center;
                        border-color: var(--fds-gold-primary);
                        transform: translateY(-16px);
                        box-shadow: 0 10px 30px rgba(255,215,0,0.3);
                    ">
                        <div style="font-size: 40px;">👑</div>
                        <div style="font-weight: 800; color: white; font-size: 15px; margin-top: 4px;">${first.username}</div>
                        <div style="font-size: var(--fds-font-sm); color: var(--fds-gold-primary); font-weight: 900; margin-top: 2px;">${first.score} PTS</div>
                    </div>
                ` : ''}

                <!-- 3rd Place -->
                ${third ? `
                    <div class="glass-card" style="
                        padding: var(--fds-space-16);
                        width: 140px;
                        text-align: center;
                        border-color: #CD7F32;
                    ">
                        <div style="font-size: 32px;">🥉</div>
                        <div style="font-weight: bold; color: white; font-size: var(--fds-font-sm); margin-top: 4px;">${third.username}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-gold-primary); font-weight: 900; margin-top: 2px;">${third.score} PTS</div>
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

        const searchInput = root.querySelector('#lb-search-input') as HTMLInputElement | null;
        searchInput?.addEventListener('input', (e) => {
            this._searchQuery = (e.target as HTMLInputElement).value;
            this.render();
        });
    }
}
