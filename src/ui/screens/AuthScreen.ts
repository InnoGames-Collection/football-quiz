import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { AuthManager } from '../../core/auth/AuthManager';
import { DesignSystem } from '../theme/DesignSystem';

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

        root.innerHTML = `
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--fds-text-main);
                font-family: system-ui, -apple-system, sans-serif;
                pointer-events: auto;
                padding: 20px;
                box-sizing: border-box;
            ">
                <!-- Card Container -->
                <div style="
                    background: rgba(30, 41, 59, 0.85);
                    border: 1px solid rgba(255, 215, 0, 0.3);
                    border-radius: 24px;
                    padding: 36px 28px;
                    width: 100%;
                    max-width: 420px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(16px);
                    text-align: center;
                ">
                    <!-- Platform Logo & Title -->
                    <div style="margin-bottom: 24px;">
                        <div style="font-size: 48px; margin-bottom: 8px;">⚽</div>
                        <h1 style="
                            font-size: var(--fds-font-xl);
                            font-weight: 900;
                            margin: 0;
                            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            letter-spacing: 1px;
                        ">FOOTBALL QUIZ LEAGUE</h1>
                        <p style="color: var(--fds-text-dim); font-size: var(--fds-font-sm); margin-top: 6px; letter-spacing: 0.5px;">
                            ETHIO TELECOM VAS PLATFORM
                        </p>
                    </div>

                    ${this._statusMessage ? `
                        <div style="
                            background: rgba(239, 68, 68, 0.15);
                            border: 1px solid rgba(239, 68, 68, 0.4);
                            color: #FCA5A5;
                            padding: 10px 14px;
                            border-radius: 12px;
                            font-size: var(--fds-font-sm);
                            margin-bottom: 20px;
                        ">${this._statusMessage}</div>
                    ` : ''}

                    <!-- Auth Flow Forms -->
                    ${this._phoneStep === 'INPUT_PHONE' ? this._renderPhoneInput() : this._renderOtpInput()}
                </div>
            </div>
        `;

        this._bindEvents();
    }

    private _renderPhoneInput(): string {
        const defaultVal = this._pendingPhone ? this._pendingPhone.replace('+251', '') : '911000000';

        return `
            <div style="text-align: left; margin-bottom: 16px;">
                <label style="display: block; font-size: var(--fds-font-xs); color: var(--fds-text-muted); margin-bottom: 6px; font-weight: 600;">
                    PHONE NUMBER (+251 ETHIOPIA)
                </label>
                <div style="display: flex; gap: 8px;">
                    <span style="
                        background: rgba(15, 23, 42, 0.6);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: 12px;
                        padding: 12px 14px;
                        color: var(--fds-gold-primary);
                        font-weight: bold;
                        font-size: var(--fds-font-sm);
                    ">+251</span>
                    <input type="tel" id="phone-input" placeholder="911000000" value="${defaultVal}" style="
                        flex: 1;
                        background: rgba(15, 23, 42, 0.6);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: 12px;
                        padding: 12px 14px;
                        color: var(--fds-text-main);
                        font-size: var(--fds-font-md);
                        outline: none;
                    " />
                </div>
            </div>

            <!-- Test Accounts Quick Selector -->
            <div style="margin-bottom: 20px; text-align: left;">
                <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                    ⚡ Ethio Telecom Test Phone Numbers:
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button class="test-phone-chip" data-phone="911000000" style="background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3); color: var(--fds-gold-primary); padding: 4px 10px; border-radius: 6px; font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer;">911000000</button>
                    <button class="test-phone-chip" data-phone="911000001" style="background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3); color: var(--fds-gold-primary); padding: 4px 10px; border-radius: 6px; font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer;">911000001</button>
                    <button class="test-phone-chip" data-phone="911000002" style="background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3); color: var(--fds-gold-primary); padding: 4px 10px; border-radius: 6px; font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer;">911000002</button>
                </div>
            </div>

            ${DesignSystem.Button({ id: 'send-otp-btn', text: 'SEND SMS VERIFICATION CODE', variant: 'primary', fullWidth: true })}
        `;
    }

    private _renderOtpInput(): string {
        return `
            <div style="text-align: left; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label style="font-size: var(--fds-font-xs); color: var(--fds-text-muted); font-weight: 600;">
                        ENTER 6-DIGIT VERIFICATION CODE
                    </label>
                    <button id="change-phone-btn" style="background: none; border: none; color: var(--fds-blue-accent); font-size: var(--fds-font-xs); cursor: pointer;">
                        Change number
                    </button>
                </div>
                <input type="text" id="otp-input" maxlength="6" value="123456" placeholder="123456" style="
                    width: 100%;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid #FFD700;
                    border-radius: 12px;
                    padding: 14px;
                    color: var(--fds-gold-primary);
                    font-size: var(--fds-font-lg);
                    letter-spacing: 8px;
                    text-align: center;
                    outline: none;
                    box-sizing: border-box;
                " />
                <div style="font-size: var(--fds-font-xs); color: #86EFAC; font-weight: 700; margin-top: 6px; text-align: center;">
                    🔑 Test OTP code for test accounts: <span style="font-family: var(--tv-mono);">123456</span>
                </div>
            </div>
            ${DesignSystem.Button({ id: 'verify-otp-btn', text: 'VERIFY & ENTER LEAGUE', variant: 'primary', fullWidth: true })}
        `;
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelectorAll('.test-phone-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                this._audioManager.playClick();
                const phone = (e.currentTarget as HTMLElement).getAttribute('data-phone') || '911000000';
                const phoneInput = root.querySelector('#phone-input') as HTMLInputElement;
                if (phoneInput) {
                    phoneInput.value = phone;
                    this._pendingPhone = `+251${phone}`;
                }
            });
        });

        const sendOtpBtn = root.querySelector('#send-otp-btn');
        if (sendOtpBtn) {
            sendOtpBtn.addEventListener('click', async () => {
                this._audioManager.playClick();
                const phoneInput = root.querySelector('#phone-input') as HTMLInputElement;
                const rawNum = phoneInput?.value.trim().replace(/\s+/g, '') || '';
                
                if (!rawNum) {
                    this._statusMessage = 'Please enter a valid phone number.';
                    this.render();
                    return;
                }

                const fullPhone = rawNum.startsWith('+') ? rawNum : `+251${rawNum.replace(/^0/, '')}`;
                this._pendingPhone = fullPhone;
                this._statusMessage = 'Sending OTP SMS...';
                this.render();

                const res = await this._authManager.signInWithPhone(fullPhone);
                if (res.success) {
                    this._phoneStep = 'INPUT_OTP';
                    this._statusMessage = '';
                } else {
                    this._statusMessage = res.error || 'Failed to send OTP.';
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
                    this._statusMessage = 'Please enter a 6-digit verification code.';
                    this.render();
                    return;
                }

                this._statusMessage = 'Verifying code...';
                this.render();

                const res = await this._authManager.verifyOtp(this._pendingPhone, token);
                if (res.success) {
                    this._onSuccess();
                } else {
                    this._statusMessage = res.error || 'Invalid verification code.';
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
