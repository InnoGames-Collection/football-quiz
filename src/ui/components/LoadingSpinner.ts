export class LoadingSpinner {
    public static render(message: string = 'Loading...'): string {
        return `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px;
                color: white;
                font-family: system-ui, -apple-system, sans-serif;
            ">
                <div class="spinning-ball" style="font-size: 42px; margin-bottom: 14px;">⚽</div>
                <div style="font-size: 14px; font-weight: bold; color: #FFD700; letter-spacing: 1px;">
                    ${message}
                </div>
            </div>

            <style>
                .spinning-ball {
                    animation: spinBall 1.2s infinite linear;
                }
                @keyframes spinBall {
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.1); }
                    100% { transform: rotate(360deg) scale(1); }
                }
            </style>
        `;
    }
}
