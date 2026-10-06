const C = {
  wix: ['#FFD400', '#FFF1A8'], role: ['#FF9E1B', '#FFD9A3'], eme: ['#FF5FA2', '#FFC9DF'],
  shaker: ['#2FD68A', '#BDF2D7'], orckit: ['#5AA9FF', '#CFE5FF'], idf: ['#B58CFF', '#E6D9FF']
};

window.CV_INTRO = `Accomplished software engineer with <strong>20+ years</strong> of cross-domain experience in <strong>UI motion &amp; visual effects</strong>, mobile development tools, <strong>Android</strong>, <strong>React Native</strong>, real-time backend and embedded systems.<br>
Spent more than ten years at <strong>Wix</strong>, leading <a href="https://wix.github.io/Detox" target="_blank" rel="noopener" style="font-weight: 700">Detox</a>: the company’s flagship open-source project. Most recently directed UI motion &amp; visual effects initiatives within Wix’s Design Studio.`;

window.CV_DATA = {
  wix: { org: 'Company · 10 yrs 5 mos', title: 'Wix', period: 'Feb 2016 — Jun 2026', c: C.wix,
    blurb: 'Global website-building platform, Tel Aviv. Creator of Detox: the pioneering open-source React Native apps test-automation framework.',
    roles: ['studio', 'detox', 'mobileapps'],
    highlights: [
      'Speaker at the 2023 Wix engineering conference',
      'Core participant in the MindShift Rehabilitation hackathon by the Ichilov innovation lab'
    ],
    featured: ['Leadership'],
    tags: ['Android', 'React Native', 'Test automation', 'Visual effects', 'Animations'] },
  studio: { org: 'Wix', title: 'Wix Design Studio', period: 'Jan 2026 — Jun 2026 · 6 mos', c: C.role, parent: true,
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
  detox: { org: 'Wix', title: 'Detox Automation Framework', period: 'Jan 2020 — Dec 2025 · 6 yrs', c: C.role, parent: true,
    points: [
        'Led the team behind Detox, the company\'s highly popular flagship open-source project: An automation testing framework for React Native apps',
        'Developed high-complexity features and bugs',
        'Innovated the Wix pilot (AI testing) project',
        'Spearheaded and led the mobile apps test guidelines formalization effort, in a cross-department effort',
    ],
    stats: [{ num: '12k', label: 'GitHub stars' }, { num: '500k+', label: 'downloads per week' }],
    tags: ['Test automation', 'Open source'],
    featured: ['Team lead'],
    links: [
        { href: 'https://wix.github.io/Detox', label: 'Detox' },
        { href: 'https://wix-pilot.com/', label: 'Wix Pilot' },
    ]
  },
  mobileapps: { org: 'Wix', title: 'Mobile apps developer', period: 'Feb 2016 — Dec 2019 · 3 yrs 11 mos', c: C.role, parent: true,
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
    blurb: 'Tel Aviv startup behind a contextual Android launcher, which sported a pioneering, feature-rich in-phone search, and predicted relevant apps by time, location and usage for millions of users.',
    sources: [{ href: 'https://techcrunch.com/?p=953581', label: 'TechCrunch' }],
    points: [
        'Android developer of OS- and low-level features',
        'Developer of UI and app experience features',
    ],
    tags: ['Android'] },
  shaker: { org: 'Scene53', title: 'Back-end Engineer', period: 'Nov 2011 — Jan 2014 · 2 yrs 3 mos', c: C.shaker,
    blurb: 'Winner of TechCrunch Disrupt SF 2011; Facebook-based 3D virtual social worlds, backed by Menlo Ventures.',
    sources: [{ href: 'https://techcrunch.com/2011/09/14/and-the-winner-of-techcrunch-disrupt-is-shaker', label: 'TechCrunch' }],
    points: ['Back-end Java server developer for a real-time, multi-user social gaming system running virtual 3D environments.',
      'Bootstrapped Casa Casino, the evolution of the Shaker 3D environment.'],
    tags: ['Java', 'Back-end', 'Gaming'] },
  orckit: { org: 'Orckit-Corrigent', title: 'Embedded Systems Engineer', period: 'Oct 2007 — May 2011 · 3 yrs 8 mos', c: C.orckit,
    blurb: 'Nasdaq- and TASE-listed vendor of broadband transport network switches for telecom carriers.',
    sources: [{ href: 'https://en.wikipedia.org/wiki/Orckit-Corrigent', label: 'Wikipedia' }],
    points: ['Developed drivers and hardware-supporting applications for embedded real-time broadband networking products'],
    tags: ['Drivers', 'Embedded RT', 'Broadband networking'] },
  idf: { org: 'Israel Defense Forces', title: 'Software Developer', period: '2002 — 2007', c: C.idf,
    points: ['Developed embedded real-time cyber systems'],
    tags: ['Drivers', 'Embedded RT', 'Broadband networking', 'Cyber'] },
};
