import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';

export class SettingsScreen {
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
        const msisdn = "+251 911 *** ***"; // Mock MSISDN

        const listTile = (icon: string, title: string, subtitle?: string, hasChevron: boolean = true, id?: string) => `
            <div ${id ? `id="${id}"` : ''} class="settings-tile" style="
                display: flex; align-items: center; justify-content: space-between; 
                padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 20px;">${icon}</span>
                    <div>
                        <div style="font-size: 15px; font-weight: 600; color: white;">${title}</div>
                        ${subtitle ? `<div style="font-size: 13px; color: #94A3B8; margin-top: 2px;">${subtitle}</div>` : ''}
                    </div>
                </div>
                ${hasChevron ? `<span style="color: #64748B;">❯</span>` : ''}
            </div>
        `;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- App Bar -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: flex-start; padding-left: 8px;">
                    <button id="btn-back" style="
                        background: none; border: none; color: white; font-size: 24px; padding: 8px 16px; cursor: pointer;
                    ">❮</button>
                    <div style="font-weight: 800; font-size: 16px; letter-spacing: 0.5px;">SETTINGS</div>
                </div>

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 100px 16px;">
                    
                    <!-- Profile Group -->
                    <div style="font-size: 12px; font-weight: 700; color: #94A3B8; margin-bottom: 8px; margin-left: 16px; text-transform: uppercase;">Account</div>
                    <div class="glass-card" style="margin-bottom: 24px; border-radius: 12px; padding: 0;">
                        ${listTile('👤', 'Profile', profile.username)}
                        ${listTile('📱', 'MSISDN', msisdn, false)}
                        <div class="settings-tile" style="
                            display: flex; align-items: center; justify-content: space-between; 
                            padding: 16px; border-bottom: none;
                        ">
                            <div style="display: flex; align-items: center; gap: 16px;">
                                <span style="font-size: 20px;">🌍</span>
                                <div style="font-size: 15px; font-weight: 600; color: white;">Language</div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <span style="font-size: 13px; color: var(--tv-gold-primary); font-weight: 700; background: rgba(255,215,0,0.1); padding: 4px 8px; border-radius: 4px;">EN</span>
                                <span style="font-size: 13px; color: #64748B; font-weight: 700; padding: 4px 8px;">AM</span>
                            </div>
                        </div>
                    </div>

                    <!-- Preferences Group -->
                    <div style="font-size: 12px; font-weight: 700; color: #94A3B8; margin-bottom: 8px; margin-left: 16px; text-transform: uppercase;">Preferences</div>
                    <div class="glass-card" style="margin-bottom: 24px; border-radius: 12px; padding: 0;">
                        ${listTile('🔔', 'Notifications', 'Enabled')}
                        ${listTile('🔊', 'Sound Effects', this._audioManager.isMuted ? 'Muted' : 'Enabled', false, 'btn-toggle-sound')}
                    </div>

                    <!-- Legal Group -->
                    <div style="font-size: 12px; font-weight: 700; color: #94A3B8; margin-bottom: 8px; margin-left: 16px; text-transform: uppercase;">Support & Legal</div>
                    <div class="glass-card" style="margin-bottom: 32px; border-radius: 12px; padding: 0;">
                        ${listTile('❓', 'Help & Support')}
                        ${listTile('📜', 'Terms & Conditions')}
                        ${listTile('🔒', 'Privacy Policy')}
                        <div class="settings-tile" style="
                            display: flex; align-items: center; justify-content: space-between; 
                            padding: 16px; border-bottom: none;
                        ">
                            <div style="display: flex; align-items: center; gap: 16px;">
                                <span style="font-size: 20px;">ℹ️</span>
                                <div style="font-size: 15px; font-weight: 600; color: white;">About Ethio Fantasy</div>
                            </div>
                            <span style="font-size: 13px; color: #64748B;">v1.0.4</span>
                        </div>
                    </div>

                    <!-- Logout -->
                    <div class="glass-card settings-tile" style="border-radius: 12px; padding: 0; text-align: center;">
                        <div style="padding: 16px; font-size: 15px; font-weight: 700; color: #EF4444; cursor: pointer;">
                            Log Out
                        </div>
                    </div>

                </div>
            </div>
            <style>
                .settings-tile:active { background: rgba(255,255,255,0.05); }
            </style>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        document.getElementById('btn-back')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onBack();
        });

        document.getElementById('btn-toggle-sound')?.addEventListener('click', () => {
            this._audioManager.toggleMute();
            this.render(); // Re-render to update text
        });
    }
}
