// All CV content lives here. Each timeline entry's `bubble` holds the labels shown
// on its bubble; everything else is shown in the detail dialog.

// [hue, tint]
const C = {
  wix: ['#FFD400', '#FFF1A8'], role: ['#FF9E1B', '#FFD9A3'], eme: ['#FF5FA2', '#FFC9DF'],
  shaker: ['#2FD68A', '#BDF2D7'], orckit: ['#5AA9FF', '#CFE5FF'], idf: ['#B58CFF', '#E6D9FF']
};

export const PROFILE = {
  name: 'Amit Davidi',
  headline: 'Motion & Visual-FX Developer · Mobile apps & dev-tools',
  span: 'Curriculum vitae · 2002 — 2026',
  location: 'Israel',
  linkedin: 'https://www.linkedin.com/in/amit-davidi-6684a14/',
};

export const CV = {
  wix: { org: 'Company · 10 yrs 5 mos', title: 'Wix', period: 'Feb 2016 — Jun 2026', c: C.wix,
    bubble: { name: 'Wix', role: '3 major roles', duration: '10 yrs 5 mos',
      years: '2016 — 2026', caption: 'Mobile apps → Detox lead → Visual f/x' },
    blurb: 'Global website-building platform, Tel Aviv. Creator of Detox: the pioneering open-source React Native apps test-automation framework.',
    roles: ['studio', 'detox', 'mobileapps'],
    highlights: [
      'Speaker at the 2023 Wix engineering conference',
      'Core participant in the MindShift Rehabilitation hackathon by the Ichilov innovation lab'
    ],
    featured: ['Leadership'],
    tags: ['Android', 'React Native', 'Test automation', 'Visual effects', 'Animations'] },
  studio: { org: 'Wix', title: 'Wix Design Studio', period: 'Jan 2026 — Jun 2026 · 6 mos', c: C.role, parent: 'wix',
    bubble: { name: 'Design Studio', duration: '6 mos' },
    points: [
        'Directed animation and visual-effects development in Wix’s design studio',
        'Collaborated with animators and designers, turning vision into code'
    ],
    tags: ['CSS Animations', 'Visual effects', 'Shaders'],
    links: [
      { href: 'https://lnkd.in/p/eXQ4izsf', label: 'Aria animations' },
      { href: 'https://lnkd.in/p/eP3PyX34', label: 'Image scan effect', },
    ]
  },
  detox: { org: 'Wix', title: 'Detox Automation Framework', period: 'Jan 2020 — Dec 2025 · 6 yrs', c: C.role, parent: 'wix',
    bubble: { name: 'Detox', duration: '6 yrs' },
    points: [
        'Led the team behind Detox, the company\'s highly popular flagship open-source project: An automation testing framework for React Native apps',
        'Developed high-complexity features and bugs',
        'Innovated the Wix pilot (AI testing) project',
        'Spearheaded the mobile apps test guidelines formalization effort, in a cross-department effort',
    ],
    stats: [{ num: '12k', label: 'GitHub stars' }, { num: '500k+', label: 'downloads per week' }],
    tags: ['Test automation', 'Open source'],
    featured: ['Team lead'],
    links: [
        { href: 'https://wix.github.io/Detox', label: 'Detox' },
        { href: 'https://wix-pilot.com/', label: 'Wix Pilot' },
    ]
  },
  mobileapps: { org: 'Wix', title: 'Mobile apps developer', period: 'Feb 2016 — Dec 2019 · 3 yrs 11 mos', c: C.role, parent: 'wix',
    bubble: { name: 'Mobile apps dev', duration: '3 yrs 11 mos' },
    points: [
        'Android and React Native development across Wix’s mobile apps.',
        'Bootstrapped the react-native-notifications open source project',
    ],
    tags: ['Android', 'React Native'],
    links: [
      { href: 'https://apps.apple.com/us/developer/wix-com-inc/id407141669', label: 'Apple app store'},
      { href: 'https://play.google.com/store/apps/developer?id=Wix.com,+INC.&hl=en', label: 'Google playstore'},
      { href: 'https://github.com/wix/react-native-notifications', label: 'react-native-notifications' },
    ]
  },
  eme: { org: 'everything.me', title: 'Android Developer', period: 'Apr 2014 — Dec 2015 · 1 yr 9 mos', c: C.eme,
    bubble: { name: 'everything.me', roleNote: 'Android Launcher', duration: '1 yr 9 mos',
      years: '2014 — 2015', caption: 'Android' },
    blurb: 'Tel Aviv startup behind a contextual Android launcher, which sported a pioneering, feature-rich in-phone search, and predicted relevant apps by time, location and usage for millions of users.',
    sources: [{ href: 'https://techcrunch.com/?p=953581', label: 'TechCrunch' }],
    points: [
        'Android developer of OS- and low-level features',
        'Developer of UI and app experience features',
    ],
    tags: ['Android'] },
  shaker: { org: 'Scene53', title: 'Back-end Engineer', period: 'Nov 2011 — Jan 2014 · 2 yrs 3 mos', c: C.shaker,
    bubble: { name: 'Scene53', role: 'Shaker', roleNote: ' & Casa Casino', duration: '2 yrs 3 mos',
      years: '2011 — 2014', caption: 'Back-end · Java' },
    blurb: 'Winner of TechCrunch Disrupt SF 2011; Facebook-based 3D virtual social worlds, backed by Menlo Ventures.',
    sources: [{ href: 'https://techcrunch.com/2011/09/14/and-the-winner-of-techcrunch-disrupt-is-shaker', label: 'TechCrunch' }],
    points: ['Back-end Java server developer for a real-time, multi-user social gaming system running virtual 3D environments.',
      'Bootstrapped Casa Casino, the evolution of the Shaker 3D environment.'],
    tags: ['Java', 'Back-end', 'Gaming'] },
  orckit: { org: 'Orckit-Corrigent', title: 'Embedded Systems Engineer', period: 'Oct 2007 — May 2011 · 3 yrs 8 mos', c: C.orckit,
    bubble: { name: 'Orckit-Corrigent', role: 'Software Engineer', duration: '3 yrs 8 mos',
      years: '2007 — 2011', caption: 'Embedded · Telecom' },
    blurb: 'Nasdaq- and TASE-listed vendor of broadband transport network switches for telecom carriers.',
    sources: [{ href: 'https://en.wikipedia.org/wiki/Orckit-Corrigent', label: 'Wikipedia' }],
    points: ['Developed drivers and hardware-supporting applications for embedded real-time broadband networking products'],
    tags: ['Drivers', 'Embedded RT', 'Broadband networking'] },
  idf: { org: 'Israel Defense Forces', title: 'Software Developer', period: '2002 — 2007', c: C.idf,
    bubble: { name: 'IDF', role: 'Embedded RT systems', duration: '~5 yrs',
      years: '2002 — 2007', caption: 'Israel Defense Forces' },
    points: ['Developed embedded real-time cyber systems'],
    tags: ['Drivers', 'Embedded RT', 'Broadband networking', 'Cyber'] },
};

export const EDUCATION = [
  { years: '2005 — 2011', school: 'The Open University of Israel', degree: 'B.A. Computer Science', honors: 'Summa Cum Laude',
    notes: [
      'Graduated with high distinction',
      'Awarded scholarship for Math courses',
      'Completed alongside full-time work in the tech industry',
    ] },
  { years: '2000 — 2002', school: 'Amal-Bet College for Practical Engineers', degree: 'Practical Engineer, Computer Science' },
];

export const SKILLS = [
  { dot: '#FFD400', title: 'Frontend & motion', body: 'UI animation, visual effects (shaders)' },
  { dot: '#FF5FA2', title: 'Mobile', body: 'Android, React Native, mobile app architecture' },
  { dot: '#2FD68A', title: 'Mobile infrastructure', body: 'Developer tools and experience' },
  { dot: '#5AA9FF', title: 'Leadership', body: 'Team lead for 6 years, open-source community stewardship' },
];
