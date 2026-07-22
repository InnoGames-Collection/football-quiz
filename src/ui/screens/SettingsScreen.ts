import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { i18n } from '../../localization/i18n';
import { AuthManager } from '../../core/auth/AuthManager';
import { BottomNav } from '../components/BottomNav';

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

    constructor(uiManager: UIManager, saveManager: SaveManager, audioManager: AudioManager, onBack: () => void) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._onBack = onBack;
        this._loadSettings();
    }

    private _loadSettings(): void {
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
        // Keep sound mute state in sync
        const isMuted = localStorage.getItem('ETHIO_FOOTBALL_MUTED') === 'true';
        this._settings.soundEffects = !isMuted;
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

    private _saveSettings(): void {
        localStorage.setItem('ETHIO_FOOTBALL_SETTINGS_V2', JSON.stringify(this._settings));
        localStorage.setItem('ETHIO_FOOTBALL_MUTED', String(!this._settings.soundEffects));
        // Update AudioManager if necessary
        if (this._settings.soundEffects && this._audioManager.isMuted) {
            this._audioManager.toggleMute();
        } else if (!this._settings.soundEffects && !this._audioManager.isMuted) {
            this._audioManager.toggleMute();
        }
    }

    public render(): void {
        const root = this._uiManager.container;
        const locale = i18n.currentLocale;

        // Custom localized header helper
        const header = (title: string, _backAction: () => void) => `
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
        const maskedMsisdn = this._maskPhone(profile.phone || '251911223345');

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

        // Localized Strings
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
                // Redirect to auth route
                window.location.reload(); // Hard reload is the safest to reset all state to Guest
            }
        });
    }

    private _renderProfileScreen(root: HTMLElement, locale: string, header: Function): void {
        const profile = this._saveManager.profile;
        const maskedMsisdn = this._maskPhone(profile.phone || '251911223345');

        // Static registration date helper
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
                ${header(titles[locale] || titles['en'], () => this._goBack())}

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
                ${header(titles[locale] || titles['en'], () => this._goBack())}

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

        // Bind lang item clicks
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
                ${header(titles[locale] || titles['en'], () => this._goBack())}

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

        // Bind toggles
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
                ${header(titles[locale] || titles['en'], () => this._goBack())}

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

        // Bind sound clicks
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

        const faqs: Record<string, { q: string; a: string }[]> = {
            en: [
                { q: 'How do I play the quiz?', a: 'Tap "Play" or "Quick Play" from the Home dashboard to select a category. Answer questions as fast as possible to score goals!' },
                { q: 'How are ELO ratings calculated?', a: 'Winning Live 1v1 Matches increases your ELO rating. Scoring goals with high accuracy yields maximum points.' },
                { q: 'How do I win weekly prizes?', a: 'Top players in the rankings list at the end of the week win exclusive rewards. Keep active to maintain your rank!' }
            ],
            am: [
                { q: 'ጥያቄውን እንዴት እጫወታለሁ?', a: 'ከመነሻ ገጽ ላይ "ተጫወት" ወይም "ፈጣን ጨዋታ" ን በመንካት የሚፈልጉትን ሊግ ይምረጡ። በፍጥነት በመመለስ ጎል ያስቆጥሩ!' },
                { q: 'የኤሎ (ELO) ደረጃ እንዴት ነው የሚሰላው?', a: 'ቀጥታ 1v1 ውድድሮችን ማሸነፍ የእርስዎን የኤሎ ደረጃ ይጨምረዋል። ፈጣን እና ትክክለኛ ምላሽ ከፍተኛ ነጥብ ያስገኛል።' },
                { q: 'ሳምንታዊ ሽልማት እንዴት ማግኘት እችላለሁ?', a: 'በሳምንቱ መጨረሻ በደረጃ ሰሌዳው አናት ላይ የሚገኙ ተጫዋቾች ልዩ ሽልማት ያገኛሉ። ደረጃዎን ለመጠበቅ ዘወትር ይወዳደሩ!' }
            ],
            om: [
                { q: 'Gaaffii akkamittiin taphadha?', a: 'Mula\'a duraa irraa "Taphadhu" ykn "Tapha Saffisaa" tuquun garee dorgommii filadhu. Goolii galchuuf saffisaan deebisi!' },
                { q: 'Sadarkaan ELO akkamittiin shallagama?', a: 'Tapha Kallattii 1v1 injifachuun sadarkaa ELO kee dabala. Goolii galchuun qabxii olaanaa kenna.' },
                { q: 'Badhaasa torbanii akkamittiin mo\'adha?', a: 'Xumura torbaniitti dorgomtoota top ta\'an badhaasa addaa argatu. Sadarkaa kee eeggadhu!' }
            ]
        };

        const activeFaqs = faqs[locale] || faqs['en'];

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

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'], () => this._goBack())}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    ${faqHtml}
                </div>
            </div>
        `;

        this._bindSubBack();

        // FAQ accordion logic
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
    }

    private _renderTermsScreen(root: HTMLElement, locale: string, header: Function): void {
        const titles: Record<string, string> = {
            en: 'TERMS & CONDITIONS',
            am: 'ውሎች እና ሁኔታዎች',
            om: 'WALIIGALTEE'
        };

        const body: Record<string, string> = {
            en: `
                <h3>1. Introduction</h3>
                <p>Welcome to EthioFantasy. By subscribing and using our service, you agree to these terms.</p>
                <h3>2. Subscription Rates</h3>
                <p>Subscribing to premium features charges a daily fee directly from your Ethio Telecom mobile account balance.</p>
                <h3>3. Conduct</h3>
                <p>Cheating, exploiting bugs, or using unauthorized bots will lead to immediate ban and forfeit of all reward balances.</p>
            `,
            am: `
                <h3>1. መግቢያ</h3>
                <p>ወደ ኢትዮ ፋንታሲ እንኳን በደህና መጡ። አገልግሎቱን በመጠቀም በውሎች እና ሁኔታዎች መስማማትዎን ያረጋግጣሉ።</p>
                <h3>2. የምዝገባ ክፍያ</h3>
                <p>ለፕሪሚየም አገልግሎት ዕለታዊ ክፍያ ከኢትዮ ቴሌኮም የሞባይል ሂሳብዎ ላይ በቀጥታ ተቀናሽ ይደረጋል።</p>
                <h3>3. የተከለከሉ ተግባራት</h3>
                <p>ማጭበርበር ወይም ሌሎች ያልተፈቀዱ ተግባራት መለያዎን በቋሚነት እንዲታገድ እና ያገኙትን ነጥብ እንዲያጡ ያደርጋል።</p>
            `,
            om: `
                <h3>1. Seensa</h3>
                <p>Gara EthioFantasy baga nagaan dhuftan. Tajaajila keenya dhimma ba\'uun dhimmoota kanneen walii galuu keessan mul\'isa.</p>
                <h3>2. Kaffaltii</h3>
                <p>Premium dhimma ba\'uun kaffaltii guyyaa lakkoofsa bilbila Itiyo Telekoom keessan irraa fudhata.</p>
                <h3>3. Naamusa</h3>
                <p>Dogoggora uumuun, hack gochuun dhorkaa dha. Adabbiin isaa herrega dhoorkuu ta\'a.</p>
            `
        };

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'], () => this._goBack())}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); font-size: 14px; line-height: 1.6; color: #CBD5E1;">
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
                <h3>Data Collection</h3>
                <p>We store your phone number, score progression, and leaderboard metrics solely to offer the EthioFantasy quiz gameplay experience.</p>
                <h3>Third Parties</h3>
                <p>We do not sell or share your subscriber data with any unauthorized third parties outside of the necessary Ethio Telecom VAS portal connections.</p>
            `,
            am: `
                <h3>የመረጃ አሰባሰብ</h3>
                <p>አገልግሎታችንን ለመስጠት ስንል የእርስዎን የስልክ ቁጥር እና የጨዋታ ነጥቦችን ብቻ እናስቀምጣለን።</p>
                <h3>ሶስተኛ ወገኖች</h3>
                <p>የተመዝጋቢዎችን መረጃ ከኢትዮ ቴሌኮም የክፍያ ስርዓት ውጭ ለሌላ ለማንኛውም ሶስተኛ ወገን አናጋራም።</p>
            `,
            om: `
                <h3>Odeeffannoo</h3>
                <p>Odeeffannoo keessan kan akka lakkoofsa bilbilaa fi qabxii keessanii tapha qofaaf fayyadamna.</p>
                <h3>Garee 3ffaa</h3>
                <p>Odeeffannoo keessan kaffaltii Itiyo Telekoom tiin ala eenyuufiyyuu hin laannu.</p>
            `
        };

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'], () => this._goBack())}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); font-size: 14px; line-height: 1.6; color: #CBD5E1;">
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

        const desc: Record<string, string> = {
            en: 'EthioFantasy is a premium Football Quiz League developed for Ethio Telecom customers. Test your knowledge, climb the divisions, and compete weekly to win fantastic prizes.',
            am: 'ኢትዮ ፋንታሲ ለኢትዮ ቴሌኮም ደንበኞች የተዘጋጀ ምርጥ የእግር ኳስ ጥያቄ ሊግ ነው። እውቀትዎን ይፈትኑ፣ ወደ ከፍተኛ ዲቪዚዮን ያድጉ፣ እና በየሳምንቱ አሸናፊ በመሆን ሽልማቶችን ያግኙ።',
            om: 'EthioFantasy dorgommii kubbaa miilaa qarshii Itiyo Telekoom fayyadamtootaaf qophaa\'eedha. Beekumsa kee mirkaneessi badhaasa addaa fudhadhu.'
        };

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                ${header(titles[locale] || titles['en'], () => this._goBack())}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px; text-align: center;">
                    <div style="font-size: 64px; margin-bottom: 16px;">⚽</div>
                    <div style="font-size: 24px; font-weight: 900; color: white; margin-bottom: 8px;">EthioFantasy</div>
                    <div style="font-size: 13px; color: var(--tv-gold-primary); font-weight: 800; margin-bottom: 24px; letter-spacing: 1px;">CO-BRANDED ETHIO TELECOM VAS</div>
                    
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); text-align: left; font-size: 14px; line-height: 1.6; color: #CBD5E1; margin-bottom: 24px;">
                        <p>${desc[locale] || desc['en']}</p>
                    </div>

                    <div style="font-size: 12px; color: #64748B; font-weight: 700;">
                        Version 1.1.0 • Built with HTML5/TypeScript<br>
                        © 2026 Ethio Telecom VAS. All Rights Reserved.
                    </div>
                </div>
            </div>
        `;

        this._bindSubBack();
    }

    private _goBack(): void {
        this._subScreen = 'main';
        this.render();
    }

    private _bindSubBack(): void {
        document.getElementById('btn-back-sub')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._goBack();
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
