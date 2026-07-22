import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { AuthManager } from '../../core/auth/AuthManager';

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
                color: white;
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
                            font-size: 28px;
                            font-weight: 900;
                            margin: 0;
                            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            letter-spacing: 1px;
                        ">FOOTBALL QUIZ LEAGUE</h1>
                        <p style="color: #94A3B8; font-size: 13px; margin-top: 6px; letter-spacing: 0.5px;">
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
                            font-size: 13px;
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
        return `
            <div style="text-align: left; margin-bottom: 16px;">
                <label style="display: block; font-size: 12px; color: #CBD5E1; margin-bottom: 6px; font-weight: 600;">
                    PHONE NUMBER (+251 ETHIOPIA)
                </label>
                <div style="display: flex; gap: 8px;">
                    <span style="
                        background: rgba(15, 23, 42, 0.6);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: 12px;
                        padding: 12px 14px;
                        color: #FFD700;
                        font-weight: bold;
                        font-size: 14px;
                    ">+251</span>
                    <input type="tel" id="phone-input" placeholder="912 345 678" value="${this._pendingPhone.replace('+251', '')}" style="
                        flex: 1;
                        background: rgba(15, 23, 42, 0.6);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: 12px;
                        padding: 12px 14px;
                        color: white;
                        font-size: 15px;
                        outline: none;
                    " />
                </div>
            </div>
            <button id="send-otp-btn" style="
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: bold;
                font-size: 15px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
            ">
                SEND SMS VERIFICATION CODE
            </button>
        `;
    }

    private _renderOtpInput(): string {
        return `
            <div style="text-align: left; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label style="font-size: 12px; color: #CBD5E1; font-weight: 600;">
                        ENTER 6-DIGIT VERIFICATION CODE
                    </label>
                    <button id="change-phone-btn" style="background: none; border: none; color: #60A5FA; font-size: 11px; cursor: pointer;">
                        Change number
                    </button>
                </div>
                <input type="text" id="otp-input" maxlength="6" placeholder="123456" style="
                    width: 100%;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid #FFD700;
                    border-radius: 12px;
                    padding: 14px;
                    color: #FFD700;
                    font-size: 20px;
                    letter-spacing: 8px;
                    text-align: center;
                    outline: none;
                    box-sizing: border-box;
                " />
            </div>
            <button id="verify-otp-btn" style="
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                border: none;
                border-radius: 12px;
                color: #0F172A;
                font-weight: bold;
                font-size: 15px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
            ">
                VERIFY & ENTER LEAGUE
            </button>
        `;
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

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
