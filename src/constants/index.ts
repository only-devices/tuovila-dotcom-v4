export const NAVIGATION_ITEMS = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'listens', path: '/listens' },
  { name: 'reads', path: '/reads' },
  { name: 'blog', path: '/blog' }
] as const;

export const SOCIAL_LINKS = [
  { 
    name: 'LinkedIn',
    icon: 'FaLinkedin', 
    href: 'https://www.linkedin.com/in/etuovila',
    description: 'View my professional experience and connections on LinkedIn 🤝'
  },
  { 
    name: 'GitHub',
    icon: 'FaGithub', 
    href: 'https://www.github.com/only-devices',
    description: 'Check out my code and projects on GitHub 🤓'
  },
  { 
    name: 'Soundcloud',
    icon: 'FaSoundcloud', 
    href: 'https://www.soundcloud.com/only_devices',
    description: 'Listen to my "music" on Soundcloud 🤘'
  },
  { 
    name: 'Last.FM',
    icon: 'FaLastfm', 
    href: 'https://www.last.fm/user/only-devices',
    description: 'I switch streaming platforms a lot, but track everything in Last.FM 🎧'
  },
  { 
    name: 'Hardcover',
    icon: 'FaBook', 
    href: 'https://hardcover.app/@onlydevices',
    description: 'You didn\'t know I can read'
  }
] as const;

export const RANDOM_MESSAGES = [
  "Have a great day! 😊",
  "What do you want to do next? 🤔",
  "Thanks for stopping by! 👋",
  "I got nothing 🤷‍♂️",
  "Feel free to explore! 🔎",
  "Welcome to the best cooking blog on the internet, lol could you imagine"
] as const; 