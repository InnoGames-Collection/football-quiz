import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { CompetitionRegistry, Competition } from '../../core/quiz/CompetitionRegistry';
import { DesignSystem } from '../theme/DesignSystem';

export class CompetitionBrowserScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onSelectCompetition: (comp: Competition) => void;
    private _onClose: () => void;

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        onSelectCompetition: (comp: Competition) => void,
        onClose: () => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onSelectCompetition = onSelectCompetition;
        this._onClose = onClose;
    }

    public render(): void {
        const root = this._uiManager.container;
        const competitions = CompetitionRegistry.getAll();

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                ${DesignSystem.Header({
                    title: 'SEASON 1 LEAGUE',
                    badgeText: 'SEASON 1 LEAGUE',
                    rightText: ''
                })}

                <div style="position: absolute; top: 12px; right: 24px; z-index: 30;">
                    <button id="comp-close-btn" class="glass-card" style="padding: 6px 14px; color: white; font-weight: bold; cursor: pointer;">
                        ⬅️ BACK TO HUB
                    </button>
                </div>

                <div style="max-width: 900px; margin: var(--fds-space-20) auto; position: relative; z-index: 10; padding: 0 var(--fds-space-20);">
                    
                    ${DesignSystem.Card({
                        borderColor: 'var(--fds-gold-primary)',
                        className: 'margin-bottom-20',
                        content: DesignSystem.Flex(`
                            <div>
                                ${DesignSystem.Text('🏆 ACTIVE FOOTBALL SEASON', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('ETHIOPIAN PREMIER LEAGUE 2026', { size: 'var(--fds-font-xl)', weight: '900', color: 'white', margin: '0' })}
                                ${DesignSystem.Text('Official National Season • 15 Matchday Competitions Active', { size: 'var(--fds-font-sm)', color: '#94A3B8', margin: 'var(--fds-space-4) 0 0 0' })}
                            </div>

                            <div class="glass-card" style="padding: 10px 18px; text-align: center; border-color: #22C55E;">
                                ${DesignSystem.Text('PLAYER FORM', { size: '10px', weight: '800', color: '#94A3B8', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('🔥 W - W - D - W - W', { size: 'var(--fds-font-sm)', weight: '900', color: '#22C55E', family: 'var(--fds-font-mono)' })}
                            </div>
                        `, { justify: 'space-between', wrap: true, gap: 'var(--fds-space-16)' })
                    })}

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--fds-space-16); margin-bottom: var(--fds-space-20);">
                        ${DesignSystem.Card({
                            borderColor: 'var(--fds-gold-primary)',
                            content: `
                                ${DesignSystem.Text('🥇 CURRENT DIVISION & STANDINGS', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('Division 2 (Premier League)', { size: 'var(--fds-font-lg)', weight: '900', color: 'white', margin: '0 0 2px 0' })}
                                ${DesignSystem.Text('🏆 3,450 DIVISION POINTS', { size: 'var(--fds-font-sm)', weight: '900', color: 'var(--fds-gold-primary)', family: 'var(--fds-font-mono)', margin: '0 0 10px 0' })}
                                ${DesignSystem.Text('Ranked #4 of 200 Division Players', { size: 'var(--fds-font-xs)', color: '#94A3B8' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: '#22C55E',
                            content: `
                                ${DesignSystem.Text('📈 PROMOTION PROGRESS (TOP 15%)', { size: 'var(--fds-font-xs)', weight: '800', color: '#22C55E', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Flex(`
                                    <span style="font-size: var(--fds-font-sm); font-weight: 800; color: white;">Division 1 CAF Threshold</span>
                                    <span style="font-size: var(--fds-font-sm); font-weight: 800; color: #22C55E; font-family: var(--fds-font-mono);">82%</span>
                                `, { justify: 'space-between', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.ProgressBar(82, 'var(--tv-pitch-green)')}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: '#60A5FA',
                            content: `
                                ${DesignSystem.Text('🏆 SEASON 1 PASS PROGRESS', { size: 'var(--fds-font-xs)', weight: '800', color: '#60A5FA', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Flex(`
                                    <span style="font-size: var(--fds-font-sm); font-weight: 800; color: white;">Level 12 / 50</span>
                                    <span style="font-size: var(--fds-font-sm); font-weight: 800; color: #60A5FA; font-family: var(--fds-font-mono);">65%</span>
                                `, { justify: 'space-between', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.ProgressBar(65, '#60A5FA')}
                            `
                        })}

                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('⚽ SEASON MATCH HISTORY', { size: 'var(--fds-font-xs)', weight: '800', color: '#F59E0B', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('Matches Played: <strong style="color:var(--fds-gold-primary);">14 Matches</strong><br/>Record: <strong style="color:#22C55E;">10 Wins</strong> • <strong>4 Draws</strong> • <strong>0 Losses</strong>', { size: 'var(--fds-font-sm)', color: 'white', weight: '600' })}
                            `
                        })}
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--fds-space-16); margin-bottom: var(--fds-space-24);">
                        ${DesignSystem.Card({
                            borderColor: 'var(--fds-gold-primary)',
                            content: `
                                ${DesignSystem.Text('📊 WEEKLY LEAGUE TABLE (DIVISION 2)', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-12) 0' })}
                                <table style="width: 100%; border-collapse: collapse; font-size: var(--fds-font-sm); color: white; text-align: left;">
                                    <thead>
                                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.15); color: #94A3B8; font-size: var(--fds-font-xs);">
                                            <th style="padding: 6px;">POS</th>
                                            <th style="padding: 6px;">PLAYER</th>
                                            <th style="padding: 6px; text-align: center;">PTS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                            <td style="padding: 8px;">🥇 1</td>
                                            <td style="padding: 8px; font-weight: 700;">Abebe Kebede</td>
                                            <td style="padding: 8px; text-align: center; color: var(--fds-gold-primary); font-family: var(--fds-font-mono); font-weight: 800;">4,820</td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                            <td style="padding: 8px;">🥈 2</td>
                                            <td style="padding: 8px; font-weight: 700;">Yonas Tesfaye</td>
                                            <td style="padding: 8px; text-align: center; color: var(--fds-gold-primary); font-family: var(--fds-font-mono); font-weight: 800;">4,610</td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                            <td style="padding: 8px;">🥉 3</td>
                                            <td style="padding: 8px; font-weight: 700;">Biruk Tadesse</td>
                                            <td style="padding: 8px; text-align: center; color: var(--fds-gold-primary); font-family: var(--fds-font-mono); font-weight: 800;">4,390</td>
                                        </tr>
                                        <tr style="background: rgba(34, 197, 94, 0.15); border-left: 3px solid #22C55E;">
                                            <td style="padding: 8px;">⚽ 4</td>
                                            <td style="padding: 8px; font-weight: 800; color: #22C55E;">YOU (Walia Striker)</td>
                                            <td style="padding: 8px; text-align: center; color: #22C55E; font-family: var(--fds-font-mono); font-weight: 900;">3,450</td>
                                        </tr>
                                    </tbody>
                                </table>
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: '#C084FC',
                            content: `
                                ${DesignSystem.Text('🎯 WEEKLY SEASON OBJECTIVES', { size: 'var(--fds-font-xs)', weight: '800', color: '#C084FC', margin: '0 0 var(--fds-space-12) 0' })}
                                <div style="display: flex; flex-direction: column; gap: 10px; font-size: var(--fds-font-sm); color: white;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span>⚽ Win 5 League Matches (3/5)</span>
                                        <span style="color: #60A5FA; font-weight: 800;">60%</span>
                                    </div>
                                    ${DesignSystem.ProgressBar(60, '#60A5FA')}
                                    
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span>🎯 Score 25 Derby Goals (18/25)</span>
                                        <span style="color: var(--fds-gold-primary); font-weight: 800;">72%</span>
                                    </div>
                                    ${DesignSystem.ProgressBar(72, 'var(--fds-gold-primary)')}

                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span>🔥 Maintain 80% Accuracy (Done ✅)</span>
                                        <span style="color: #22C55E; font-weight: 800;">100%</span>
                                    </div>
                                    ${DesignSystem.ProgressBar(100, '#22C55E')}
                                </div>
                            `
                        })}
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--fds-space-16); margin-bottom: var(--fds-space-24);">
                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('📅 UPCOMING FIXTURES', { size: 'var(--fds-font-xs)', weight: '800', color: '#38BDF8', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('⚽ St. George vs Walia Ibex — Today 20:00<br/>⚽ Ethiopian Coffee vs Defense FC — Tomorrow 16:00', { size: 'var(--fds-font-sm)', color: 'white', weight: '600' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('📝 RECENT MATCH RESULTS', { size: 'var(--fds-font-xs)', weight: '800', color: '#22C55E', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('🟢 WON 3 - 1 vs Saint George SC<br/>🟢 WON 2 - 0 vs Ethiopian Coffee SC<br/>🟡 DRAW 1 - 1 vs Ethiopian Insurance FC', { size: 'var(--fds-font-sm)', color: 'white', weight: '600' })}
                            `
                        })}
                    </div>

                    ${DesignSystem.Text(`🏆 ENTER MATCHDAY COMPETITIONS (${competitions.length} AVAILABLE)`, { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-12) 0' })}

                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--fds-space-16);">
                        ${competitions.map(comp => `
                            <div class="glass-card comp-card" data-id="${comp.id}" style="
                                padding: var(--fds-space-20);
                                cursor: pointer;
                                transition: all 0.25s ease;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                border-color: rgba(255, 215, 0, 0.2);
                            ">
                                <div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                        <span style="font-size: 36px;">${comp.badge}</span>
                                        <span style="
                                            font-size: var(--fds-font-xs);
                                            font-weight: bold;
                                            padding: 4px 10px;
                                            border-radius: 20px;
                                            background: rgba(255, 215, 0, 0.15);
                                            color: var(--fds-gold-primary);
                                            border: 1px solid rgba(255, 215, 0, 0.3);
                                        ">${comp.questionCount} QUESTIONS</span>
                                    </div>
                                    <h3 style="margin: 0 0 6px 0; font-size: var(--fds-font-lg); font-weight: 800; color: white;">
                                        ${comp.name}
                                    </h3>
                                    <p style="margin: 0; font-size: var(--fds-font-xs); color: #94A3B8; line-height: 1.4;">
                                        ${comp.description}
                                    </p>
                                </div>

                                <button class="broadcast-btn broadcast-btn-gold" style="margin-top: 18px; width: 100%;">
                                    ⚡ KICK OFF LEAGUE MATCH
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <style>
                .comp-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--fds-gold-primary) !important;
                    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
                }
                .margin-bottom-20 { margin-bottom: var(--fds-space-20); }
            </style>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelector('#comp-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        root.querySelectorAll('.comp-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this._audioManager.playClick();
                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                if (id) {
                    const comp = CompetitionRegistry.getById(id);
                    if (comp) {
                        this._onSelectCompetition(comp);
                    }
                }
            });
        });
    }
}
