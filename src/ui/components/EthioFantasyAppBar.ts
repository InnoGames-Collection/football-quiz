export class EthioFantasyAppBar {
    /**
     * Generates the standard app bar HTML
     * @param title The title of the page
     * @param actionsHtml Optional HTML for trailing actions (e.g. mark all read button)
     * @returns HTML string for the app bar
     */
    public static render(title: string, actionsHtml: string = ''): string {
        return `
            <div class="ethio-fantasy-app-bar" style="
                display: flex;
                align-items: center;
                height: 72px;
                background-color: #071B2D;
                padding: env(safe-area-inset-top) 0 0 0;
                box-sizing: content-box;
                width: 100%;
                z-index: 100;
                position: relative;
            ">
                <button class="app-bar-back-btn" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-left: 24px;
                    margin-right: 16px;
                    padding: 0;
                " aria-label="Back">❮</button>
                <div class="app-bar-title" style="
                    flex: 1;
                    color: white;
                    font-weight: 700;
                    font-size: var(--fds-font-md, 18px);
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-transform: uppercase;
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
