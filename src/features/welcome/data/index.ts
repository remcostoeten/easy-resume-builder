
const FEATURES = [
    {
        id: 'live-preview',
        icon: '👁️',
        title: 'Live Preview',
        description: 'See your resume update in real-time',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'pro-templates',
        icon: '🎨',
        title: 'Pro Templates',
        description: 'Industry-specific layouts',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        id: 'export-pdf',
        icon: '⬇️',
        title: 'Export PDF',
        description: 'Download instantly',
        gradient: 'from-emerald-500 to-teal-500',
    },
    {
        id: 'ats-optimized',
        icon: '⚡',
        title: 'ATS Optimized',
        description: 'Beat tracking systems',
        gradient: 'from-amber-500 to-orange-500',
    },
] as const;

const TIPS = [
    'Start with personal info and work backwards chronologically',
    'Use action verbs and quantify achievements',
    'Keep to 1-2 pages for maximum impact',
    'Tailor skills to match job descriptions',
] as const;

const BADGES = [
    { icon: '✨', text: '100% Free', color: 'primary' },
    { icon: '🛡️', text: 'Privacy First', color: 'secondary' },
    { icon: '👥', text: '500K+ Users', color: 'emerald' },
] as const;


export { FEATURES, TIPS, BADGES };
