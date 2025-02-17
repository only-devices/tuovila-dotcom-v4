'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaSoundcloud, FaBook } from 'react-icons/fa';
import { CiLight, CiDark } from 'react-icons/ci';

const Tuovila = () => {
  const [isDark, setIsDark] = useState(true);
  const [typewriterText, setTypewriterText] = useState('');
  const [showSocials, setShowSocials] = useState(false);
  const fullText = "Hey there! I'm Eric. Welcome to my site.";
  
  useEffect(() => {
    let i = 0;
    const typewriter = setInterval(() => {
      if (i < fullText.length) {
        setTypewriterText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typewriter);
        setShowSocials(true);
      }
    }, 50);
    
    return () => clearInterval(typewriter);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white' : 
      'bg-gradient-to-br from-slate-100 to-white text-slate-900'
    }`}>
      <nav className="p-6 flex justify-between items-center font-light tracking-wide">
        <motion.a
          href="/"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="block w-8 h-8"
        >
          <img src='images/icon-192x192.png' alt='eric tuovila' height='32px' width='32px' />
        </motion.a>
        
        <div className="flex items-center gap-6">
          {['about', 'projects', 'contact'].map((item) => (
            <motion.a
              key={item}
              href={`#${item}`}
              className="relative hover:text-blue-400 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.a>
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

      <main className="container mx-auto px-6 py-24">
        <motion.div 
          className="max-w-2xl"
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
          
          <AnimatePresence>
            {showSocials && (
              <motion.div 
              className="flex gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
                {[
                  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/etuovila', alt: 'LinkedIn' },
                  { icon: FaGithub, href: 'https://www.github.com/only-devices', alt: 'GitHub' },
                  { icon: FaSoundcloud, href: 'https://www.soundcloud.com/only_devices', alt: 'Soundcloud' },
                  { icon: FaBook, href: 'https://hardcover.app/@onlydevices', alt: 'Hardcover' }
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
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default Tuovila;
