// CV content, loaded before the runtime and read by the logic class in Pop.dc.html.
window.CV_DATA = (() => {
  const C = {
    wix: ['#FFD400', '#FFF1A8'], role: ['#FF9E1B', '#FFD9A3'], eme: ['#FF5FA2', '#FFC9DF'],
    shaker: ['#2FD68A', '#BDF2D7'], orckit: ['#5AA9FF', '#CFE5FF'], idf: ['#B58CFF', '#E6D9FF']
  };
  const DATA = {
    wix: { org: 'Company · 10 yrs 5 mos', title: 'Wix', period: 'Feb 2016 — Jun 2026', c: C.wix,
      blurb: 'Global website-building platform, Tel Aviv. Creator of Detox: the pioneering open-source React Native apps test-automation framework.',
      roles: ['studio', 'detox', 'mobileapps'],
      highlights: [
        'Speaker at the 2023 Wix engineering conference',
        'Core participant in the MindShift Rehabilitation hackathon by the Ichilov innovation lab'
      ],
      featured: ['Leadership'],
      tags: ['Android', 'React Native', 'Test automation', 'Visual effects', 'Animations'] },
    studio: { org: 'Wix', title: 'Lead Software Engineer, Wix Design Studio', period: 'Jan 2026 — Jun 2026 · 6 mos', c: C.role, parent: true,
      points: ['Led UI motion and visual-effects development for Wix’s design studio.'],
      tags: ['Animations', 'Visual effects', 'Shaders'] },
    detox: { org: 'Wix', title: 'Team Lead, Detox Automation Framework', period: 'Jan 2020 — Dec 2025 · 6 yrs', c: C.role, parent: true,
      points: [
          'Led the team behind Detox, a gray-box end-to-end testing framework for React Native mobile apps.',
          'Initiated the Wix pilot (AI testing) innovation project.'
      ],
      stats: [{ num: '12k', label: 'GitHub stars' }, { num: '500k+', label: 'downloads per week' }],
      tags: ['Test automation', 'Open source'],
      featured: ['Team lead'],
      href: 'https://github.com/wix/Detox', linkLabel: 'github.com/wix/Detox' },
    mobileapps: { org: 'Wix', title: 'Mobile apps developer', period: 'Feb 2016 — Dec 2019 · 3 yrs 11 mos', c: C.role, parent: true,
      points: ['Android and React Native development across Wix’s mobile apps.'],
      tags: ['Android', 'React Native'] },
    eme: { org: 'everything.me', title: 'Android Engineer', period: 'Apr 2014 — Dec 2015 · 1 yr 9 mos', c: C.eme,
      blurb: 'Tel Aviv startup behind a contextual Android launcher that also powered Firefox Launcher and Firefox OS.',
      srcHref: 'https://techcrunch.com/?p=953581', srcLabel: 'TechCrunch',
      points: ['Developed the everything.me launcher, which sported a pioneering, feature-rich in-phone search, and predicted relevant apps by time, location and usage for millions of users.'],
      tags: ['Android', 'Launcher', 'Search'] },
    shaker: { org: 'Shaker', title: 'Software Engineer', period: 'Nov 2011 — Jan 2014 · 2 yrs 3 mos', c: C.shaker,
      blurb: 'Winner of TechCrunch Disrupt SF 2011; Facebook-based 3D virtual social worlds, backed by Menlo Ventures.',
      srcHref: 'https://techcrunch.com/2011/09/14/and-the-winner-of-techcrunch-disrupt-is-shaker', srcLabel: 'TechCrunch',
      points: ['Back-end Java server developer for a real-time, multi-user social gaming system running virtual 3D environments.',
        'Spearheaded Casa Casino, the evolution of the Shaker 3D environment.'],
      tags: ['Java', 'Back-end', 'Real-time', 'Casa Casino'] },
    orckit: { org: 'Orckit-Corrigent', title: 'Software Engineer', period: 'Oct 2007 — May 2011 · 3 yrs 8 mos', c: C.orckit,
      blurb: 'Nasdaq- and TASE-listed vendor of MPLS / MPLS-TP packet transport network switches for telecom carriers.',
      srcHref: 'https://en.wikipedia.org/wiki/Orckit-Corrigent', srcLabel: 'Wikipedia',
      points: ['Developed drivers and hardware-supporting applications for embedded real-time broadband networking products.'],
      tags: ['Drivers', 'Embedded RT', 'Broadband networking'] },
    idf: { org: 'Israel Defense Forces', title: 'Software Developer, Embedded RT Systems', period: '2002 — 2007', c: C.idf,
      points: ['Developed embedded real-time systems.'],
      tags: ['Embedded', 'Real-time'] }
  };
  return DATA;
})();
