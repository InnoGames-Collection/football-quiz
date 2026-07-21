export interface ButtonProps {
    id?: string;
    text: string;
    variant?: 'gold' | 'green' | 'glass';
    icon?: string;
    fullWidth?: boolean;
    className?: string;
}

export interface CardProps {
    id?: string;
    content: string;
    borderColor?: string;
    padding?: string;
    className?: string;
}

export interface BadgeProps {
    text: string;
    variant?: 'live' | 'rank' | 'division' | 'minute' | 'gold';
    icon?: string;
}

export interface ProfileProps {
    username: string;
    xp: number;
    coins?: number;
    streakCount?: number;
    rankName: string;
    rankIcon: string;
    divisionName: string;
    divisionBadge: string;
    level: number;
    levelProgressPercent: number;
}

export class DesignSystem {
    /**
     * Reusable FDS Button Component
     */
    public static Button(props: ButtonProps): string {
        const variantClass = props.variant === 'gold' 
            ? 'fds-btn-gold' 
            : props.variant === 'green' 
            ? 'fds-btn-green' 
            : 'glass-card';
        const widthStyle = props.fullWidth ? 'width: 100%;' : '';
        const idAttr = props.id ? `id="${props.id}"` : '';

        return `
            <button ${idAttr} class="fds-btn ${variantClass} ${props.className || ''}" style="${widthStyle}">
                ${props.icon ? `<span>${props.icon}</span>` : ''}
                ${props.text}
            </button>
        `;
    }

    /**
     * Reusable FDS Card Component
     */
    public static Card(props: CardProps): string {
        const borderStyle = props.borderColor ? `border-color: ${props.borderColor};` : '';
        const paddingStyle = props.padding ? `padding: ${props.padding};` : 'padding: 20px;';
        const idAttr = props.id ? `id="${props.id}"` : '';

        return `
            <div ${idAttr} class="glass-card fds-card ${props.className || ''}" style="${paddingStyle} ${borderStyle}">
                ${props.content}
            </div>
        `;
    }

    /**
     * Reusable FDS Badge Component
     */
    public static Badge(props: BadgeProps): string {
        if (props.variant === 'live') {
            return `
                <span class="tv-live-badge">
                    <span class="tv-live-dot"></span> ${props.text}
                </span>
            `;
        }
        if (props.variant === 'minute') {
            return `<span class="tv-minute-badge">${props.text}</span>`;
        }

        return `
            <span class="fds-badge" style="background: rgba(255, 215, 0, 0.12); border: 1px solid #FFD700; color: #FFD700;">
                ${props.icon ? `${props.icon} ` : ''}${props.text}
            </span>
        `;
    }

    /**
     * Reusable FDS Profile Component
     */
    public static Profile(props: ProfileProps): string {
        return `
            <div class="glass-card" style="padding: 18px; border-color: var(--fds-gold-primary);">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="
                            width: 48px;
                            height: 48px;
                            border-radius: 50%;
                            background: var(--fds-gold-gradient);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 24px;
                            font-weight: bold;
                            color: #000;
                            box-shadow: 0 0 14px var(--fds-gold-glow);
                        ">⚽</div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-weight: 900; font-size: 16px; color: white;">${props.username}</span>
                                <span class="rank-badge">${props.rankIcon} ${props.rankName}</span>
                            </div>
                            <div style="font-size: 12px; color: var(--fds-gold-primary); font-weight: 800; margin-top: 2px;">
                                ${props.divisionBadge} ${props.divisionName}
                            </div>
                        </div>
                    </div>

                    <div style="text-align: right;">
                        <div style="font-size: 12px; color: var(--fds-gold-primary); font-weight: 900; font-family: var(--fds-font-mono);">
                            LVL ${props.level} (${props.xp} XP)
                        </div>
                        <div style="width: 140px; height: 6px; background: rgba(255,255,255,0.15); border-radius: 3px; overflow: hidden; margin-top: 4px;">
                            <div class="tv-progress-fill" style="width: ${props.levelProgressPercent}%; height: 100%; background: var(--fds-gold-gradient);"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Reusable FDS Progress Bar Component
     */
    public static ProgressBar(percent: number, color: string = 'var(--fds-gold-gradient)'): string {
        return `
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden;">
                <div class="tv-progress-fill" style="width: ${Math.min(Math.max(percent, 0), 100)}%; height: 100%; background: ${color};"></div>
            </div>
        `;
    }

    /**
     * Reusable FDS Dialog Component
     */
    public static Dialog(title: string, content: string, footer: string): string {
        return `
            <div class="glass-card" style="
                width: 100%;
                max-width: 480px;
                padding: 32px 24px;
                text-align: center;
                border-color: var(--fds-gold-primary);
                box-shadow: 0 20px 60px rgba(0,0,0,0.85);
            ">
                <h2 style="font-size: 26px; font-weight: 900; color: white; margin: 0 0 16px 0;">${title}</h2>
                <div style="margin-bottom: 24px;">${content}</div>
                <div>${footer}</div>
            </div>
        `;
    }
}
