// Central content configuration for the Wisdom Audi portfolio.
// ONLY verified information lives here. Leave a value as '' or null and the
// interface hides the corresponding element automatically — never invent
// projects, technologies, contact destinations or links.

export const SITE = {
  name: 'Wisdom Audi',
  initials: 'WA',
  role: 'Software Developer',
  nav: [
    { label: 'Home', href: '#home', section: 'home' },
    { label: 'About', href: '#about', section: 'about' },
    { label: 'Projects', href: '#projects', section: 'projects' },
    { label: 'Experience', href: '#experience', section: 'experience' },
    { label: 'Skills', href: '#skills', section: 'experience' },
    { label: 'Contact', href: '#contact', section: 'contact' },
  ],
  contact: {
    // Contact destinations. Fill with real values before publishing;
    // empty strings are hidden automatically.
    email: '',
    github: '',
    linkedin: '',
  },
};

export const HERO = {
  statement: ["I don't just build websites.", 'I build experiences.'],
  cta: { label: 'Explore My World', href: '#about' },
  keywords: ['Ideas', 'Code', 'Products', 'Impact'],
  scrollCue: 'Scroll to enter',
};

export const ABOUT = {
  label: '01 · About me',
  heading: "I'm Wisdom Audi.",
  lead: ['Developer. Problem-solver.', 'Builder of digital experiences.'],
  body:
    "I turn ideas into functional web applications that solve real problems. I'm passionate about clean code, great user experiences, and building products that make a difference.",
  tech: ['React', 'JavaScript', 'TypeScript', 'Python'],
  script: ['Better Code.', 'Better Solutions.'],
};

export const PROJECTS_INTRO = {
  label: '02 · My projects',
  heading: ['Real Problems.', 'Practical Solutions.'],
  body:
    "Here are some of the projects I've built, each solving a real problem with clean code, thoughtful design, and modern technologies.",
};

// Featured work. Only verified projects belong in this list.
// view / source: a real URL shows the action; null hides it.
export const PROJECTS = [
  {
    id: 'lifeguard360',
    title: 'Lifeguard360',
    subtitle: 'Emergency Response & First Aid Assistance System',
    description:
      'A web-based platform providing first-aid guidance across emergency categories and location-based assistance to nearby healthcare facilities.',
    tags: ['React', 'TypeScript', 'Firebase', 'Maps'],
    view: 'https://wisdomvision001.github.io/lifeguard360/',
    source: null,
  },
];

export const EXPERIENCE = {
  label: "03 · Experience",
  heading: "Where I've Grown",
  items: [
    {
      abbr: 'Z',
      company: 'Zonus Global',
      role: 'Web Development Intern',
      dates: '2025 – 2026',
      points: [
        'Worked on web development projects using HTML, CSS, JavaScript and React.',
        'Gained experience in real-world development workflows and team collaboration.',
      ],
    },
    {
      abbr: 'X',
      company: 'Xuple Innovation Hub',
      role: 'Web Development Intern',
      dates: '2026 – Present',
      points: [
        'Contributed to web projects and platform improvements.',
        'Focused on JavaScript, GitHub and continuous learning to build real-world solutions.',
      ],
    },
  ],
};

export const SKILLS = {
  heading: 'My Skills',
  items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Python', 'Flask'],
  aside: ['Always learning.', 'Always building.'],
};

export const CONNECT = {
  label: "04 · Let's connect",
  heading: ['You have seen', 'my world.'],
  body: "Now, let's build something that matters.",
  actions: [
    { label: 'Get In Touch', kind: 'touch' },
    { label: 'View GitHub', kind: 'github' },
  ],
};
