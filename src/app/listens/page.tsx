'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LastFmWidget from '@/components/LastFmWidget';
import { usePathname } from 'next/navigation';
import PageLayout from '@/components/PageLayout';

export default function ListensPage() {
  const [typewriterText, setTypewriterText] = useState('');
  const [showWidget, setShowWidget] = useState(false);
  const fullText = "Here's what I'm listening to:";
  const currentPath = usePathname();

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
    <PageLayout currentPath={currentPath}>
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
    </PageLayout>
  );
} 