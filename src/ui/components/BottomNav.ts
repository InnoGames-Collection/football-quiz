export type TabId = 'home' | 'play' | 'league' | 'rankings' | 'profile';

export interface TabConfig {
    id: TabId;
    label: string;
    icon: string;
}

export class BottomNav {
    private static _activeTab: TabId = 'home';

    private static TABS: TabConfig[] = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'play', label: 'Play', icon: '⚽' },
        { id: 'league', label: 'League', icon: '🏆' },
        { id: 'rankings', label: 'Rankings', icon: '📊' },
        { id: 'profile', label: 'Profile', icon: '👤' }
    ];

    public static get activeTab(): TabId {
        return BottomNav._activeTab;
    }

    public static setActiveTab(tabId: TabId): void {
        BottomNav._activeTab = tabId;
        BottomNav.updateTabHighlights();
    }

    public static render(onTabChange: (tabId: TabId) => void): void {
        let navContainer = document.getElementById('fds-bottom-nav');
        if (!navContainer) {
            navContainer = document.createElement('div');
            navContainer.id = 'fds-bottom-nav';
            navContainer.style.position = 'fixed';
            navContainer.style.bottom = '0';
            navContainer.style.left = '0';
            navContainer.style.width = '100%';
            // Use safe-area insets for modern edge-to-edge mobile devices
            navContainer.style.paddingBottom = 'env(safe-area-inset-bottom, 16px)';
            // Core height + safe area
            navContainer.style.height = 'calc(64px + env(safe-area-inset-bottom, 16px))';
            navContainer.style.background = 'rgba(2, 6, 23, 0.96)';
            navContainer.style.borderTop = '2px solid var(--fds-gold-primary, #FFD700)';
            navContainer.style.boxShadow = '0 -8px 32px rgba(0, 0, 0, 0.85)';
            navContainer.style.backdropFilter = 'blur(16px)';
            navContainer.style.zIndex = '9000';
            navContainer.style.display = 'flex';
            navContainer.style.justifyContent = 'space-around';
            navContainer.style.alignItems = 'center'; // Usually center, but paddingBottom handles the safe area offset
            navContainer.style.pointerEvents = 'auto';
            document.body.appendChild(navContainer);
        }

        navContainer.innerHTML = BottomNav.TABS.map(t => {
            const isActive = t.id === BottomNav._activeTab;
            return `
                <button class="nav-tab-item ${isActive ? 'nav-tab-active' : ''}" data-tab-id="${t.id}" style="
                    background: none;
                    border: none;
                    color: ${isActive ? 'var(--fds-gold-primary, #FFD700)' : '#94A3B8'};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    padding: var(--fds-space-8) var(--fds-space-12);
                    flex: 1;
                    transition: all 180ms ease-out;
                    min-height: 48px; /* Strict 48px touch target */
                    outline: none;
                ">
                    <span style="font-size: 20px; margin-bottom: 2px;">${t.icon}</span>
                    <span style="
                        font-size: var(--fds-font-xs);
                        font-weight: ${isActive ? '800' : '600'};
                        letter-spacing: 0.5px;
                        font-family: var(--fds-font-body);
                    ">${t.label}</span>
                </button>
            `;
        }).join('');

        // Bind click listeners
        const buttons = navContainer.querySelectorAll('.nav-tab-item');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const tabId = target.getAttribute('data-tab-id') as TabId;
                if (tabId && tabId !== BottomNav._activeTab) {
                    BottomNav.setActiveTab(tabId);
                    onTabChange(tabId);
                }
            });
        });
    }

    private static updateTabHighlights(): void {
        const navContainer = document.getElementById('fds-bottom-nav');
        if (!navContainer) return;

        const buttons = navContainer.querySelectorAll('.nav-tab-item');
        buttons.forEach(btn => {
            const tabId = btn.getAttribute('data-tab-id');
            const isActive = tabId === BottomNav._activeTab;
            const element = btn as HTMLElement;
            element.style.color = isActive ? 'var(--fds-gold-primary, #FFD700)' : '#94A3B8';
            const labelSpan = element.querySelector('span:nth-child(2)') as HTMLElement;
            if (labelSpan) {
                labelSpan.style.fontWeight = isActive ? '800' : '600';
            }
        });
    }
}
