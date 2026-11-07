// All portfolio copy lives here. Anything marked VERIFY should be confirmed before publishing.

export const SITE = {
  name: 'Wisdom Audi',
  role: 'Software Developer',
  heroLines: ["I don't just build websites.", 'I build experiences.'],
  contact: {
    // VERIFY / FILL IN: leave a value empty ('') and its link is hidden automatically.
    email: '',
    linkedin: '',
    github: 'https://github.com/wisdomvision001', // inferred from the Lifeguard360 GitHub Pages address; VERIFY
  },
};

export const ABOUT = {
  heading: "I'm Wisdom Audi.",
  lead: ['Developer. Problem-solver.', 'Builder of digital experiences.'],
  body:
    "I turn ideas into functional web applications that solve real problems. I'm passionate about clean code, great user experiences, and building products that make a difference.",
  tech: ['React', 'JavaScript', 'TypeScript', 'Python'],
  script: ['Better', 'Code,', 'Better', 'Solutions.'],
};

export const PROJECT_INTRO = {
  eyebrow: '02 · MY PROJECTS',
  heading: ['Real Problems.', 'Practical Solutions.'],
  body: "Here are some of the projects I've built, each solving a real problem with clean code, thoughtful design, and modern technologies.",
  cta: 'Explore All Projects',
};

// view / source: set to a real URL to show the button, or null to hide it.
export const PROJECTS = [
  {
    id: 'lifeguard360',
    no: '01',
    title: 'Lifeguard360',
    subtitle: 'Emergency Response & First Aid Assistance System',
    desc: 'A web-based platform providing first-aid guidance across six emergency categories and location-based assistance to nearby healthcare facilities.',
    tags: ['React', 'TypeScript', 'Firebase', 'Leaflet'],
    view: 'https://wisdomvision001.github.io/lifeguard360/',
    source: null,
    keywords: ['First Aid', 'Location', 'Assistance'],
    mock: 'lifeguard',
  },
  {
    id: 'signal',
    no: '02',
    title: 'Signal',
    subtitle: 'Location-Aware Emergency Reporting Application',
    desc: 'An emergency reporting application built around live location: reports carry where help is needed, and status updates follow the responder workflow.',
    tags: ['JavaScript', 'Firebase', 'Leaflet'],
    view: null,
    source: null,
    keywords: ['Report', 'Track', 'Respond'],
    mock: 'signal',
  },
  {
    id: 'kitchen',
    no: '03',
    title: "Wisdom's Kitchen",
    subtitle: 'Restaurant Ordering & Management Application',
    desc: 'A food-ordering web application with a customer menu and checkout flow, plus management views for running the restaurant.',
    tags: ['HTML', 'CSS', 'Python', 'Django'], // reference image said Flask; project notes say Django. VERIFY
    view: null,
    source: null,
    keywords: ['Order', 'Manage', 'Grow'],
    mock: 'kitchen',
  },
  {
    id: 'expense',
    no: '04',
    title: 'Expense Tracker',
    subtitle: 'Personal Finance Management',
    desc: 'A simple and effective tool to track expenses, manage budgets and build better money habits.',
    tags: ['JavaScript', 'Chart.js', 'Local Storage'],
    view: null,
    source: null,
    keywords: ['Track', 'Plan', 'Save'],
    mock: 'expense',
  },
];

export const EXPERIENCE = {
  eyebrow: '03 · EXPERIENCE',
  heading: "Where I've Grown",
  items: [
    {
      logo: 'Z',
      company: 'Zonus Global Concept Limited',
      role: 'Web Development Intern', // VERIFY role title
      dates: '2024 – 2026', // reference image said 2025 – 2026; profile says 2024. VERIFY
      points: [
        'Worked on web development projects using HTML, CSS, JavaScript and React.',
        'Gained experience in real-world development workflows and team collaboration.',
      ],
    },
    {
      logo: 'X',
      company: 'Xuple Innovation Hub',
      role: 'Web Development Intern', // VERIFY role title
      dates: '2026 – Present',
      points: [
        'Contributed to web projects and platform improvements.',
        'Focused on JavaScript, GitHub, and continuous learning to build real-world solutions.',
      ],
    },
  ],
  skillsHeading: 'My Skills',
  skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Python', 'Django'],
  aside: ['Always learning.', 'Always building.'],
};

export const CONNECT = {
  eyebrow: "04 · LET'S CONNECT",
  heading: ['YOU HAVE SEEN', 'MY WORLD.'],
  body: ["Now, let's build something", 'that matters.'],
};
