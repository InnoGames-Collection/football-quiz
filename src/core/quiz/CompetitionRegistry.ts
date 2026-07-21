export interface Competition {
    id: string;
    name: string;
    badge: string;
    description: string;
    color: string;
    questionCount: number;
}

export class CompetitionRegistry {
    private static _competitions: Map<string, Competition> = new Map([
        ['premier-league', { id: 'premier-league', name: 'Premier League', badge: '🦁', description: 'English top-flight football history, records, and derby clashes.', color: '#38003c', questionCount: 25 }],
        ['champions-league', { id: 'champions-league', name: 'Champions League', badge: '⭐', description: 'UEFA Champions League nights, finals, and legendary goals.', color: '#001489', questionCount: 30 }],
        ['world-cup', { id: 'world-cup', name: 'World Cup', badge: '🏆', description: 'FIFA World Cup tournaments, Golden Boot winners, and magic moments.', color: '#8b0000', questionCount: 35 }],
        ['afcon', { id: 'afcon', name: 'African Cup of Nations', badge: '🌍', description: 'AFCON legends, African national teams, and historical victories.', color: '#15803d', questionCount: 20 }],
        ['ethiopian-football', { id: 'ethiopian-football', name: 'Ethiopian Football', badge: '🇪🇹', description: 'Saint George, Ethiopia Bunna, Walia Ibex, and 1962 AFCON glory.', color: '#d97706', questionCount: 40 }],
        ['football-history', { id: 'football-history', name: 'Football History', badge: '📜', description: 'Origin of football rules, iconic matches, and historic milestones.', color: '#475569', questionCount: 20 }],
        ['football-rules', { id: 'football-rules', name: 'Football Rules', badge: '⚽', description: 'Offside rule, VAR regulations, yellow cards, and IFAB laws.', color: '#0284c7', questionCount: 15 }],
        ['legendary-players', { id: 'legendary-players', name: 'Legendary Players', badge: '👟', description: 'Pelé, Maradona, Messi, Ronaldo, Weah, and Ballon d’Or icons.', color: '#ca8a04', questionCount: 30 }],
        ['legendary-clubs', { id: 'legendary-clubs', name: 'Legendary Clubs', badge: '🛡️', description: 'Real Madrid, Barcelona, Man United, Bayern, and Al Ahly.', color: '#7c3aed', questionCount: 25 }],
        ['legendary-stadiums', { id: 'legendary-stadiums', name: 'Legendary Stadiums', badge: '🏟️', description: 'Santiago Bernabéu, Camp Nou, Wembley, San Siro, and Addis Ababa Stadium.', color: '#059669', questionCount: 15 }]
    ]);

    public static getAll(): Competition[] {
        return Array.from(CompetitionRegistry._competitions.values());
    }

    public static getById(id: string): Competition | undefined {
        return CompetitionRegistry._competitions.get(id);
    }

    public static addCompetition(comp: Competition): void {
        CompetitionRegistry._competitions.set(comp.id, comp);
        console.log(`[CompetitionRegistry] Added new competition: ${comp.name}`);
    }

    public static removeCompetition(id: string): boolean {
        return CompetitionRegistry._competitions.delete(id);
    }
}
