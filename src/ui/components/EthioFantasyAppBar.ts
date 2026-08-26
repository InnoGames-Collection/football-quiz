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
                background-color: rgba(15, 23, 42, 0.75);
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
                <button class="app-bar-back-btn" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 14px;
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-left: 16px;
                    margin-right: 12px;
                    padding: 0;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: transform 0.2s, background-color 0.2s;
                " aria-label="Back">❮</button>` : ''}
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
