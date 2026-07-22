import { CacheManager } from '../../core/cache/CacheManager';
import { Toast } from './Toast';

export class PullToRefresh {
    /**
     * Attach pull-to-refresh behavior to a container element.
     */
    public static attach(container: HTMLElement, onRefresh: () => Promise<void>): void {
        let startY = 0;
        let currentY = 0;
        let isPulling = false;

        const spinner = document.createElement('div');
        spinner.className = 'pull-to-refresh-indicator';
        spinner.style.cssText = `
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(15,23,42,0.96);
            border: 1px solid var(--fds-gold-primary);
            color: var(--fds-gold-primary);
            padding: 8px 18px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 900;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6);
            transition: top 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s;
            opacity: 0;
            pointer-events: none;
            backdrop-filter: blur(12px);
        `;
        spinner.innerHTML = `<span>⚽</span> <span>Pull down to refresh...</span>`;
        container.style.position = 'relative';
        container.appendChild(spinner);

        container.addEventListener('touchstart', (e) => {
            // Guard: Disable Pull-to-Refresh during active quiz
            if (CacheManager.getInstance().isQuizActive) return;

            if (container.scrollTop <= 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isPulling || CacheManager.getInstance().isQuizActive) return;
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;

            if (diff > 0 && container.scrollTop <= 0) {
                const pullDistance = Math.min(diff * 0.45, 75);
                spinner.style.top = `${pullDistance - 42}px`;
                spinner.style.opacity = `${Math.min(pullDistance / 50, 1)}`;
                if (pullDistance >= 55) {
                    spinner.innerHTML = `<span>⚡</span> <span>Release to refresh!</span>`;
                } else {
                    spinner.innerHTML = `<span>⚽</span> <span>Pull down to refresh...</span>`;
                }
            }
        }, { passive: true });

        container.addEventListener('touchend', async () => {
            if (!isPulling || CacheManager.getInstance().isQuizActive) return;
            isPulling = false;
            const diff = currentY - startY;

            if (diff > 110 && container.scrollTop <= 0) {
                spinner.style.top = '16px';
                spinner.innerHTML = `<span>⚽⏳</span> <span>Updating EthioFantasy...</span>`;
                
                const savedScroll = container.scrollTop;

                try {
                    await onRefresh();
                    container.scrollTop = savedScroll;
                    Toast.show('Everything is up to date.', 'info');
                } catch (err) {
                    console.error('[PullToRefresh] Refresh failed:', err);
                    Toast.show('Failed to refresh data. Pull down to try again.', 'error');
                }
            }
            
            spinner.style.top = '-50px';
            spinner.style.opacity = '0';
            startY = 0;
            currentY = 0;
        });
    }
}
