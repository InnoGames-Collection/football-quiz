export const GameModes = [
    {
        id: 'world-cup',
        name: 'World Cup',
        baseColor: 'rgba(18, 97, 160, 0.2)',
        glowColor: 'rgba(255, 213, 79, 0.4)',
        accent: '#FFD54F',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#wc-grad)"/><path d="M32 12c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 36c-8.8 0-16-7.2-16-16S23.2 16 32 16s16 7.2 16 16-7.2 16-16 16z" fill="#FFD54F" opacity="0.9"/><path d="M22 32c0 5.5 4.5 10 10 10s10-4.5 10-10" stroke="#FFD54F" stroke-width="2"/><circle cx="32" cy="32" r="4" fill="#FFD54F"/><defs><linearGradient id="wc-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#1261A0"/><stop offset="1" stop-color="#0A3659"/></linearGradient></defs></svg>`
    },
    {
        id: 'champions-league',
        name: 'Champions Lg',
        baseColor: 'rgba(23, 78, 166, 0.2)',
        glowColor: 'rgba(54, 217, 255, 0.4)',
        accent: '#36D9FF',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#cl-grad)"/><polygon points="32 10 38 24 53 26 42 36 45 51 32 44 19 51 22 36 11 26 26 24" fill="#36D9FF" opacity="0.9"/><polygon points="32 20 35 28 44 29 37 34 39 43 32 39 25 43 27 34 20 29 29 28" fill="#174EA6"/><defs><linearGradient id="cl-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#174EA6"/><stop offset="1" stop-color="#0B254D"/></linearGradient></defs></svg>`
    },
    {
        id: 'caf-champions',
        name: 'CAF Champions',
        baseColor: 'rgba(8, 116, 67, 0.2)',
        glowColor: 'rgba(255, 213, 79, 0.4)',
        accent: '#FFD54F',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#caf-grad)"/><path d="M22 18h20v6c0 8-5 14-10 14s-10-6-10-14v-6z" fill="#FFD54F"/><path d="M28 38v10h8V38" fill="#FFD54F"/><path d="M24 48h16v4H24z" fill="#FFD54F"/><circle cx="32" cy="24" r="4" fill="#087443"/><defs><linearGradient id="caf-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#087443"/><stop offset="1" stop-color="#043A21"/></linearGradient></defs></svg>`
    },
    {
        id: 'afcon',
        name: 'AFCON',
        baseColor: 'rgba(0, 140, 90, 0.2)',
        glowColor: 'rgba(245, 197, 66, 0.4)',
        accent: '#F5C542',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#afcon-grad)"/><path d="M16 20c0 12 10 20 16 26 6-6 16-14 16-26s-16-10-16-10-16-2-16 10z" fill="#F5C542" opacity="0.9"/><circle cx="32" cy="24" r="6" fill="#008C5A"/><defs><linearGradient id="afcon-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#008C5A"/><stop offset="1" stop-color="#00462D"/></linearGradient></defs></svg>`
    },
    {
        id: 'ethiopian-premier',
        name: 'Ethio League',
        baseColor: 'rgba(11, 143, 77, 0.2)',
        glowColor: 'rgba(244, 196, 48, 0.4)',
        accent: '#F4C430',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#eth-grad)"/><polygon points="32 12 36 26 50 26 38 34 42 48 32 40 22 48 26 34 14 26 28 26" fill="#F4C430" stroke="#D62828" stroke-width="2"/><defs><linearGradient id="eth-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#0B8F4D"/><stop offset="1" stop-color="#054726"/></linearGradient></defs></svg>`
    },
    {
        id: 'walia-ibex',
        name: 'Walia Ibex',
        baseColor: 'rgba(36, 92, 69, 0.2)',
        glowColor: 'rgba(217, 164, 65, 0.4)',
        accent: '#D9A441',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#walia-grad)"/><path d="M32 14c-12 0-20 18-10 32C10 30 20 14 32 14z" fill="#D9A441"/><path d="M32 14c12 0 20 18 10 32C54 30 44 14 32 14z" fill="#D9A441"/><circle cx="32" cy="38" r="8" fill="#D9A441"/><defs><linearGradient id="walia-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#245C45"/><stop offset="1" stop-color="#122E22"/></linearGradient></defs></svg>`
    },
    {
        id: 'premier-league',
        name: 'Premier League',
        baseColor: 'rgba(167, 25, 48, 0.2)',
        glowColor: 'rgba(255, 213, 79, 0.4)',
        accent: '#FFD54F',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#epl-grad)"/><path d="M16 42C16 28 24 16 32 16s16 12 16 26H16z" fill="#FFFFFF"/><circle cx="32" cy="32" r="6" fill="#A71930"/><rect x="20" y="10" width="24" height="6" fill="#FFD54F"/><defs><linearGradient id="epl-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#A71930"/><stop offset="1" stop-color="#530C18"/></linearGradient></defs></svg>`
    },
    {
        id: 'la-liga',
        name: 'La Liga',
        baseColor: 'rgba(198, 40, 40, 0.2)',
        glowColor: 'rgba(255, 138, 0, 0.4)',
        accent: '#FF8A00',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#lal-grad)"/><circle cx="32" cy="32" r="14" fill="#FFFFFF"/><circle cx="32" cy="32" r="10" fill="#FF8A00"/><circle cx="32" cy="32" r="6" fill="#C62828"/><defs><linearGradient id="lal-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#C62828"/><stop offset="1" stop-color="#631414"/></linearGradient></defs></svg>`
    },
    {
        id: 'serie-a',
        name: 'Serie A',
        baseColor: 'rgba(0, 77, 152, 0.2)',
        glowColor: 'rgba(255, 255, 255, 0.4)',
        accent: '#FFFFFF',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#seriea-grad)"/><polygon points="32 14 16 46 48 46" fill="#FFFFFF"/><polygon points="32 20 22 42 42 42" fill="#004D98"/><polygon points="32 26 28 38 36 38" fill="#EF4444"/><defs><linearGradient id="seriea-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#004D98"/><stop offset="1" stop-color="#00264C"/></linearGradient></defs></svg>`
    },
    {
        id: 'bundesliga',
        name: 'Bundesliga',
        baseColor: 'rgba(204, 0, 0, 0.2)',
        glowColor: 'rgba(255, 213, 79, 0.4)',
        accent: '#FFD54F',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#bl-grad)"/><rect x="22" y="16" width="20" height="32" rx="4" fill="#FFFFFF"/><circle cx="32" cy="24" r="6" fill="#CC0000"/><path d="M26 36h12v6H26z" fill="#CC0000"/><defs><linearGradient id="bl-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#CC0000"/><stop offset="1" stop-color="#660000"/></linearGradient></defs></svg>`
    },
    {
        id: 'legendary-players',
        name: 'Legends',
        baseColor: 'rgba(156, 124, 56, 0.2)',
        glowColor: 'rgba(255, 213, 79, 0.4)',
        accent: '#FFD54F',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#lg-grad)"/><path d="M32 14l5 12 13 1-10 9 3 13-11-7-11 7 3-13-10-9 13-1z" fill="#FFD54F"/><defs><linearGradient id="lg-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#9C7C38"/><stop offset="1" stop-color="#4E3E1C"/></linearGradient></defs></svg>`
    },
    {
        id: 'football-rules',
        name: 'Rules & Refs',
        baseColor: 'rgba(51, 51, 51, 0.2)',
        glowColor: 'rgba(239, 68, 68, 0.4)',
        accent: '#EF4444',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#rr-grad)"/><rect x="18" y="18" width="12" height="18" fill="#FFD54F" stroke="#FFFFFF" stroke-width="2" transform="rotate(-15 24 27)"/><rect x="34" y="24" width="12" height="18" fill="#EF4444" stroke="#FFFFFF" stroke-width="2" transform="rotate(15 40 33)"/><defs><linearGradient id="rr-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#333333"/><stop offset="1" stop-color="#111111"/></linearGradient></defs></svg>`
    },
    {
        id: 'transfer-market',
        name: 'Transfers',
        baseColor: 'rgba(0, 150, 136, 0.2)',
        glowColor: 'rgba(0, 255, 170, 0.4)',
        accent: '#00FFAA',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#tm-grad)"/><path d="M22 28h20v8H22z" fill="#00FFAA"/><path d="M42 22l8 10-8 10v-20z" fill="#00FFAA"/><path d="M42 36H22v-8h20z" fill="#FFFFFF" opacity="0.3"/><path d="M22 42l-8-10 8-10v20z" fill="#00FFAA"/><defs><linearGradient id="tm-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#009688"/><stop offset="1" stop-color="#004A43"/></linearGradient></defs></svg>`
    },
    {
        id: 'stadiums',
        name: 'Stadiums',
        baseColor: 'rgba(84, 110, 122, 0.2)',
        glowColor: 'rgba(144, 202, 249, 0.4)',
        accent: '#90CAF9',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#st-grad)"/><ellipse cx="32" cy="32" rx="16" ry="10" fill="#90CAF9" opacity="0.9"/><ellipse cx="32" cy="32" rx="10" ry="6" fill="#546E7A"/><circle cx="32" cy="32" r="2" fill="#FFFFFF"/><defs><linearGradient id="st-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#546E7A"/><stop offset="1" stop-color="#2A373D"/></linearGradient></defs></svg>`
    },
    {
        id: 'football-history',
        name: 'History',
        baseColor: 'rgba(121, 85, 72, 0.2)',
        glowColor: 'rgba(215, 204, 200, 0.4)',
        accent: '#D7CCC8',
        svg: `<svg width="100%" height="100%" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="url(#hist-grad)"/><rect x="18" y="16" width="28" height="32" rx="2" fill="#D7CCC8"/><line x1="24" y1="24" x2="40" y2="24" stroke="#795548" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="32" x2="40" y2="32" stroke="#795548" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="40" x2="34" y2="40" stroke="#795548" stroke-width="2" stroke-linecap="round"/><defs><linearGradient id="hist-grad" x1="4" y1="4" x2="60" y2="60"><stop stop-color="#795548"/><stop offset="1" stop-color="#3C2A24"/></linearGradient></defs></svg>`
    }
];
