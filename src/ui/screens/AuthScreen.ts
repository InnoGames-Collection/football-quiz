import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { AuthManager } from '../../core/auth/AuthManager';
import { supabase } from '../../networking/supabase/SupabaseClient';
import { i18n } from '../../localization/i18n';

export class AuthScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _authManager: AuthManager;
    private _onSuccess: () => void;
    private _phoneStep: 'INPUT_PHONE' | 'INPUT_OTP' = 'INPUT_PHONE';
    private _pendingPhone: string = '';
    private _statusMessage: string = '';
    private _devOtpCode: string = '';
    private _showSettings: boolean = false;
    private _settingsTab: 'main' | 'language' | 'tc' | 'faq' = 'main';
    private _faqExpandedIndex: number = -1;

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        authManager: AuthManager,
        onSuccess: () => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._authManager = authManager;
        this._onSuccess = onSuccess;

        (window as any).ethioOnBackPress = () => {
            if (this._showSettings) {
                if (this._settingsTab !== 'main') {
                    this._settingsTab = 'main';
                } else {
                    this._showSettings = false;
                }
                this.render();
                return true;
            }
            return false;
        };
    }

    private _renderSettingsContent(): string {
        if (this._settingsTab === 'main') {
            return `
                <div class="settings-tile" data-tab="language" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; background: rgba(255,255,255,0.05); border-radius: 12px 12px 0 0;">
                    <div style="font-weight: 700; font-size: 16px;">${i18n.currentLocale === 'am' ? 'ቋንቋ' : i18n.currentLocale === 'om' ? 'Afaan' : 'Language'}</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #94A3B8;">${i18n.currentLocale === 'am' ? 'አማርኛ' : i18n.currentLocale === 'om' ? 'Afan Oromo' : 'English'}</span>
                        <span>❯</span>
                    </div>
                </div>
                <div class="settings-tile sound-toggle" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; background: rgba(255,255,255,0.05);">
                    <div style="font-weight: 700; font-size: 16px;">${i18n.currentLocale === 'am' ? 'የድምፅ ውጤቶች' : i18n.currentLocale === 'om' ? 'Sagalee' : 'Sound Effects'}</div>
                    <div style="color: ${!this._audioManager.isMuted ? '#4ADE80' : '#F87171'}; font-weight: 700;">${!this._audioManager.isMuted ? 'ON' : 'OFF'}</div>
                </div>
                <div class="settings-tile" data-tab="tc" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; background: rgba(255,255,255,0.05);">
                    <div style="font-weight: 700; font-size: 16px;">${i18n.currentLocale === 'am' ? 'ውሎች እና ሁኔታዎች' : i18n.currentLocale === 'om' ? 'Waliigaltee & Haalawwan' : 'Terms & Conditions'}</div>
                    <span>❯</span>
                </div>
                <div class="settings-tile" data-tab="faq" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; cursor: pointer; background: rgba(255,255,255,0.05); border-radius: 0 0 12px 12px;">
                    <div style="font-weight: 700; font-size: 16px;">FAQ</div>
                    <span>❯</span>
                </div>
            `;
        } else if (this._settingsTab === 'language') {
            return `
                <div class="settings-tile lang-item" data-lang="en" style="padding: 16px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between;">
                    <span>English</span>
                    ${i18n.currentLocale === 'en' ? '<span>✓</span>' : ''}
                </div>
                <div class="settings-tile lang-item" data-lang="am" style="padding: 16px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; display: flex; justify-content: space-between;">
                    <span>አማርኛ (Amharic)</span>
                    ${i18n.currentLocale === 'am' ? '<span>✓</span>' : ''}
                </div>
                <div class="settings-tile lang-item" data-lang="om" style="padding: 16px; background: rgba(255,255,255,0.05); cursor: pointer; border-radius: 0 0 12px 12px; display: flex; justify-content: space-between;">
                    <span>Afan Oromo</span>
                    ${i18n.currentLocale === 'om' ? '<span>✓</span>' : ''}
                </div>
            `;
        } else if (this._settingsTab === 'tc') {
            return `
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px;">
                    <h2 style="margin-top: 0; font-size: 20px;">Terms & Conditions</h2>
                    <p style="color: #CBD5E1; line-height: 1.6;">Welcome to EthioFantasy. By logging in, you agree to our Terms & Conditions. You must be 18 years or older and an active subscriber to participate. Your data is handled securely and in compliance with local regulations. Subscription fees are deducted automatically from your airtime.</p>
                </div>
            `;
        } else if (this._settingsTab === 'faq') {
            const faqs = [
                { q: "How do I play?", a: "Answer questions quickly to score goals. Each fast correct answer increases your chance to win!" },
                { q: "Is it free?", a: "There is a daily subscription fee for premium access. It will be deducted from your airtime balance." },
                { q: "How are prizes awarded?", a: "Prizes are distributed based on weekly leaderboard standings and sent directly to your mobile account." },
                { q: "How do I unsubscribe?", a: "You can unsubscribe anytime by sending 'STOP' to 8282 or visiting your profile settings." }
            ];
            return faqs.map((f, i) => `
                <div class="faq-item" data-idx="${i}" style="background: rgba(255,255,255,0.05); margin-bottom: 10px; border-radius: 12px; overflow: hidden; cursor: pointer;">
                    <div style="padding: 16px; font-weight: bold; border-bottom: ${this._faqExpandedIndex === i ? '1px solid rgba(255,255,255,0.1)' : 'none'}; display: flex; justify-content: space-between;">
                        <span>${f.q}</span>
                        <span style="color: #F59E0B;">${this._faqExpandedIndex === i ? '−' : '+'}</span>
                    </div>
                    ${this._faqExpandedIndex === i ? `<div style="padding: 16px; color: #CBD5E1; line-height: 1.5;">${f.a}</div>` : ''}
                </div>
            `).join('');
        }
        return '';
    }

    public render(): void {
        const root = this._uiManager.container;
        const isOtpStep = this._phoneStep === 'INPUT_OTP';

        // Show the pending phone exactly as they typed it before or the normalised form without the '+'.
        const defaultVal = this._pendingPhone ? this._pendingPhone.replace('+', '') : '';

        root.innerHTML = `
            <div style="
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%);
                display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
                font-family: system-ui, -apple-system, sans-serif; pointer-events: auto; padding: 20px; box-sizing: border-box; overflow-y: auto;
            ">
                <!-- Top-Right Settings -->
                <div style="width: 100%; max-width: 400px; display: flex; justify-content: flex-end; margin-bottom: 16px; flex-shrink: 0;">
                    <button id="auth-settings-btn" style="background: rgba(255,255,255,0.1); border: none; border-radius: 50%; width: 40px; height: 40px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                        <span style="font-size: 20px; line-height: 1;">⚙️</span>
                    </button>
                </div>

                <!-- 10-Banner Carousel -->
                <div style="width: 100%; max-width: 400px; margin-bottom: 20px; flex-shrink: 0; position: relative; height: 160px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.3); background: #0F172A;">
                    <img id="auth-banner-bg" src="/assets/banners/${this._currentBanner}.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 1; transition: opacity 0.8s ease-in-out;" />
                    <img id="auth-banner-fg" src="/assets/banners/${this._currentBanner === 10 ? 1 : this._currentBanner + 1}.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: opacity 0.8s ease-in-out;" />
                </div>
                
                ${this._showSettings ? `
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #0F172A; z-index: 1000; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden;">
                    <div style="display: flex; align-items: center; height: 72px; padding: env(safe-area-inset-top) 0 0 0; background: #020617; border-bottom: 1px solid rgba(255,255,255,0.1); box-sizing: content-box;">
                        <button id="auth-settings-back" style="width: 48px; height: 48px; background: none; border: none; color: white; font-size: 24px; cursor: pointer; margin-left: 16px; display: flex; align-items: center; justify-content: center;">❮</button>
                        <div style="flex: 1; color: white; font-weight: 700; font-size: 18px; text-transform: uppercase;">
                            ${this._settingsTab === 'main' ? (i18n.currentLocale === 'am' ? 'ቅንብሮች' : i18n.currentLocale === 'om' ? 'Qindaa\'inoota' : 'Settings') : this._settingsTab === 'language' ? (i18n.currentLocale === 'am' ? 'ቋንቋ ይምረጡ' : i18n.currentLocale === 'om' ? 'Afaan Filadhu' : 'Select Language') : this._settingsTab === 'tc' ? 'Terms & Conditions' : 'FAQ'}
                        </div>
                    </div>
                    <div style="padding: 20px; color: white; flex: 1; max-width: 600px; margin: 0 auto; width: 100%; box-sizing: border-box;">
                        ${this._renderSettingsContent()}
                    </div>
                </div>
                ` : ''}

                <!-- Compact Sign In Card -->
                <div style="
                    background: #FFFFFF; border-radius: 20px; padding: 20px;
                    width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    text-align: center; margin-bottom: 20px; flex-shrink: 0;
                ">
                    <h1 style="font-size: 24px; font-weight: 800; color: #111827; margin: 0 0 16px 0;">
                        ${i18n.currentLocale === 'am' ? 'ይግቡ' : (i18n.currentLocale === 'om' ? 'Seenaa' : 'Sign In')}
                    </h1>

                    ${this._statusMessage ? `
                        <div style="color: #EF4444; font-size: 13px; margin-bottom: 12px; text-align: left;">
                            ${this._statusMessage}
                        </div>
                    ` : ''}

                    ${this._devOtpCode ? `
                        <div style="
                            background: #F0FDF4; border: 2px solid #16A34A; border-radius: 10px;
                            padding: 10px 14px; margin-bottom: 12px; text-align: left;
                        ">
                            <div style="font-size: 11px; font-weight: 700; color: #15803D; text-transform: uppercase; margin-bottom: 4px;">
                                🔑 Your OTP Code (Dev Mode)
                            </div>
                            <div style="font-size: 24px; font-weight: 900; color: #111827; letter-spacing: 4px;">
                                ${this._devOtpCode}
                            </div>
                        </div>
                    ` : ''}

                    <div style="text-align: left; margin-bottom: 12px;">
                        <label style="display: block; font-size: 13px; color: #4B5563; font-weight: 600; margin-bottom: 6px;">
                            ${i18n.currentLocale === 'am' ? 'የስልክ ቁጥር' : (i18n.currentLocale === 'om' ? 'Lakkoofsa bilbilaa' : 'Phone number')}
                        </label>
                        <input type="tel" id="phone-input" placeholder="2519XXXXXXXX / 2518XXXXXXXX" value="${defaultVal}" ${isOtpStep ? 'disabled' : ''} style="
                            width: 100%; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 10px;
                            padding: 12px 14px; color: #111827; font-size: 15px; outline: none; box-sizing: border-box;
                            opacity: ${isOtpStep ? '0.6' : '1'};
                        " />
                    </div>

                    <div style="display: flex; align-items: stretch; margin-bottom: ${isOtpStep ? '12px' : '20px'}; border: 1px solid #D1D5DB; border-radius: 10px; overflow: hidden; background: #FFFFFF; opacity: ${isOtpStep ? '1' : '0.6'};">
                        <input type="text" id="otp-input" maxlength="6"
                            placeholder="${i18n.currentLocale === 'am' ? 'የ 6-አሃዝ ኮድ' : (i18n.currentLocale === 'om' ? 'Koodii dijiitii 6' : '6-digit code')}"
                            ${isOtpStep ? '' : 'disabled'}
                            style="
                            flex: 1; background: transparent; border: none; padding: 12px 14px;
                            color: #111827; font-size: 15px; outline: none; width: 100%;
                            letter-spacing: 2px; font-weight: 700;
                        " />
                        <button id="send-otp-btn" style="
                            background: #2563EB; color: white; border: none; padding: 0 16px;
                            font-size: 14px; font-weight: 600; cursor: ${isOtpStep ? 'default' : 'pointer'}; outline: none;
                            opacity: ${isOtpStep ? '0.7' : '1'}; white-space: nowrap;
                        " ${isOtpStep ? 'disabled' : ''}>
                            ${i18n.currentLocale === 'am' ? 'ኮድ ያግኙ' : (i18n.currentLocale === 'om' ? 'Koodii fudhadhu' : 'Get code')}
                        </button>
                    </div>

                    <div id="sign-in-container" style="display: ${isOtpStep ? 'block' : 'none'}; margin-bottom: 16px;">
                        <button id="verify-otp-btn" style="
                            width: 100%; background: #16A34A; color: white; border: none; border-radius: 10px;
                            padding: 12px; font-size: 15px; font-weight: bold; cursor: pointer;
                        ">${i18n.currentLocale === 'am' ? 'ይግቡ' : (i18n.currentLocale === 'om' ? 'Seenaa' : 'Sign In')}</button>
                    </div>

                    <div style="margin-top: 12px;">
                        <a href="#" style="color: #16A34A; text-decoration: underline; font-size: 13px; font-weight: 600;">
                            ${i18n.currentLocale === 'am' ? 'ደንቦች እና ሁኔታዎች' : (i18n.currentLocale === 'om' ? 'Waliigaltee & Haalawwan' : 'Terms & Conditions')}
                        </a>
                    </div>

                    ${isOtpStep ? `
                        <div style="margin-top: 8px;">
                            <button id="change-phone-btn" style="background: none; border: none; color: #2563EB; font-size: 13px; cursor: pointer;">
                                ${i18n.currentLocale === 'am' ? 'ቁጥር ይቀይሩ' : (i18n.currentLocale === 'om' ? 'Lakkoofsa jijjiiri' : 'Change number')}
                            </button>
                        </div>
                    ` : ''}
                </div>

                <!-- Subscribe Button -->
                <button id="auth-subscribe-btn" style="
                    background: linear-gradient(135deg, #F59E0B, #EA580C); color: white;
                    border: none; border-radius: 20px; padding: 14px 24px; font-size: 16px;
                    font-weight: 800; width: 100%; max-width: 400px; cursor: pointer;
                    box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4); text-transform: uppercase;
                    letter-spacing: 0.5px; flex-shrink: 0; margin-bottom: 40px;
                ">
                    ${i18n.currentLocale === 'am' ? 'ሰብስክራይብ ያድርጉ' : (i18n.currentLocale === 'om' ? 'Galmoofadhu' : 'Subscribe Now')}
                </button>
            </div>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        if (this._bannerInterval) {
            clearInterval(this._bannerInterval);
            this._bannerInterval = null;
        }

        if (!this._showSettings) {
            this._bannerInterval = setInterval(() => {
                const bgImg = root.querySelector('#auth-banner-bg') as HTMLImageElement;
                const fgImg = root.querySelector('#auth-banner-fg') as HTMLImageElement;
                
                if (bgImg && fgImg) {
                    fgImg.style.opacity = '1';
                    
                    setTimeout(() => {
                        if (!bgImg || !fgImg) return;
                        bgImg.src = fgImg.src;
                        fgImg.style.transition = 'none';
                        fgImg.style.opacity = '0';
                        
                        this._currentBanner = this._currentBanner >= 10 ? 1 : this._currentBanner + 1;
                        const nextNextBanner = this._currentBanner >= 10 ? 1 : this._currentBanner + 1;
                        fgImg.src = `/assets/banners/${nextNextBanner}.png`;
                        
                        void fgImg.offsetWidth; // force reflow
                        fgImg.style.transition = 'opacity 0.8s ease-in-out';
                    }, 800);
                }
            }, 4000);
        }

        root.querySelector('#phone-input')?.addEventListener('input', (e: Event) => {
            const input = e.target as HTMLInputElement;
            // Let the user type numbers and optionally a + sign at the beginning.
            input.value = input.value.replace(/[^0-9+]/g, '');
            if (input.value.indexOf('+') > 0) {
                input.value = input.value.replace(/\+/g, '');
            }
        });

        const sendOtpBtn = root.querySelector('#send-otp-btn');
        if (sendOtpBtn) {
            sendOtpBtn.addEventListener('click', async () => {
                this._audioManager.playClick();
                const phoneInput = root.querySelector('#phone-input') as HTMLInputElement;
                const rawNum = phoneInput?.value.trim() || '';

                if (!rawNum) {
                    this._statusMessage = i18n.currentLocale === 'am'
                        ? 'እባክዎን ትክክለኛ የስልክ ቁጥር ያስገቡ።'
                        : (i18n.currentLocale === 'om'
                            ? 'Maaloo lakkoofsa bilbilaa sirrii ta\'e galchaa.'
                            : 'Please enter a valid phone number.');
                    this.render();
                    return;
                }

                // Use the shared normalise method to produce E.164.
                const fullPhone = AuthManager.normalisePhone(rawNum);
                this._pendingPhone = fullPhone;
                this._devOtpCode = '';
                this._statusMessage = i18n.currentLocale === 'am'
                    ? 'የኦቲፒ መልዕክት በመላክ ላይ...'
                    : (i18n.currentLocale === 'om' ? 'OTP SMS ergaa jira...' : 'Sending OTP...');
                this.render();

                const res = await this._authManager.signInWithPhone(fullPhone);
                if (res.success) {
                    this._phoneStep = 'INPUT_OTP';
                    this._statusMessage = '';
                    // Try to echo the OTP from dev_otps table (no SMS gateway needed)
                    this._fetchDevOtp(fullPhone);
                } else {
                    this._statusMessage = res.error || (i18n.currentLocale === 'am'
                        ? 'ኮድ መላክ አልተቻለም።'
                        : (i18n.currentLocale === 'om' ? 'OTP erguun hin danda\'amne.' : 'Failed to send OTP.'));
                }
                this.render();
            });
        }

        const verifyOtpBtn = root.querySelector('#verify-otp-btn');
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', async () => {
                this._audioManager.playClick();
                const otpInput = root.querySelector('#otp-input') as HTMLInputElement;
                const token = otpInput?.value.trim() || '';

                if (token.length !== 6) {
                    this._statusMessage = i18n.currentLocale === 'am'
                        ? 'እባክዎን የ 6-አሃዝ ማረጋገጫ ኮድ ያስገቡ።'
                        : (i18n.currentLocale === 'om'
                            ? 'Maaloo koodii mirkaneessaa dijiitii 6 galchaa.'
                            : 'Please enter a 6-digit verification code.');
                    this.render();
                    return;
                }

                this._statusMessage = i18n.currentLocale === 'am'
                    ? 'ኮድ በመፈተሽ ላይ...'
                    : (i18n.currentLocale === 'om' ? 'Koodii mirkaneessaa jira...' : 'Verifying code...');
                this.render();

                const res = await this._authManager.verifyOtp(this._pendingPhone, token);
                if (res.success) {
                    this._onSuccess();
                } else {
                    this._statusMessage = res.error || (i18n.currentLocale === 'am'
                        ? 'የተሳሳተ የማረጋገጫ ኮድ።'
                        : (i18n.currentLocale === 'om'
                            ? 'Koodii mirkaneessaa dogoggoraa.'
                            : 'Invalid verification code.'));
                    this.render();
                }
            });
        }

        const changePhoneBtn = root.querySelector('#change-phone-btn');
        if (changePhoneBtn) {
            changePhoneBtn.addEventListener('click', () => {
                this._audioManager.playClick();
                this._phoneStep = 'INPUT_PHONE';
                this._statusMessage = '';
                this._devOtpCode = '';
                this.render();
            });
        }

        const settingsBtn = root.querySelector('#auth-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this._audioManager.playClick();
                this._showSettings = true;
                this._settingsTab = 'main';
                this.render();
            });
        }

        const settingsBackBtn = root.querySelector('#auth-settings-back');
        if (settingsBackBtn) {
            settingsBackBtn.addEventListener('click', () => {
                this._audioManager.playClick();
                if (this._settingsTab !== 'main') {
                    this._settingsTab = 'main';
                } else {
                    this._showSettings = false;
                }
                this.render();
            });
        }

        root.querySelectorAll('.settings-tile[data-tab]').forEach(el => {
            el.addEventListener('click', (e) => {
                this._audioManager.playClick();
                this._settingsTab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as any;
                this.render();
            });
        });

        root.querySelector('.sound-toggle')?.addEventListener('click', () => {
            this._audioManager.toggleMute();
            this._audioManager.playClick();
            
            const isMuted = this._audioManager.isMuted;
            localStorage.setItem('ETHIO_FOOTBALL_MUTED', String(isMuted));
            
            const saved = localStorage.getItem('ETHIO_FOOTBALL_SETTINGS_V2');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    parsed.soundEffects = !isMuted;
                    localStorage.setItem('ETHIO_FOOTBALL_SETTINGS_V2', JSON.stringify(parsed));
                } catch(e) {}
            }
            this.render();
        });

        root.querySelectorAll('.lang-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const lang = (e.currentTarget as HTMLElement).getAttribute('data-lang') as 'en' | 'am' | 'om';
                i18n.setLocale(lang);
                this._audioManager.playClick();
                this._settingsTab = 'main';
                this.render();
            });
        });

        root.querySelectorAll('.faq-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-idx') || '-1', 10);
                this._faqExpandedIndex = this._faqExpandedIndex === idx ? -1 : idx;
                this._audioManager.playClick();
                this.render();
            });
        });

        const subscribeBtn = root.querySelector('#auth-subscribe-btn');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', () => {
                this._audioManager.playClick();
                console.log('Subscribe clicked');
            });
        }
    }

    /**
     * Poll the dev_otps table for a code and show it on screen.
     * Only works when an OTP echo hook is configured in Supabase.
     * In production this table will be empty or not exist — fails silently.
     */
    private async _fetchDevOtp(phone: string): Promise<void> {
        if (!supabase) return;
        for (let i = 0; i < 8; i++) {
            await new Promise(r => setTimeout(r, 800));
            try {
                const { data } = await (supabase.from('dev_otps' as any) as any)
                    .select('code')
                    .eq('phone', phone)
                    .maybeSingle();
                if (data?.code) {
                    this._devOtpCode = String(data.code);
                    // Auto-fill the OTP input for convenience
                    const otpInput = this._uiManager.container.querySelector('#otp-input') as HTMLInputElement;
                    if (otpInput) otpInput.value = this._devOtpCode;
                    this.render();
                    return;
                }
            } catch {
                return; // dev_otps table doesn't exist — silent fail
            }
        }
    }
}
