import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { i18n } from '../../localization/i18n';
import { AuthManager } from '../../core/auth/AuthManager';
import { BottomNav } from '../components/BottomNav';
import { ProfileService } from '../../networking/services/ProfileService';
import { FAQService } from '../../networking/services/FAQService';
import { Toast } from '../components/Toast';
import { SupportService } from '../../networking/services/SupportService';

export interface AppSettings {
    soundEffects: boolean;
    notifications: {
        dailyChallenge: boolean;
        tournament: boolean;
        rewards: boolean;
        announcements: boolean;
        subscription: boolean;
        system: boolean;
    };
}

export class SettingsScreen {
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _onBack: () => void;
    private _subScreen: 'main' | 'profile' | 'language' | 'notifications' | 'sound' | 'help' | 'terms' | 'privacy' | 'about' = 'main';
    private _settings!: AppSettings;
    private _helpCategory: string | null = null;
    private _showContactSupportForm: boolean = false;
    private _faqsCache: { q: string; a: string }[] = [];

    constructor(uiManager: UIManager, saveManager: SaveManager, audioManager: AudioManager, onBack: () => void) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._onBack = onBack;
        
        // Initialize default settings first to avoid synchronous undefined accesses
        this._settings = this._getDefaultSettings();
        
        // Asynchronously load settings from cloud/local storage
        this._loadSettings();
    }

    private async _loadSettings(): Promise<void> {
        // Load local fallback first
        const saved = localStorage.getItem('ETHIO_FOOTBALL_SETTINGS_V2');
        if (saved) {
            try {
                this._settings = JSON.parse(saved);
            } catch (e) {
                this._settings = this._getDefaultSettings();
            }
        } else {
            this._settings = this._getDefaultSettings();
        }

        const isMuted = localStorage.getItem('ETHIO_FOOTBALL_MUTED') === 'true';
        this._settings.soundEffects = !isMuted;

        // Try loading from Supabase Preferences if online
        const pref = await ProfileService.getInstance().getPreferences();
        if (pref) {
            this._settings.soundEffects = pref.sound_enabled;
            this._settings.notifications = {
                dailyChallenge: pref.notif_daily,
                tournament: pref.notif_tournament,
                rewards: pref.notif_rewards,
                announcements: pref.notif_announcements,
                subscription: pref.notif_subscription,
                system: pref.notif_system
            };
            
            // Sync audio manager mute state
            if (pref.sound_enabled && this._audioManager.isMuted) {
                this._audioManager.toggleMute();
            } else if (!pref.sound_enabled && !this._audioManager.isMuted) {
                this._audioManager.toggleMute();
            }
        }
        
        this.render();
    }

    private _getDefaultSettings(): AppSettings {
        return {
            soundEffects: true,
            notifications: {
                dailyChallenge: true,
                tournament: true,
                rewards: true,
                announcements: true,
                subscription: true,
                system: true
            }
        };
    }

    private async _saveSettings(): Promise<void> {
        localStorage.setItem('ETHIO_FOOTBALL_SETTINGS_V2', JSON.stringify(this._settings));
        localStorage.setItem('ETHIO_FOOTBALL_MUTED', String(!this._settings.soundEffects));
        
        if (this._settings.soundEffects && this._audioManager.isMuted) {
            this._audioManager.toggleMute();
        } else if (!this._settings.soundEffects && !this._audioManager.isMuted) {
            this._audioManager.toggleMute();
        }

        // Persist to Supabase if online
        await ProfileService.getInstance().updatePreferences({
            sound_enabled: this._settings.soundEffects,
            notif_daily: this._settings.notifications.dailyChallenge,
            notif_tournament: this._settings.notifications.tournament,
            notif_rewards: this._settings.notifications.rewards,
            notif_announcements: this._settings.notifications.announcements,
            notif_subscription: this._settings.notifications.subscription,
            notif_system: this._settings.notifications.system
        });
    }

    public render(): void {
        const root = this._uiManager.container;
        const locale = i18n.currentLocale;

        // Custom localized header helper
        const header = (title: string, _backAction?: () => void) => `
            <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: flex-start; padding-left: 8px;">
                <button id="btn-back-sub" style="
                    background: none; border: none; color: white; font-size: 24px; padding: 8px 16px; cursor: pointer;
                ">❮</button>
                <div style="font-weight: 900; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase;">${title}</div>
            </div>
        `;

        if (this._subScreen === 'main') {
            this._renderMainScreen(root, locale);
        } else if (this._subScreen === 'profile') {
            this._renderProfileScreen(root, locale, header);
        } else if (this._subScreen === 'language') {
            this._renderLanguageScreen(root, locale, header);
        } else if (this._subScreen === 'notifications') {
            this._renderNotificationsScreen(root, locale, header);
        } else if (this._subScreen === 'sound') {
            this._renderSoundScreen(root, locale, header);
        } else if (this._subScreen === 'help') {
            this._renderHelpScreen(root, locale, header);
        } else if (this._subScreen === 'terms') {
            this._renderTermsScreen(root, locale, header);
        } else if (this._subScreen === 'privacy') {
            this._renderPrivacyScreen(root, locale, header);
        } else if (this._subScreen === 'about') {
            this._renderAboutScreen(root, locale, header);
        }
    }

    private _renderMainScreen(root: HTMLElement, locale: string): void {
        const profile = this._saveManager.profile;
        const maskedMsisdn = profile.phone ? this._maskPhone(profile.phone) : 'Guest Player';

        const listTile = (icon: string, title: string, subtitle: string, hasChevron: boolean = true, id: string) => `
            <div id="${id}" class="settings-tile" style="
                display: flex; align-items: center; justify-content: space-between; 
                padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                transition: background-color 0.2s;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 20px;">${icon}</span>
                    <div>
                        <div style="font-size: 15px; font-weight: 700; color: white;">${title}</div>
                        ${subtitle ? `<div style="font-size: 13px; color: #94A3B8; margin-top: 2px;">${subtitle}</div>` : ''}
                    </div>
                </div>
                ${hasChevron ? `<span style="color: #64748B;">❯</span>` : ''}
            </div>
        `;

        const strings: Record<string, any> = {
            en: {
                title: 'SETTINGS',
                account: 'Account & Profile',
                profile: 'My Profile',
                language: 'Language',
                notifications: 'Notifications',
                sound: 'Sound Effects',
                legal: 'Support & Legal',
                help: 'Help & Support',
                terms: 'Terms & Conditions',
                privacy: 'Privacy Policy',
                about: 'About Ethio Fantasy',
                logout: 'Log Out',
                soundEnabled: 'Enabled',
                soundDisabled: 'Muted'
            },
            am: {
                title: 'ቅንብሮች',
                account: 'መለያ እና መገለጫ',
                profile: 'የእኔ መገለጫ',
                language: 'ቋንቋ',
                notifications: 'ማሳወቂያዎች',
                sound: 'የድምፅ ተፅእኖዎች',
                legal: 'እገዛ እና ህጋዊ',
                help: 'እገዛ እና ድጋፍ',
                terms: 'ውሎች እና ሁኔታዎች',
                privacy: 'የግላዊነት ፖሊሲ',
                about: 'ስለ ኢትዮ ፋንታሲ',
                logout: 'ውጣ',
                soundEnabled: 'የበራ',
                soundDisabled: 'የጠፋ'
            },
            om: {
                title: 'SETTINGS',
                account: 'Herrega & Profile',
                profile: 'Profile Koo',
                language: 'Afaan',
                notifications: 'Beeksisa',
                sound: 'Sagaale',
                legal: 'Gargaarsa & Seera',
                help: 'Gargaarsa & Deeggarsa',
                terms: 'Waliigaltee & Haalawwan',
                privacy: 'Imaammata Dhuunfaa',
                about: 'Waa\'ee Ethio Fantasy',
                logout: 'Ba\'i',
                soundEnabled: 'Kan Baname',
                soundDisabled: 'Kan Cufame'
            }
        };

        const str = strings[locale] || strings['en'];
        const currentLangLabel = locale === 'am' ? 'አማርኛ' : (locale === 'om' ? 'Afan Oromo' : 'English');

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- App Bar -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: flex-start; padding-left: 8px;">
                    <button id="btn-back" style="
                        background: none; border: none; color: white; font-size: 24px; padding: 8px 16px; cursor: pointer;
                    ">❮</button>
                    <div style="font-weight: 900; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase;">${str.title}</div>
                </div>

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <!-- Account Group -->
                    <div style="font-size: 12px; font-weight: 800; color: #94A3B8; margin-bottom: 8px; margin-left: 16px; text-transform: uppercase;">${str.account}</div>
                    <div class="glass-card" style="margin-bottom: 24px; border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${listTile('👤', str.profile, maskedMsisdn, true, 'tile-profile')}
                        ${listTile('🌍', str.language, currentLangLabel, true, 'tile-language')}
                        ${listTile('🔔', str.notifications, '', true, 'tile-notifications')}
                        ${listTile('🔊', str.sound, this._settings.soundEffects ? str.soundEnabled : str.soundDisabled, true, 'tile-sound')}
                    </div>

                    <!-- Legal Group -->
                    <div style="font-size: 12px; font-weight: 800; color: #94A3B8; margin-bottom: 8px; margin-left: 16px; text-transform: uppercase;">${str.legal}</div>
                    <div class="glass-card" style="margin-bottom: 32px; border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${listTile('❓', str.help, '', true, 'tile-help')}
                        ${listTile('📜', str.terms, '', true, 'tile-terms')}
                        ${listTile('🔒', str.privacy, '', true, 'tile-privacy')}
                        ${listTile('ℹ️', str.about, 'v1.1.0', true, 'tile-about')}
                    </div>

                    <!-- Logout -->
                    <div class="glass-card settings-tile" id="btn-logout" style="border-radius: 12px; padding: 0; text-align: center; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05); overflow: hidden;">
                        <div style="padding: 16px; font-size: 15px; font-weight: 800; color: #EF4444; cursor: pointer; letter-spacing: 0.5px;">
                            ${str.logout.toUpperCase()}
                        </div>
                    </div>

                </div>
            </div>
            <style>
                .settings-tile:active { background: rgba(255,255,255,0.08); }
            </style>
        `;

        // Bind events
        document.getElementById('btn-back')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onBack();
        });

        const binds = [
            { id: 'tile-profile', sub: 'profile' },
            { id: 'tile-language', sub: 'language' },
            { id: 'tile-notifications', sub: 'notifications' },
            { id: 'tile-sound', sub: 'sound' },
            { id: 'tile-help', sub: 'help' },
            { id: 'tile-terms', sub: 'terms' },
            { id: 'tile-privacy', sub: 'privacy' },
            { id: 'tile-about', sub: 'about' }
        ];

        binds.forEach(b => {
            document.getElementById(b.id)?.addEventListener('click', () => {
                this._audioManager.playClick();
                this._subScreen = b.sub as any;
                this.render();
            });
        });

        document.getElementById('btn-logout')?.addEventListener('click', async () => {
            this._audioManager.playClick();
            if (confirm(locale === 'am' ? 'በእርግጥ መውጣት ይፈልጋሉ?' : (locale === 'om' ? 'Dhuguma ba\'uu barbaadduu?' : 'Are you sure you want to log out?'))) {
                await AuthManager.getInstance().signOut();
                window.location.reload();
            }
        });
    }

    private _renderProfileScreen(root: HTMLElement, locale: string, header: Function): void {
        const profile = this._saveManager.profile;
        const maskedMsisdn = profile.phone ? this._maskPhone(profile.phone) : 'Guest Player';
        const regDate = 'July 22, 2026';
        const subStatus = profile.eloRating && profile.eloRating > 1400 ? 'Active Premium' : 'Active Basic';

        const row = (label: string, value: string) => `
            <div style="display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="font-size: 14px; font-weight: 700; color: #94A3B8;">${label}</div>
                <div style="font-size: 14px; font-weight: 800; color: white;">${value}</div>
            </div>
        `;

        const titles: Record<string, string> = {
            en: 'MY PROFILE',
            am: 'የእኔ መገለጫ',
            om: 'PROFILE KOO'
        };

        const labels: Record<string, Record<string, string>> = {
            en: { phone: 'Masked MSISDN', status: 'Subscription Status', date: 'Registration Date' },
            am: { phone: 'የስልክ ቁጥር (MSISDN)', status: 'የምዝገባ ሁኔታ', date: 'የተመዘገቡበት ቀን' },
            om: { phone: 'Lakkoofsa MSISDN', status: 'Haala Kaffaltii', date: 'Guyyaa Galmee' }
        };

        const activeLabels = labels[locale] || labels['en'];

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'])}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${row(activeLabels.phone, maskedMsisdn)}
                        ${row(activeLabels.status, subStatus)}
                        <div style="border-bottom: none;">
                            ${row(activeLabels.date, regDate)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._bindSubBack();
    }

    private _renderLanguageScreen(root: HTMLElement, locale: string, header: Function): void {
        const langRow = (code: 'en' | 'am' | 'om', name: string) => {
            const isSelected = locale === code;
            return `
                <div class="settings-tile lang-item" data-lang="${code}" style="
                    display: flex; align-items: center; justify-content: space-between; 
                    padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                ">
                    <div style="font-size: 15px; font-weight: 700; color: white;">${name}</div>
                    <div style="
                        width: 20px; height: 20px; border-radius: 50%; 
                        border: 2px solid ${isSelected ? 'var(--tv-gold-primary)' : 'rgba(255,255,255,0.3)'};
                        display: flex; align-items: center; justify-content: center;
                    ">
                        ${isSelected ? `<div style="width: 10px; height: 10px; border-radius: 50%; background: var(--tv-gold-primary);"></div>` : ''}
                    </div>
                </div>
            `;
        };

        const titles: Record<string, string> = {
            en: 'SELECT LANGUAGE',
            am: 'ቋንቋ ይምረጡ',
            om: 'AFAAN FILADHU'
        };

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'])}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${langRow('en', 'English')}
                        ${langRow('am', 'አማርኛ (Amharic)')}
                        <div style="border-bottom: none;">
                            ${langRow('om', 'Afan Oromo')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._bindSubBack();

        const items = root.querySelectorAll('.lang-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const lang = target.getAttribute('data-lang') as 'en' | 'am' | 'om';
                if (lang) {
                    this._audioManager.playClick();
                    i18n.setLocale(lang);
                    BottomNav.refresh();
                    this.render();
                }
            });
        });
    }

    private _renderNotificationsScreen(root: HTMLElement, locale: string, header: Function): void {
        const notifRow = (key: keyof AppSettings['notifications'], label: string) => {
            const enabled = this._settings.notifications[key];
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 15px; font-weight: 700; color: white;">${label}</div>
                    <label class="switch-container">
                        <input type="checkbox" class="switch-input notif-toggle" data-key="${key}" ${enabled ? 'checked' : ''}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
            `;
        };

        const titles: Record<string, string> = {
            en: 'NOTIFICATIONS',
            am: 'ማሳወቂያዎች',
            om: 'BEEKSIISAA'
        };

        const labels: Record<string, Record<string, string>> = {
            en: {
                dailyChallenge: 'Daily Challenge',
                tournament: 'Tournament Updates',
                rewards: 'Rewards & Bonuses',
                announcements: 'Announcements',
                subscription: 'Subscription Alerts',
                system: 'System Alerts'
            },
            am: {
                dailyChallenge: 'የዕለት ተግዳሮቶች',
                tournament: 'የሊግ ውድድር ዜናዎች',
                rewards: 'ሽልማቶች እና ጉርሻዎች',
                announcements: 'ማስታወቂያዎች',
                subscription: 'የምዝገባ ማሳወቂያዎች',
                system: 'የስርዓት ማንቂያዎች'
            },
            om: {
                dailyChallenge: 'Qormaata Guyyaa',
                tournament: 'Dorgommiiwwan Liigii',
                rewards: 'Badhaasa & Bonus',
                announcements: 'Beeksisa Sirnaa',
                subscription: 'Kaffaltii Addaa',
                system: 'Gargaarsa Sirnaa'
            }
        };

        const activeLabels = labels[locale] || labels['en'];

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'])}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${notifRow('dailyChallenge', activeLabels.dailyChallenge)}
                        ${notifRow('tournament', activeLabels.tournament)}
                        ${notifRow('rewards', activeLabels.rewards)}
                        ${notifRow('announcements', activeLabels.announcements)}
                        ${notifRow('subscription', activeLabels.subscription)}
                        <div style="border-bottom: none;">
                            ${notifRow('system', activeLabels.system)}
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .switch-container {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                }
                .switch-input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .switch-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(255,255,255,0.15);
                    transition: .3s;
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .switch-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px; width: 16px;
                    left: 3px; bottom: 3px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }
                .switch-input:checked + .switch-slider {
                    background-color: var(--tv-pitch-green);
                }
                .switch-input:checked + .switch-slider:before {
                    transform: translateX(20px);
                }
            </style>
        `;

        this._bindSubBack();

        const toggles = root.querySelectorAll('.notif-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this._audioManager.playClick();
                const target = e.currentTarget as HTMLInputElement;
                const key = target.getAttribute('data-key') as keyof AppSettings['notifications'];
                if (key) {
                    this._settings.notifications[key] = target.checked;
                    this._saveSettings();
                }
            });
        });
    }

    private _renderSoundScreen(root: HTMLElement, locale: string, header: Function): void {
        const soundRow = (value: boolean, label: string) => {
            const isSelected = this._settings.soundEffects === value;
            return `
                <div class="settings-tile sound-item" data-val="${value}" style="
                    display: flex; align-items: center; justify-content: space-between; 
                    padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                ">
                    <div style="font-size: 15px; font-weight: 700; color: white;">${label}</div>
                    <div style="
                        width: 20px; height: 20px; border-radius: 50%; 
                        border: 2px solid ${isSelected ? 'var(--tv-gold-primary)' : 'rgba(255,255,255,0.3)'};
                        display: flex; align-items: center; justify-content: center;
                    ">
                        ${isSelected ? `<div style="width: 10px; height: 10px; border-radius: 50%; background: var(--tv-gold-primary);"></div>` : ''}
                    </div>
                </div>
            `;
        };

        const titles: Record<string, string> = {
            en: 'SOUND EFFECTS',
            am: 'የድምፅ ተፅእኖዎች',
            om: 'SAGAALE TAPHA'
        };

        const enableLabel = locale === 'am' ? 'ድምፅ አብራ' : (locale === 'om' ? 'Bani' : 'Enable');
        const disableLabel = locale === 'am' ? 'ድምፅ አጥፋ' : (locale === 'om' ? 'Cufi' : 'Disable');

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'])}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${soundRow(true, enableLabel)}
                        <div style="border-bottom: none;">
                            ${soundRow(false, disableLabel)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._bindSubBack();

        const items = root.querySelectorAll('.sound-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const val = target.getAttribute('data-val') === 'true';
                this._settings.soundEffects = val;
                this._saveSettings();
                this._audioManager.playClick();
                this.render();
            });
        });
    }

    private _renderHelpScreen(root: HTMLElement, locale: string, header: Function): void {
        const titles: Record<string, string> = {
            en: 'HELP & SUPPORT',
            am: 'እገዛ እና ድጋፍ',
            om: 'GARGAARSA'
        };

        const helpCategories: { id: string; name: Record<string, string>; icon: string }[] = [
            { id: 'account', name: { en: 'Account', am: 'መለያ', om: 'Herrega' }, icon: '👤' },
            { id: 'subscription', name: { en: 'Subscription', am: 'ምዝገባ', om: 'Kaffaltii' }, icon: '💳' },
            { id: 'unsubscription', name: { en: 'Unsubscription', am: 'ምዝገባ መሰረዝ', om: 'Haquu' }, icon: '🛑' },
            { id: 'dailyChallenge', name: { en: 'Daily Challenge', am: 'የዕለት ተግዳሮት', om: 'Qormaata Guyyaa' }, icon: '📅' },
            { id: 'tournament', name: { en: 'Tournament', am: 'ውድድር', om: 'Dorgommii' }, icon: '🏆' },
            { id: 'rewards', name: { en: 'Rewards', am: 'ሽልማቶች', om: 'Badhaasa' }, icon: '🎁' },
            { id: 'gameplay', name: { en: 'Gameplay', am: 'የጨዋታ ሁኔታ', om: 'Tapha' }, icon: '⚽' },
            { id: 'leaderboard', name: { en: 'Leaderboard', am: 'ደረጃ ሰሌዳ', om: 'Sadarkaa' }, icon: '📊' },
            { id: 'profile', name: { en: 'Profile', am: 'መገለጫ', om: 'Profile' }, icon: '👤' },
            { id: 'notifications', name: { en: 'Notifications', am: 'ማሳወቂያዎች', om: 'Beeksisa' }, icon: '🔔' },
            { id: 'technicalIssues', name: { en: 'Technical Issues', am: 'ቴክኒካዊ ጉዳዮች', om: 'Rakkina Sirnaa' }, icon: '🔧' },
            { id: 'privacy', name: { en: 'Privacy', am: 'ምስጢራዊነት', om: 'Dhuunfaa' }, icon: '🔒' },
            { id: 'terms', name: { en: 'Terms', am: 'ውሎች', om: 'Haalawwan' }, icon: '📜' }
        ];

        const HELP_FAQS: Record<string, { q: string; a: string }[]> = {
            account: [
                { q: 'How is my account created?', a: 'Your account is automatically created when you authenticate with your Ethio Telecom mobile phone number. There is no password required.' },
                { q: 'Can I delete my account?', a: 'To delete your account data, please contact Ethio Telecom customer service or submit a support ticket via the app.' }
            ],
            subscription: [
                { q: 'What is Premium Subscription?', a: 'Premium subscription gives you unlimited daily plays, full access to all leagues, and entry into the weekly cash prize draws for 2 Birr/day.' },
                { q: 'How do I pay for subscription?', a: 'Subscription fees are automatically deducted from your Ethio Telecom airtime balance daily.' }
            ],
            unsubscription: [
                { q: 'How do I unsubscribe?', a: 'You can cancel your active subscription anytime by going to Settings > Account > Profile and choosing Unsubscribe, or by sending "STOP" to the Ethio Telecom shortcode 8282.' }
            ],
            dailyChallenge: [
                { q: 'What is the Daily Challenge?', a: 'The Daily Challenge is a special daily set of 10 trivia questions on hot football topics. Completing it awards double reward coins and a 1.5x XP bonus!' },
                { q: 'How many times can I play the Daily Challenge?', a: 'You can play the Daily Challenge once per calendar day. It resets every night at midnight EAT.' }
            ],
            tournament: [
                { q: 'How do tournaments work?', a: 'Tournaments are knockout brackets held every weekend. Players register during the week and compete live in 1v1 match phases to progress.' },
                { q: 'What are the tournament entry requirements?', a: 'Premium subscribers can enter tournaments for free. Basic and free players must pay a 100 coin registration fee.' }
            ],
            rewards: [
                { q: 'What rewards can I win?', a: 'You can win in-game coins, profile XP, custom football badges, and real cash prizes credited directly to your Ethio Telecom mobile account balance.' },
                { q: 'When are weekly prizes distributed?', a: 'Weekly prizes are processed and sent every Monday at 10:00 AM EAT based on the final Sunday night division standings.' }
            ],
            gameplay: [
                { q: 'How do I play a match?', a: 'Read the question carefully and tap the correct option before the timer runs out. Fast answers score Goals, while incorrect ones are Saved by the goalkeeper!' },
                { q: 'How does the match timer work?', a: 'You have 30 seconds per question in Solo Matches, and 20 seconds in Live 1v1 Matches. Answering quicker increases your possession stat!' }
            ],
            leaderboard: [
                { q: 'How are leaderboard points calculated?', a: 'Leaderboard standings are based on ELO ratings. You win ELO points by defeating opponents in Live 1v1 Matches and scoring high accuracy in Solo Matches.' },
                { q: 'How often does the leaderboard reset?', a: 'Division leaderboards reset weekly on Sunday at midnight EAT, after which the top players are promoted and rewards are dispatched.' }
            ],
            profile: [
                { q: 'Why can\'t I edit my username?', a: 'To comply with Ethio Telecom VAS portal guidelines, player profiles are verified and tied securely to your MSISDN. Manually changing names is restricted.' }
            ],
            notifications: [
                { q: 'What notifications will I receive?', a: 'You will receive SMS alerts for tournament kick-offs, daily challenge reminders, and subscription renewals. You can toggle these settings anytime.' }
            ],
            technicalIssues: [
                { q: 'The app is freezing. What should I do?', a: 'Ensure you have a stable network connection (3G/4G/LTE/5G). Try refreshing the app page by swiping down, or clearing your mobile browser cache.' }
            ],
            privacy: [
                { q: 'How is my data used?', a: 'We collect your phone number and game statistics solely to manage your game state and calculate rankings. We never share your data with third parties.' }
            ],
            terms: [
                { q: 'Are there age restrictions?', a: 'Yes, you must be 18 years or older, or have parental consent, and be an active Ethio Telecom subscriber to compete for cash rewards.' }
            ]
        };

        if (this._showContactSupportForm) {
            root.innerHTML = `
                <div class="stadium-container" style="pointer-events: auto;">
                    ${header(titles[locale] || titles['en'])}

                    <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                        <button id="btn-back-help" style="margin-bottom: 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: white; padding: 8px 16px; border-radius: 8px; font-weight: 800; cursor: pointer;">
                            ⬅️ HELP DIRECTORY
                        </button>
                        
                        <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); text-align: left;" id="support-form-container">
                            <div style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 12px; text-transform: uppercase;">✉️ Contact Support</div>
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; font-size: 12px; color: #94A3B8; margin-bottom: 6px; font-weight: 600;">ISSUE TYPE</label>
                                <select id="support-category" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: white; outline: none;">
                                    <option value="Billing & Subscription">Billing & Subscription</option>
                                    <option value="Technical Issues">Technical Issues</option>
                                    <option value="Rewards & Points">Rewards & Points</option>
                                    <option value="General Feedback">General Feedback</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: #94A3B8; margin-bottom: 6px; font-weight: 600;">MESSAGE</label>
                                <textarea id="support-message" placeholder="Describe your issue here..." style="width: 100%; height: 80px; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: white; outline: none; resize: none; font-family: sans-serif; box-sizing: border-box;"></textarea>
                            </div>
                            <button id="btn-submit-support" style="width: 100%; padding: 12px; background: var(--tv-pitch-green); color: white; border: none; border-radius: 8px; font-weight: 800; cursor: pointer;">SUBMIT TICKET</button>
                        </div>
                    </div>
                </div>
            `;

            this._bindSubBack();
            document.getElementById('btn-back-help')?.addEventListener('click', () => {
                this._audioManager.playClick();
                this._showContactSupportForm = false;
                this.render();
            });

            document.getElementById('btn-submit-support')?.addEventListener('click', async () => {
                this._audioManager.playClick();
                const msg = (document.getElementById('support-message') as HTMLTextAreaElement)?.value.trim();
                const catSelect = document.getElementById('support-category') as HTMLSelectElement;
                const cat = catSelect ? catSelect.value : 'General Feedback';
                
                if (!msg) {
                    Toast.show('Please enter a message before submitting.', 'warning');
                    return;
                }
                const container = document.getElementById('support-form-container');
                if (container) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 16px; color: #94A3B8;">
                            Submitting ticket to server...
                        </div>
                    `;
                    const res = await SupportService.getInstance().createTicket(cat, msg);
                    const refId = res.success ? `EF-${res.ticketId.substring(0, 8).toUpperCase()}` : 'EF-' + Math.floor(100000 + Math.random() * 900000);
                    
                    container.innerHTML = `
                        <div style="text-align: center; padding: 16px;">
                            <div style="font-size: 40px; margin-bottom: 8px;">✅</div>
                            <div style="font-size: 16px; font-weight: 800; color: var(--tv-pitch-green); margin-bottom: 4px;">TICKET SUBMITTED</div>
                            <div style="font-size: 13px; color: #94A3B8; margin-bottom: 12px;">Our support team will respond via SMS shortly.</div>
                            <div style="font-size: 12px; font-weight: 700; color: white; background: rgba(255,255,255,0.08); padding: 6px; border-radius: 6px; font-family: monospace; display: inline-block;">REF: ${refId}</div>
                        </div>
                    `;
                }
            });
            return;
        }

        if (this._helpCategory) {
            const activeFaqs = this._faqsCache.length > 0 ? this._faqsCache : (HELP_FAQS[this._helpCategory] || []);
            const faqHtml = activeFaqs.map((faq, idx) => `
                <div class="glass-card" style="border-radius: 12px; margin-bottom: 12px; border-color: rgba(255,255,255,0.08); overflow: hidden;">
                    <div class="faq-header" data-idx="${idx}" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; cursor: pointer; background: rgba(255,255,255,0.02);">
                        <div style="font-size: 14px; font-weight: 800; color: white;">${faq.q}</div>
                        <span class="faq-icon" style="color: var(--tv-gold-primary); font-size: 12px; transition: transform 0.2s;">➕</span>
                    </div>
                    <div class="faq-body" id="faq-body-${idx}" style="max-height: 0; overflow: hidden; transition: max-height 0.2s ease-out; background: rgba(0,0,0,0.2);">
                        <div style="padding: 16px; font-size: 13px; color: #CBD5E1; line-height: 1.5;">${faq.a}</div>
                    </div>
                </div>
            `).join('');

            const categoryName = helpCategories.find(c => c.id === this._helpCategory)?.name[locale] || this._helpCategory;

            root.innerHTML = `
                <div class="stadium-container" style="pointer-events: auto;">
                    ${header(`${categoryName.toUpperCase()}`)}

                    <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                        <button id="btn-back-help" style="margin-bottom: 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: white; padding: 8px 16px; border-radius: 8px; font-weight: 800; cursor: pointer;">
                            ⬅️ HELP DIRECTORY
                        </button>
                        
                        <!-- Search FAQs -->
                        <input type="text" id="faq-search-input" placeholder="🔍 Search FAQs..." style="
                            width: 100%; 
                            padding: 10px 14px; 
                            background: rgba(0,0,0,0.2); 
                            border: 1px solid rgba(255,255,255,0.1); 
                            border-radius: 8px; 
                            color: white; 
                            font-size: 13px; 
                            margin-bottom: 16px; 
                            box-sizing: border-box;
                        ">

                        <div id="faq-list-wrapper">
                            ${faqHtml}
                        </div>
                    </div>
                </div>
            `;

            this._bindSubBack();
            document.getElementById('btn-back-help')?.addEventListener('click', () => {
                this._audioManager.playClick();
                this._helpCategory = null;
                this._faqsCache = [];
                this.render();
            });

            // FAQ Search Input Event
            const faqSearch = document.getElementById('faq-search-input') as HTMLInputElement;
            faqSearch?.addEventListener('input', (e) => {
                const query = (e.target as HTMLInputElement).value.toLowerCase();
                const cards = root.querySelectorAll('#faq-list-wrapper > .glass-card');
                cards.forEach(card => {
                    const headerText = (card.querySelector('.faq-header > div')?.textContent || '').toLowerCase();
                    const bodyText = (card.querySelector('.faq-body > div')?.textContent || '').toLowerCase();
                    if (headerText.includes(query) || bodyText.includes(query)) {
                        (card as HTMLElement).style.display = 'block';
                    } else {
                        (card as HTMLElement).style.display = 'none';
                    }
                });
            });

            const faqHeaders = root.querySelectorAll('.faq-header');
            faqHeaders.forEach(h => {
                h.addEventListener('click', (e) => {
                    this._audioManager.playClick();
                    const target = e.currentTarget as HTMLElement;
                    const idx = target.getAttribute('data-idx');
                    const body = root.querySelector(`#faq-body-${idx}`) as HTMLElement;
                    const icon = target.querySelector('.faq-icon') as HTMLElement;
                    if (body && icon) {
                        if (body.style.maxHeight === '0px' || !body.style.maxHeight) {
                            body.style.maxHeight = body.scrollHeight + 'px';
                            icon.innerText = '➖';
                        } else {
                            body.style.maxHeight = '0px';
                            icon.innerText = '➕';
                        }
                    }
                });
            });
            return;
        }

        const categoriesHtml = helpCategories.map(c => `
            <div class="settings-tile help-category-tile" data-cat-id="${c.id}" style="
                display: flex; align-items: center; justify-content: space-between; 
                padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 20px;">${c.icon}</span>
                    <div style="font-size: 15px; font-weight: 700; color: white;">${c.name[locale] || c.name['en']}</div>
                </div>
                <span style="color: #64748B;">❯</span>
            </div>
        `).join('');

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'])}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08); margin-bottom: 24px;">
                        ${categoriesHtml}
                    </div>

                    <button id="btn-contact-support" style="
                        width: 100%; 
                        padding: 16px; 
                        background: var(--tv-blue-accent); 
                        color: white; 
                        font-weight: 800; 
                        font-size: 15px; 
                        border: none; 
                        border-radius: 12px; 
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(59,130,246,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                    ">
                        ✉️ CONTACT SUPPORT
                    </button>
                </div>
            </div>
        `;

        this._bindSubBack();

        document.getElementById('btn-contact-support')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._showContactSupportForm = true;
            this.render();
        });

        const catTiles = root.querySelectorAll('.help-category-tile');
        catTiles.forEach(tile => {
            tile.addEventListener('click', async (e) => {
                const target = e.currentTarget as HTMLElement;
                const catId = target.getAttribute('data-cat-id');
                if (catId) {
                    this._audioManager.playClick();
                    this._helpCategory = catId;
                    
                    // Show a quick loader while fetching
                    const wrapper = document.getElementById('faq-list-wrapper');
                    if (wrapper) wrapper.innerHTML = '<div style="padding: 20px; color: #94A3B8;">Loading FAQs...</div>';
                    
                    const faqService = FAQService.getInstance();
                    const rawFaqs = await faqService.getFAQsByCategory(catId);
                    
                    const currentLocale = i18n.currentLocale;
                    this._faqsCache = rawFaqs.map(item => {
                        let q = item.question_en;
                        let a = item.answer_en;
                        if (currentLocale === 'am' && item.question_am && item.answer_am) {
                            q = item.question_am;
                            a = item.answer_am;
                        } else if (currentLocale === 'om' && item.question_om && item.answer_om) {
                            q = item.question_om;
                            a = item.answer_om;
                        }
                        return { q, a };
                    });
                    
                    this.render();
                }
            });
        });
    }

    private _renderTermsScreen(root: HTMLElement, locale: string, header: Function): void {
        const titles: Record<string, string> = {
            en: 'TERMS & CONDITIONS',
            am: 'ውሎች እና ሁኔታዎች',
            om: 'WALIIGALTEE'
        };

        const body: Record<string, string> = {
            en: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. Introduction & EthioFantasy Agreement</h2>
                    <p>Welcome to EthioFantasy, the premium Football Quiz League developed for Ethio Telecom customers. By accessing this Value Added Service (VAS), you enter into a binding agreement with EthioFantasy and Ethio Telecom.</p>
                    
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. Subscription Plans & Billing</h2>
                    <p>Subscribing to Premium grants unlimited gameplay access, full league entry, and entry into weekly cash pools. Premium subscription billing is 2 Birr/day. Basic subscription is billed at 1 Birr/day. Daily subscription fees are automatically deducted from your Ethio Telecom airtime balance.</p>
                    
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. Gameplay & Leaderboard Integrity</h2>
                    <p>The Football Quiz League requires participants to answer themed questions within the allocated time (30 seconds for Solo, 20 seconds for Live 1v1). Score progression and ELO points are recorded in real-time. Cheating, abusing system vulnerabilities, or using bots is strictly prohibited and results in immediate account termination.</p>
                    
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">4. Rewards & Cash Prize Distribution</h2>
                    <p>Reward points (XP and coins) gained in Daily Challenges, Tournaments, and matches do not have real cash value unless specified. Official weekly leaderboard cash prizes are credited directly to the subscriber's verified Ethio Telecom mobile account balance. Decision of the EthioFantasy administration on rank calculations is final.</p>
                </div>
            `,
            am: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. መግቢያ እና የኢትዮፋንታሲ ስምምነት</h2>
                    <p>ለኢትዮ ቴሌኮም ደንበኞች ወደተዘጋጀው የኢትዮ ፋንታሲ የእግር ኳስ ጥያቄ ሊግ እንኳን በደህና መጡ። ይህንን ተጨማሪ እሴት አገልግሎት (VAS) በመጠቀም፣ ከኢትዮፋንታሲ እና ከኢትዮ ቴሌኮም ጋር ውል ይገባሉ።</p>
                    
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. የምዝገባ ዕቅድ እና ክፍያ</h2>
                    <p>ለፕሪሚየም አገልግሎት ዕለታዊ ክፍያ 2 ብር ሲሆን፤ መሰረታዊ አገልግሎት ዕለታዊ ክፍያ 1 ብር ነው። የምዝገባ ክፍያው ከኢትዮ ቴሌኮም የሞባይል ሂሳብዎ ላይ በቀጥታ ተቀናሽ ይደረጋል።</p>
                    
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. የጨዋታ እና የደረጃ ሰሌዳ ታማኝነት</h2>
                    <p>ጥያቄዎችን በተሰጠው የጊዜ ገደብ ውስጥ መመለስ ይኖርብዎታል። በጨዋታ ላይ ማጭበርበር ወይም ያልተፈቀዱ ቦቶችን መጠቀም መለያዎ በቋሚነት እንዲታገድ ያደርጋል።</p>
                </div>
            `,
            om: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. Seensa & Waliigaltee EthioFantasy</h2>
                    <p>Gara EthioFantasy, dorgommii gaaffii kubbaa miilaa Itiyo Telekoom fayyadamtootaaf qophaa'eetti baga nagaan dhuftan.</p>
                    
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. Kaffaltii</h2>
                    <p>Kaffaltiin Premium guyyaatti qarshii 2 yommuu ta'u, kaffaltiin Basic guyyaatti qarshii 1 dha. Kaffaltiin kun herrega bilbila keessanii irraa hir'ifama.</p>
                </div>
            `
        };

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'])}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); background: rgba(15,23,42,0.85); color: #CBD5E1;">
                        ${body[locale] || body['en']}
                    </div>
                </div>
            </div>
        `;

        this._bindSubBack();
    }

    private _renderPrivacyScreen(root: HTMLElement, locale: string, header: Function): void {
        const titles: Record<string, string> = {
            en: 'PRIVACY POLICY',
            am: 'የግላዊነት ፖሊሲ',
            om: 'IMAAMMATA DHUUNFAA'
        };

        const body: Record<string, string> = {
            en: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. Information We Collect</h2>
                    <p>We collect subscriber MSISDN (mobile number), device IP address, locale preference, subscription state, and gameplay statistics (scores, response times, ELO ratings) to manage the EthioFantasy service.</p>
                    
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. Integration with Ethio Telecom</h2>
                    <p>Our application integrates directly with Ethio Telecom VAS Gateway APIs. Subscription status checks are executed on every login session to confirm billing and verify eligibility for weekly cash rewards.</p>
                    
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. Data Protection & Retainment</h2>
                    <p>Player statistics and phone numbers are encrypted in transit and at rest. We store player data securely using cloud server clusters. We do not sell or share subscriber data with any third-party organizations.</p>
                </div>
            `,
            am: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. የምንሰበስበው መረጃ</h2>
                    <p>ለጨዋታው አስተዳደር እንዲረዳን የተጠቃሚውን ስልክ ቁጥር (MSISDN)፣ የቋንቋ ምርጫ እና የጨዋታ ነጥቦችን እንሰበስባለን።</p>
                    
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. ከኢትዮ ቴሌኮም ጋር ያለው ትስስር</h2>
                    <p>አፕሊኬሽኑ ከኢትዮ ቴሌኮም የቪኤኤስ (VAS) መተግበሪያ ጋር በቀጥታ የተገናኘ ሲሆን፣ ሳምንታዊ ሽልማቶችን ለማረጋገጥ ስልክዎን እንጠቀማለን።</p>
                </div>
            `,
            om: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. Odeeffannoo Nyaatamu</h2>
                    <p>Lakkoofsa bilbilaa fi qabxii tapha keessanii qofa sirnaa keenya keessatti kuusna.</p>
                </div>
            `
        };

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'])}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); background: rgba(15,23,42,0.85); color: #CBD5E1;">
                        ${body[locale] || body['en']}
                    </div>
                </div>
            </div>
        `;

        this._bindSubBack();
    }

    private _renderAboutScreen(root: HTMLElement, locale: string, header: Function): void {
        const titles: Record<string, string> = {
            en: 'ABOUT ETHIO FANTASY',
            am: 'ስለ ኢትዮ ፋንታሲ',
            om: 'WAA\'EE ETHIO FANTASY'
        };

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'])}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px; text-align: center;">
                    <div style="font-size: 64px; margin-bottom: 16px;">⚽</div>
                    <div style="font-size: 24px; font-weight: 900; color: white; margin-bottom: 8px;">EthioFantasy</div>
                    <div style="font-size: 13px; color: var(--tv-gold-primary); font-weight: 800; margin-bottom: 24px; letter-spacing: 1.5px; text-transform: uppercase;">Ethio Telecom VAS Integration</div>
                    
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); text-align: left; font-size: 14px; line-height: 1.6; color: #CBD5E1; margin-bottom: 24px;">
                        <p style="margin-top: 0;"><strong>Application Description:</strong><br>EthioFantasy is a premium Football Quiz League platform crafted specifically for football fans in Ethiopia. Play daily trivia matches, challenge other players in live 1v1 showdowns, and climb the league divisions to win cash prizes.</p>
                        
                        <p style="margin-bottom: 0;"><strong>Key Features:</strong><br>
                        • Daily themed challenges with score multipliers<br>
                        • Live 1v1 real-time matchmaking<br>
                        • Interactive Weekend knockout tournaments<br>
                        • Professional division promotions & ELO ranking leaderboard<br>
                        • Integrated billing checking via SMS OTP</p>
                    </div>

                    <div class="glass-card" style="border-radius: 12px; padding: 16px; border-color: rgba(255,255,255,0.08); text-align: left; font-size: 13px; color: #CBD5E1; margin-bottom: 24px;">
                        <div><strong>Version:</strong> 1.1.0</div>
                        <div style="margin-top: 6px;"><strong>Developer:</strong> InnoGames VAS Team</div>
                        <div style="margin-top: 6px;"><strong>Ethio Telecom Integration:</strong> VAS Gateway API v3.2</div>
                        <div style="margin-top: 6px;"><strong>Contact:</strong> support@ethiofantasy.com</div>
                    </div>

                    <div style="font-size: 12px; color: #64748B; font-weight: 700;">
                        © 2026 Ethio Telecom VAS. All Rights Reserved.
                    </div>
                </div>
            </div>
        `;

        this._bindSubBack();
    }

    private _goBack(): void {
        this._subScreen = 'main';
        this._helpCategory = null;
        this._showContactSupportForm = false;
        this.render();
    }

    private _bindSubBack(): void {
        document.getElementById('btn-back-sub')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._goBack();
        });
    }

    private _maskPhone(phone: string): string {
        let clean = phone.replace(/[^0-9+]/g, '');
        if (clean.startsWith('+')) {
            clean = clean.substring(1);
        }
        if (clean.startsWith('251')) {
            clean = '251' + clean.replace(/^0+/, '');
        }
        return clean.substring(0, 4) + '****' + clean.substring(clean.length - 2);
    }
}
