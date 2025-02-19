import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  text: string;
  onComplete?: () => void;
  speed?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  onComplete, 
  speed = 50 
}) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const typewriter = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typewriter);
        onComplete?.();
      }
    }, speed);
    
    return () => clearInterval(typewriter);
  }, [text, speed, onComplete]);

  return (
    <h2 className="text-5xl font-bold mb-6">
      {displayText}
      <motion.span 
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >|</motion.span>
    </h2>
  );
};

export default Typewriter; 