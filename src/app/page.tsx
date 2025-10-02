// app/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaSoundcloud, FaBook, FaLastfm } from 'react-icons/fa';
// Quicksand font is now loaded globally in RootLayout
import { usePathname } from 'next/navigation';
import PageLayout from '@/components/PageLayout';

  // font classes are applied globally in RootLayout

// Define our greeting interfaces
interface Greeting {
  language: string;
  text: string;
  region: string;
  romanization?: string;
}

// Our greetings data
const greetings: Greeting[] = [
  // East Asian Languages
  { language: 'Japanese', text: 'こんにちは', romanization: 'Konnichiwa', region: 'Japan' },
  { language: 'Japanese (Casual)', text: 'やあ', romanization: 'Yaa', region: 'Japan' },
  { language: 'Korean', text: '안녕하세요', romanization: 'Annyeonghaseyo', region: 'Korea' },
  { language: 'Korean (Casual)', text: '안녕', romanization: 'Annyeong', region: 'Korea' },
  { language: 'Mandarin Chinese', text: '你好', romanization: 'Nǐ hǎo', region: 'China' },
  { language: 'Cantonese', text: '喂', romanization: 'Wai', region: 'Hong Kong/Southern China' },
  { language: 'Taiwanese Hokkien', text: '逐家好', romanization: 'Tak-ke-ho', region: 'Taiwan' },

  // South Asian Languages
  { language: 'Hindi', text: 'नमस्ते', romanization: 'Namaste', region: 'India' },
  { language: 'Bengali', text: 'নমস্কার', romanization: 'Nomoshkar', region: 'Bengal Region' },
  { language: 'Tamil', text: 'வணக்கம்', romanization: 'Vanakkam', region: 'Tamil Nadu & Sri Lanka' },
  { language: 'Telugu', text: 'నమస్కారం', romanization: 'Namaskaram', region: 'Andhra Pradesh & Telangana' },
  { language: 'Nepali', text: 'नमस्कार', romanization: 'Namaskār', region: 'Nepal' },

  // Southeast Asian Languages
  { language: 'Thai', text: 'สวัสดี', romanization: 'Sawadee', region: 'Thailand' },
  { language: 'Vietnamese', text: 'Xin chào', region: 'Vietnam' },
  { language: 'Indonesian', text: 'Selamat pagi', region: 'Indonesia' },
  { language: 'Tagalog', text: 'Kumusta', region: 'Philippines' },
  { language: 'Burmese', text: 'မင်္ဂလာပါ', romanization: 'Mingalarbar', region: 'Myanmar' },

  // Middle Eastern Languages
  { language: 'Arabic (Formal)', text: 'السَّلامُ عَلَيْكُم', romanization: 'As-salaam-alaikum', region: 'Arab World' },
  { language: 'Arabic (Casual)', text: 'مرحبا', romanization: 'Marhaba', region: 'Arab World' },
  { language: 'Persian', text: 'سلام', romanization: 'Salaam', region: 'Iran' },
  { language: 'Hebrew', text: 'שָׁלוֹם', romanization: 'Shalom', region: 'Israel' },
  { language: 'Turkish', text: 'Merhaba', region: 'Turkey' },

  // European Languages
  { language: 'English', text: 'Hello', region: 'Global' },
  { language: 'Spanish', text: '¡Hola!', region: 'Spanish-speaking World' },
  { language: 'French', text: 'Bonjour', region: 'Francophone Countries' },
  { language: 'German', text: 'Hallo', region: 'Germanic Countries' },
  { language: 'Italian', text: 'Ciao', region: 'Italy' },
  { language: 'Portuguese', text: 'Olá', region: 'Portuguese-speaking World' },
  { language: 'Russian', text: 'Здравствуйте', romanization: 'Zdravstvuyte', region: 'Russia' },
  { language: 'Russian (Casual)', text: 'Привет', romanization: 'Privet', region: 'Russia' },
  { language: 'Greek', text: 'Γεια σας', romanization: 'Yia sas', region: 'Greece' },
  { language: 'Polish', text: 'Dzień dobry', region: 'Poland' },
  { language: 'Czech', text: 'Dobrý den', region: 'Czech Republic' },
  { language: 'Hungarian', text: 'Szia', region: 'Hungary' },
  { language: 'Romanian', text: 'Bună ziua', region: 'Romania' },
  { language: 'Dutch', text: 'Hoi', region: 'Netherlands' },
  { language: 'Swedish', text: 'Hej', region: 'Sweden' },
  { language: 'Finnish', text: 'Hei', region: 'Finland' },
  { language: 'Norwegian', text: 'Hei', region: 'Norway' },
  { language: 'Danish', text: 'Hej', region: 'Denmark' },
  { language: 'Icelandic', text: 'Halló', region: 'Iceland' },

  // African Languages
  { language: 'Swahili', text: 'Jambo', region: 'East Africa' },
  { language: 'Yoruba', text: 'Ẹ nlẹ́', romanization: 'E nle', region: 'Nigeria' },
  { language: 'Zulu', text: 'Sawubona', region: 'South Africa' },
  { language: 'Amharic', text: 'ሰላም', romanization: 'Selam', region: 'Ethiopia' },
  { language: 'Hausa', text: 'Sannu', region: 'West Africa' },

  // Indigenous Languages
  { language: 'Hawaiian', text: 'Aloha', region: 'Hawaii' },
  { language: 'Maori', text: 'Kia ora', region: 'New Zealand' },
  { language: 'Cherokee', text: 'ᎣᏏᏲ', romanization: 'Osiyo', region: 'Southeastern United States' },
  { language: 'Quechua', text: 'Rimaykullayki', region: 'Andean Region' }
];

// Helper function to get a random greeting
const getRandomGreeting = (): Greeting => {
  return greetings[Math.floor(Math.random() * greetings.length)];
};

const Tuovila = () => {
  const [typewriterText, setTypewriterText] = useState('');
  const [showSocials, setShowSocials] = useState(false);
  const [description, setDescription] = useState('');
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fullText = " I'm Eric. Welcome to my site.";
  const currentPath = usePathname();

  const randomMessages = useMemo(() => [
    "Have a nice day! 😊",
    "What do you want to do next? 🤔",
    "Thanks for stopping by, San Diego! 👋",
    "Pretend I just said something funny",
    "Feel free to explore! 🔎",
    "Welcome to the best cooking blog on the internet, lol could you imagine"
  ], []);

  // Effect to handle initial greeting selection
  useEffect(() => {
    setGreeting(getRandomGreeting());
  }, []);

  useEffect(() => {
    let i = 0;
    const typewriter = setInterval(() => {
      if (i < fullText.length) {
        setTypewriterText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typewriter);
        setShowSocials(true);
        setDescription(randomMessages[Math.floor(Math.random() * randomMessages.length)]);
      }
    }, 50);

    return () => clearInterval(typewriter);
  }, [randomMessages]);

  return (
    <PageLayout currentPath={currentPath}>
      <h2 className="text-5xl font-bold mb-6">
        <motion.span 
          className="highlight"
          key={description}
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 0.3, yoyo: Infinity }}
        >
        </motion.span>
        
        {/* Greeting with tooltip */}
        {greeting && (
          <motion.span
            className="relative inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.span 
              className="cursor-help inline-block text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              whileHover={{ scale: 1.05 }}
            >
              {greeting.text},
            </motion.span>

            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute -top-20 left-0 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-base whitespace-nowrap pointer-events-none z-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Language and region information */}
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">
                      {greeting.language}
                      {greeting.romanization && (
                        <span className="text-sm text-slate-300 ml-2">
                          /{greeting.romanization}/
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-slate-300">
                      {greeting.region}
                    </span>
                  </div>
                  
                  {/* Tooltip arrow - positioned relative to the text */}
                  <div className="absolute -bottom-1 left-4 transform -translate-x-1/2 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.span>
        )}
        
        {/* Typewriter text */}
        {typewriterText}
        
        {/* Cursor */}
        <motion.span 
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >|</motion.span>
      </h2>

      <motion.p
        className={`text-xl mt-8 h-8 font-light tracking-wide opacity-85`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        key={description}
      >
        {description}
      </motion.p>

      <AnimatePresence>
        {showSocials && (
          <motion.div
            className="flex gap-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[
              {
                icon: FaLinkedin,
                href: 'https://www.linkedin.com/in/etuovila',
                alt: 'LinkedIn',
                description: 'View my professional experience and connections on LinkedIn 🤝'
              },
              {
                icon: FaGithub,
                href: 'https://www.github.com/only-devices',
                alt: 'GitHub',
                description: 'Check out my code and projects on GitHub 🤓'
              },
              {
                icon: FaSoundcloud,
                href: 'https://www.soundcloud.com/only_devices',
                alt: 'Soundcloud',
                description: 'Listen to my "music" on Soundcloud 🤘'
              },
              {
                icon: FaLastfm,
                href: 'https://www.last.fm/user/only-devices',
                alt: 'Last.FM',
                description: 'I switch streaming platforms a lot, but track everything in Last.FM 🎧'
              },
              {
                icon: FaBook,
                href: 'https://hardcover.app/@onlydevices',
                alt: 'Hardcover',
                description: 'I bet you didn\'t know I could read'
              }
            ].map(({ icon: Icon, href, description: hoverDescription }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg flex items-center gap-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setDescription(hoverDescription)}
                onMouseLeave={() => {
                  const newMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
                  if (newMessage !== description) {
                    setDescription(newMessage);
                  } else {
                    const remainingMessages = randomMessages.filter(msg => msg !== description);
                    setDescription(remainingMessages[Math.floor(Math.random() * remainingMessages.length)]);
                  }
                }}
              >
                <Icon size={24} className="text-slate-900 dark:text-slate-100" />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Tuovila;
