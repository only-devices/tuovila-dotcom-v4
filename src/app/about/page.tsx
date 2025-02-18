'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CiLight, CiDark } from 'react-icons/ci';
import { FaGithub, FaLinkedin, FaSoundcloud, FaBook } from 'react-icons/fa';
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({ 
  subsets: ['latin'],
});

export default function AboutPage() {
  const [isDark, setIsDark] = useState(true);
  const [typewriterText, setTypewriterText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const fullText = "I'm Eric! Welcome to my personal site.";
  const content = "I'm a full-time husband and dad who spends his days working in the SaaS world of Support, Implementation, and Customer Success. I'm passionate about finding creative solutions and better ways to work. In my free time I'm maintaining my home and vehicles, exploring things I can self-host with Docker, and playing with Legos or a guitar. I've also been known to dabble in karaoke.";

  useEffect(() => {
    let i = 0;
    const typewriter = setInterval(() => {
      if (i < fullText.length) {
        setTypewriterText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typewriter);
        setShowContent(true);
      }
    }, 50);
    
    return () => clearInterval(typewriter);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white' : 
      'bg-gradient-to-br from-slate-100 to-white text-slate-900'
    }`}>
      <div className="flex flex-col min-h-screen">
        <nav className="container mx-auto flex justify-between items-center py-6 px-6">
          <div className="w-8 h-8">
            <Link href="/">
              <motion.div
                className="block"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src='/images/icon-192x192.png' alt='eric tuovila' height='32' width='32' />
              </motion.div>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {[
              { name: 'about', path: '/about' },
              { name: 'listens', path: '/listens' },
              { name: 'contact', path: '/contact' }
            ].map(({ name, path }) => (
              <motion.div
                key={path}
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={path}
                  className={`hover:text-blue-400 transition-colors ${
                    path === '/about' ? 'text-blue-400' : ''
                  }`}
                >
                  {name}
                </Link>
              </motion.div>
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
                className={`text-xl mt-4 ${quicksand.className} font-light tracking-wide opacity-85`}
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {content}
              </motion.p>

              <motion.div 
                className="flex gap-4 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {[
                  { 
                    icon: FaLinkedin, 
                    href: 'https://www.linkedin.com/in/etuovila'
                  },
                  { 
                    icon: FaGithub, 
                    href: 'https://www.github.com/only-devices'
                  },
                  { 
                    icon: FaSoundcloud, 
                    href: 'https://www.soundcloud.com/only_devices'
                  },
                  { 
                    icon: FaBook, 
                    href: 'https://hardcover.app/@onlydevices'
                  }
                ].map(({ icon: Icon, href }) => (
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
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
} 