import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { AuthManager } from '../../core/auth/AuthManager';
import { i18n } from '../../localization/i18n';

export class AuthScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _authManager: AuthManager;
    private _onSuccess: () => void;
    private _phoneStep: 'INPUT_PHONE' | 'INPUT_OTP' = 'INPUT_PHONE';
    private _pendingPhone: string = '';
    private _statusMessage: string = '';

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
    }

    public render(): void {
        const root = this._uiManager.container;
        const isOtpStep = this._phoneStep === 'INPUT_OTP';
        const defaultVal = this._pendingPhone ? this._pendingPhone.replace('+251', '') : '';

        root.innerHTML = `
            <div style="
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%);
                display: flex; align-items: center; justify-content: center;
                font-family: system-ui, -apple-system, sans-serif; pointer-events: auto; padding: 20px; box-sizing: border-box;
            ">
                <!-- White Card Container -->
                <div style="
                    background: #FFFFFF; border-radius: 24px; padding: 32px 24px;
                    width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    text-align: center;
                ">
                    <h1 style="font-size: 28px; font-weight: 800; color: #111827; margin: 0 0 24px 0;">${i18n.currentLocale === 'am' ? 'ይግቡ' : (i18n.currentLocale === 'om' ? 'Seenaa' : 'Sign In')}</h1>

                    ${this._statusMessage ? `
                        <div style="color: #EF4444; font-size: 14px; margin-bottom: 16px; text-align: left;">
                            ${this._statusMessage}
                        </div>
                    ` : ''}

                    <div style="text-align: left; margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; color: #4B5563; font-weight: 600; margin-bottom: 8px;">
                            ${i18n.currentLocale === 'am' ? 'የስልክ ቁጥር' : (i18n.currentLocale === 'om' ? 'Lakkoofsa bilbilaa' : 'Phone number')}
                        </label>
                        <input type="tel" id="phone-input" placeholder="2519XXXXXXXX / 2518XXXXXXXX" value="${defaultVal}" ${isOtpStep ? 'disabled' : ''} style="
                            width: 100%; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 12px;
                            padding: 14px 16px; color: #111827; font-size: 16px; outline: none; box-sizing: border-box;
                            opacity: ${isOtpStep ? '0.6' : '1'};
                        " />
                    </div>

                    <div style="display: flex; align-items: stretch; margin-bottom: ${isOtpStep ? '24px' : '32px'}; border: 1px solid #D1D5DB; border-radius: 12px; overflow: hidden; background: #FFFFFF; opacity: ${isOtpStep ? '1' : '0.6'};">
                        <input type="text" id="otp-input" maxlength="6" placeholder="${i18n.currentLocale === 'am' ? 'የ 6-አሃዝ ኮድ' : (i18n.currentLocale === 'om' ? 'Koodii dijiitii 6' : '6-digit code')}" ${isOtpStep ? '' : 'disabled'} style="
                            flex: 1; background: transparent; border: none; padding: 14px 16px;
                            color: #111827; font-size: 16px; outline: none; width: 100%;
                        " />
                        <button id="send-otp-btn" style="
                            background: #2563EB; color: white; border: none; padding: 0 20px;
                            font-size: 16px; font-weight: 600; cursor: ${isOtpStep ? 'default' : 'pointer'}; outline: none;
                            opacity: ${isOtpStep ? '0.7' : '1'}; white-space: nowrap;
                        " ${isOtpStep ? 'disabled' : ''}>
                            ${i18n.currentLocale === 'am' ? 'ኮድ ያግኙ' : (i18n.currentLocale === 'om' ? 'Koodii fudhadhu' : 'Get code')}
                        </button>
                    </div>

                    <div id="sign-in-container" style="display: ${isOtpStep ? 'block' : 'none'}; margin-bottom: 24px;">
                        <button id="verify-otp-btn" style="
                            width: 100%; background: #16A34A; color: white; border: none; border-radius: 12px;
                            padding: 14px; font-size: 16px; font-weight: bold; cursor: pointer;
                        ">${i18n.currentLocale === 'am' ? 'ይግቡ' : (i18n.currentLocale === 'om' ? 'Seenaa' : 'Sign In')}</button>
                    </div>

                    <div style="margin-top: 16px;">
                        <a href="#" style="color: #16A34A; text-decoration: underline; font-size: 14px; font-weight: 600;">${i18n.currentLocale === 'am' ? 'ደንቦች እና ሁኔታዎች' : (i18n.currentLocale === 'om' ? 'Waliigaltee & Haalawwan' : 'Terms & Conditions')}</a>
                    </div>
                    
                    ${isOtpStep ? `
                        <div style="margin-top: 12px;">
                            <button id="change-phone-btn" style="background: none; border: none; color: #2563EB; font-size: 14px; cursor: pointer;">
                                ${i18n.currentLocale === 'am' ? 'ቁጥር ይቀይሩ' : (i18n.currentLocale === 'om' ? 'Lakkoofsa jijjiiri' : 'Change number')}
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelector('#phone-input')?.addEventListener('input', (e: Event) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, '');
        });

        const sendOtpBtn = root.querySelector('#send-otp-btn');
        if (sendOtpBtn) {
            sendOtpBtn.addEventListener('click', async () => {
                this._audioManager.playClick();
                const phoneInput = root.querySelector('#phone-input') as HTMLInputElement;
                const rawNum = phoneInput?.value.trim().replace(/\s+/g, '') || '';
                
                if (!rawNum) {
                    this._statusMessage = i18n.currentLocale === 'am' ? 'እባክዎን ትክክለኛ የስልክ ቁጥር ያስገቡ።' : (i18n.currentLocale === 'om' ? 'Maaloo lakkoofsa bilbilaa sirrii ta\'e galchaa.' : 'Please enter a valid phone number.');
                    this.render();
                    return;
                }

                const fullPhone = rawNum.startsWith('+') ? rawNum : `+251${rawNum.replace(/^0/, '')}`;
                this._pendingPhone = fullPhone;
                this._statusMessage = i18n.currentLocale === 'am' ? 'የኦቲፒ መልዕክት በመላክ ላይ...' : (i18n.currentLocale === 'om' ? 'OTP SMS ergaa jira...' : 'Sending OTP SMS...');
                this.render();

                const res = await this._authManager.signInWithPhone(fullPhone);
                if (res.success) {
                    this._phoneStep = 'INPUT_OTP';
                    this._statusMessage = '';
                } else {
                    this._statusMessage = res.error || (i18n.currentLocale === 'am' ? 'ኮድ መላክ አልተቻለም።' : (i18n.currentLocale === 'om' ? 'OTP erguun hin danda\'amne.' : 'Failed to send OTP.'));
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
                    this._statusMessage = i18n.currentLocale === 'am' ? 'እባክዎን የ 6-አሃዝ ማረጋገጫ ኮድ ያስገቡ።' : (i18n.currentLocale === 'om' ? 'Maaloo koodii mirkaneessaa dijiitii 6 galchaa.' : 'Please enter a 6-digit verification code.');
                    this.render();
                    return;
                }

                this._statusMessage = i18n.currentLocale === 'am' ? 'ኮድ በመፈተሽ ላይ...' : (i18n.currentLocale === 'om' ? 'Koodii mirkaneessaa jira...' : 'Verifying code...');
                this.render();

                const res = await this._authManager.verifyOtp(this._pendingPhone, token);
                if (res.success) {
                    this._statusMessage = i18n.currentLocale === 'am' ? 'ፕሮፋይል በመጫን ላይ...' : (i18n.currentLocale === 'om' ? 'Pirofaayilii fe\'aa jira...' : 'Loading profile...');
                    this.render();
                    this._onSuccess();
                } else {
                    this._statusMessage = res.error || (i18n.currentLocale === 'am' ? 'የተሳሳተ የማረጋገጫ ኮድ።' : (i18n.currentLocale === 'om' ? 'Koodii mirkaneessaa dogoggoraa.' : 'Invalid verification code.'));
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
                this.render();
            });
        }
    }
}

