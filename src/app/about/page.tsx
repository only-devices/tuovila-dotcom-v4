'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaSoundcloud, FaBook, FaLastfm } from 'react-icons/fa';
import { Quicksand } from 'next/font/google';
import { usePathname } from 'next/navigation';
import PageLayout from '@/components/PageLayout';

const quicksand = Quicksand({ 
  subsets: ['latin'],
});

export default function AboutPage() {
  const [typewriterText, setTypewriterText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const fullText = "Hey again! 👋";
  const content = "I'm a full-time husband and dad who spends his days working in the SaaS world of Support, Implementation, and Customer Success. I'm passionate about finding creative solutions and better ways to work. In my free time I'm maintaining my home and vehicles, exploring things I can self-host with Docker, and playing with Legos or a guitar. I've also been known to dabble in karaoke.";
  const currentPath = usePathname();

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
    <PageLayout currentPath={currentPath}>
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
            icon: FaLastfm, 
            href: 'https://www.last.fm/user/only-devices'
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
            className="p-4 rounded-lg flex items-center gap-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon size={24} className="text-slate-900 dark:text-slate-100" />
          </motion.a>
        ))}
      </motion.div>
    </PageLayout>
  );
} 