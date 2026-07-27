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

        // Show the local part of the phone (without +251 prefix) in the input
        const localPart = this._pendingPhone
            ? this._pendingPhone.replace(/^\+251/, '')
            : '';

        root.innerHTML = `
            <div style="
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%);
                display: flex; align-items: center; justify-content: center;
                font-family: system-ui, -apple-system, sans-serif; pointer-events: auto; padding: 20px; box-sizing: border-box;
            ">
                <div style="
                    background: #FFFFFF; border-radius: 24px; padding: 32px 24px;
                    width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    text-align: center;
                ">
                    <h1 style="font-size: 28px; font-weight: 800; color: #111827; margin: 0 0 24px 0;">
                        ${i18n.currentLocale === 'am' ? 'ይግቡ' : (i18n.currentLocale === 'om' ? 'Seenaa' : 'Sign In')}
                    </h1>

                    ${this._statusMessage ? `
                        <div style="color: #EF4444; font-size: 14px; margin-bottom: 16px; text-align: left;">
                            ${this._statusMessage}
                        </div>
                    ` : ''}

                    ${this._devOtpCode ? `
                        <div style="
                            background: #F0FDF4; border: 2px solid #16A34A; border-radius: 12px;
                            padding: 12px 16px; margin-bottom: 16px; text-align: left;
                        ">
                            <div style="font-size: 12px; font-weight: 700; color: #15803D; text-transform: uppercase; margin-bottom: 4px;">
                                🔑 Your OTP Code (Dev Mode)
                            </div>
                            <div style="font-size: 28px; font-weight: 900; color: #111827; letter-spacing: 6px;">
                                ${this._devOtpCode}
                            </div>
                            <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">
                                Enter this code below to sign in
                            </div>
                        </div>
                    ` : ''}

                    <div style="text-align: left; margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; color: #4B5563; font-weight: 600; margin-bottom: 8px;">
                            ${i18n.currentLocale === 'am' ? 'የስልክ ቁጥር' : (i18n.currentLocale === 'om' ? 'Lakkoofsa bilbilaa' : 'Phone number')}
                        </label>
                        <div style="display: flex; align-items: center; border: 1px solid #D1D5DB; border-radius: 12px; overflow: hidden; background: #FFFFFF; ${isOtpStep ? 'opacity: 0.6;' : ''}">
                            <span style="
                                padding: 14px 10px 14px 16px; background: #F9FAFB;
                                color: #374151; font-size: 16px; font-weight: 600;
                                border-right: 1px solid #E5E7EB; white-space: nowrap;
                            ">+251</span>
                            <input type="tel" id="phone-input"
                                placeholder="9XXXXXXXX or 8XXXXXXXX"
                                value="${localPart}"
                                ${isOtpStep ? 'disabled' : ''}
                                style="
                                flex: 1; border: none; outline: none; background: transparent;
                                padding: 14px 16px; color: #111827; font-size: 16px;
                            " />
                        </div>
                        <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px; padding-left: 2px;">
                            Enter 9XXXXXXXX (Ethio Telecom) or 8XXXXXXXX — the +251 is added automatically
                        </div>
                    </div>

                    <div style="display: flex; align-items: stretch; margin-bottom: ${isOtpStep ? '16px' : '32px'}; border: 1px solid #D1D5DB; border-radius: 12px; overflow: hidden; background: #FFFFFF; opacity: ${isOtpStep ? '1' : '0.6'};">
                        <input type="text" id="otp-input" maxlength="6"
                            placeholder="${i18n.currentLocale === 'am' ? 'የ 6-አሃዝ ኮድ' : (i18n.currentLocale === 'om' ? 'Koodii dijiitii 6' : '6-digit code')}"
                            ${isOtpStep ? '' : 'disabled'}
                            style="
                            flex: 1; background: transparent; border: none; padding: 14px 16px;
                            color: #111827; font-size: 16px; outline: none; width: 100%;
                            letter-spacing: 4px; font-weight: 700;
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
                        <a href="#" style="color: #16A34A; text-decoration: underline; font-size: 14px; font-weight: 600;">
                            ${i18n.currentLocale === 'am' ? 'ደንቦች እና ሁኔታዎች' : (i18n.currentLocale === 'om' ? 'Waliigaltee & Haalawwan' : 'Terms & Conditions')}
                        </a>
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

        // Only allow digits in phone input (the +251 prefix is shown as static text)
        root.querySelector('#phone-input')?.addEventListener('input', (e: Event) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, '');
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

                // The input field shows only the local part — prepend +251
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
