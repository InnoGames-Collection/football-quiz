import { t } from '../../localization/i18n';

export class EthioFantasyAppBar {
    /**
     * Generates the standard app bar HTML
     * @param title The title of the page
     * @param actionsHtml Optional HTML for trailing actions (e.g. mark all read button)
     * @returns HTML string for the app bar
     */
    public static render(title: string, actionsHtml: string = '', showBackButton: boolean = true): string {
        return `
            <div class="ethio-fantasy-app-bar" style="
                display: flex;
                align-items: center;
                height: 72px;
                background-color: rgba(7, 27, 45, 0.85);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                padding: env(safe-area-inset-top) 0 0 0;
                box-sizing: content-box;
                width: 100%;
                z-index: 100;
                position: relative;
            ">
                ${showBackButton ? `
                <button class="app-bar-back-btn ethio-profile-btn" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    width: 160px;
                    height: 56px;
                    background: linear-gradient(135deg, rgba(7, 27, 45, 0.95) 0%, rgba(7, 27, 45, 0.7) 100%);
                    border: 1px solid rgba(0, 200, 83, 0.3);
                    border-radius: 16px;
                    color: white;
                    cursor: pointer;
                    margin-left: 16px;
                    margin-right: 12px;
                    padding: 0 16px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(0, 200, 83, 0.15);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                " aria-label="Back">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span style="font-size: 18px; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${t('common.back') || 'BACK'}</span>
                </button>` : ''}
                <div class="app-bar-title" style="
                    flex: 1;
                    color: white;
                    font-weight: 800;
                    font-size: var(--fds-font-md, 18px);
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-transform: uppercase;
                    ${!showBackButton ? 'text-align: center; padding-left: 16px;' : ''}
                ">${title}</div>
                ${actionsHtml ? `
                <div class="app-bar-actions" style="
                    display: flex;
                    align-items: center;
                    padding-right: 16px;
                ">
                    ${actionsHtml}
                </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Binds the back button to the provided callback
     * @param container The container where the app bar was rendered
     * @param onBack Callback function to execute when back is pressed
     */
    public static bind(container: HTMLElement, onBack: () => void): void {
        const backBtn = container.querySelector('.app-bar-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                onBack();
            });
        }
    }
}
