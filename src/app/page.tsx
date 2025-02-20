'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaSoundcloud, FaBook, FaLastfm } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { Quicksand } from 'next/font/google';
import { usePathname } from 'next/navigation';
import PageLayout from '@/components/PageLayout';

const quicksand = Quicksand({ 
  subsets: ['latin'],
});

const Tuovila = () => {
  const [typewriterText, setTypewriterText] = useState('');
  const [showSocials, setShowSocials] = useState(false);
  const [description, setDescription] = useState('');
  const fullText = "Whale hello there! I'm Eric. Welcome to my site.";
  const currentPath = usePathname();
  
  const randomMessages = useMemo(() => [
    "Have a nice day! 😊",
    "What do you want to do next? 🤔",
    "Thanks for stopping by, San Diego! 👋",
    "Pretend I just said something funny",
    "Feel free to explore! 🔎",
    "Welcome to the best cooking blog on the internet, lol could you imagine"
  ], []);

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
        {typewriterText}
        <motion.span 
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >|</motion.span>
      </h2>
      
      <motion.p
        className={`text-xl mt-4 h-8 ${quicksand.className} font-light tracking-wide opacity-85`}
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
                description: 'You didn\'t know I can read'
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
