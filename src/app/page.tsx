'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaSoundcloud, FaBook, FaLastfm } from 'react-icons/fa';
import { CiLight, CiDark } from 'react-icons/ci';
import Image from 'next/image';
import Link from 'next/link';
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({ 
  subsets: ['latin'],
});

const Tuovila = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [showSocials, setShowSocials] = useState(false);
  const [description, setDescription] = useState('');
  const fullText = "Hey there! I'm Eric. Welcome to my site.";
  
  const randomMessages = useMemo(() => [
    "Have a great day! 😊",
    "What do you want to do next? 🤔",
    "Thanks for stopping by! 👋",
    "Coffee? Tea? Code? ☕",
    "Feel free to explore! 🚀",
    "Plot twist: this is actually a cooking blog... just kidding! 😄"
  ], []);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    setIsDark(darkMode === 'true');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('darkMode', isDark.toString());
    }
  }, [isDark, mounted]);

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
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      !mounted ? 'invisible' : 'visible'} ${
      isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white' : 
      'bg-gradient-to-br from-slate-100 to-white text-slate-900'
    }`}>
      <div className="flex flex-col min-h-screen">
        <nav className="container mx-auto flex justify-between items-center py-6 px-6">
          <div className="w-8 h-8">
            <motion.a
              href="/"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image src='/images/icon-192x192.png' alt='eric tuovila' height='32' width='32' />
            </motion.a>
          </div>

          <div className="flex items-center gap-6">
            {[
              { name: 'home', path: '/' },
              { name: 'about', path: '/about' },
              { name: 'listens', path: '/listens' },
              { name: 'reads', path: '/reads' },
              { name: 'blog', path: '/blog' }
            ].map(({ name, path }) => (
              <Link key={path} href={path} passHref>
                <motion.div
                  className={`relative hover:text-blue-400 transition-colors ${
                    path === '/' ? 'text-blue-400' : ''
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {name}
                </motion.div>
              </Link>
            ))}
            <motion.button
              className="p-2 rounded-lg hover:bg-slate-700/20 ml-2"
              onClick={() => setIsDark(!isDark)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDark ? <CiLight size={24} /> : <CiDark size={24} />}
            </motion.button>
          </div>
        </nav>

        <main className="flex-1">
          <div className="container mx-auto px-6">
            <motion.div 
              className="max-w-2xl mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
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
                        description: 'View my professional experience and connections on LinkedIn'
                      },
                      { 
                        icon: FaGithub, 
                        href: 'https://www.github.com/only-devices', 
                        alt: 'GitHub',
                        description: 'Check out my code and projects on GitHub'
                      },
                      { 
                        icon: FaSoundcloud, 
                        href: 'https://www.soundcloud.com/only_devices', 
                        alt: 'Soundcloud',
                        description: 'Listen to my music on SoundCloud'
                      },
                      { 
                        icon: FaLastfm, 
                        href: 'https://www.last.fm/user/only-devices', 
                        alt: 'Last.FM',
                        description: 'See what I\'ve been listening to on Last.FM'
                      },
                      { 
                        icon: FaBook, 
                        href: 'https://hardcover.app/@onlydevices', 
                        alt: 'Hardcover',
                        description: 'Check out what I\'ve been reading on Hardcover'
                      }
                    ].map(({ icon: Icon, href, description: hoverDescription }) => (
                      <motion.a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-4 rounded-lg flex items-center gap-3 ${
                          isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                        } transition-colors`}
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
                        <Icon size={24} />
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tuovila;
