'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LastFmWidget from '@/components/LastFmWidget';
import Link from 'next/link';
import Image from 'next/image';
import { CiLight, CiDark } from 'react-icons/ci';

export default function ListensPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [showWidget, setShowWidget] = useState(false);
  const fullText = "Here's what I've been listening to lately:";

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
        setShowWidget(true);
      }
    }, 50);
    
    return () => clearInterval(typewriter);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      !mounted ? 'invisible' : 'visible'} ${
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
              { name: 'home', path: '/' },
              { name: 'about', path: '/about' },
              { name: 'listens', path: '/listens' },
              { name: 'reads', path: '/reads' },
              { name: 'blog', path: '/blog' }
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
                    path === '/listens' ? 'text-blue-400' : ''
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
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: showWidget ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <LastFmWidget />
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
} 