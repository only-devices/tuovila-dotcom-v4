'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LastFmWidget from '@/components/LastFmWidget';
import TopArtistsWidget from '@/components/TopArtistsWidget';
import TopTracksWidget from '@/components/TopTracksWidget';
import { usePathname } from 'next/navigation';
import PageLayout from '@/components/PageLayout';

export default function ListensPage() {
  const [typewriterText, setTypewriterText] = useState('');
  const [showWidgets, setShowWidgets] = useState(false);
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
        setShowWidgets(true);
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
        className="mt-12 space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: showWidgets ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Recent Tracks - Main Widget */}
        <div className="w-full">
          <LastFmWidget />
        </div>

        {/* Top Artists and Tracks Grid */}
        <div className="grid grid-cols-1 gap-6">

          {/* Monthly Stats */}
          <div className="space-y-4">
            <TopArtistsWidget 
              period="1month" 
              title="Top Artists - Past 30 Days" 
            />
            <TopTracksWidget 
              period="1month" 
              title="Top Tracks - Past 30 Days" 
            />
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
}