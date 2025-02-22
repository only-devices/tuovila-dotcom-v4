'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Quicksand } from 'next/font/google';
import PageLayout from '@/components/PageLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { logError, logDebug } from '@/utils/logger';


const quicksand = Quicksand({ 
  subsets: ['latin'],
});

interface Quote {
  id: number;
  content: string;
  author_id: number;
  source: string;
}

interface Author {
  id: number;
  name: string;
}

function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export default function UnquotesPage() {
  const [typewriterText, setTypewriterText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [correctAuthor, setCorrectAuthor] = useState<Author | null>(null);
  const [incorrectAuthor, setIncorrectAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const fullText = "Did they really say that? ... maybe";
  const currentPath = usePathname();

  const fetchQuoteAndAuthors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch a random quote
      const quoteResponse = await fetch('/api/unquotes/random');
      if (!quoteResponse.ok) {
        throw new Error('Failed to fetch quote');
      }
      const quoteData = await quoteResponse.json();
      logDebug('Received quote data:', {quoteData});
      
      if (!quoteData.quote || !quoteData.quote.author_id) {
        logError('Invalid quote data received:', quoteData);
        throw new Error('Invalid quote data');
      }
      
      setQuote(quoteData.quote);
      logDebug('Set quote state:', quoteData.quote);
      logDebug('Attempting to fetch author with ID:', quoteData.quote.author_id);

      // Fetch the correct author
      const correctAuthorResponse = await fetch(`/api/authors/${quoteData.quote.author_id}`);
      if (!correctAuthorResponse.ok) {
        throw new Error('Failed to fetch correct author');
      }
      const correctAuthorData = await correctAuthorResponse.json();
      setCorrectAuthor(correctAuthorData.author);

      // Fetch a random different author
      const incorrectAuthorResponse = await fetch(`/api/authors/random?exclude=${quoteData.quote.author_id}`);
      if (!incorrectAuthorResponse.ok) {
        throw new Error('Failed to fetch incorrect author');
      }
      const incorrectAuthorData = await incorrectAuthorResponse.json();
      setIncorrectAuthor(incorrectAuthorData.author);

    } catch (error) {
      logError('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    if (showContent) {
      fetchQuoteAndAuthors();
    }
  }, [showContent]);

  const QuoteContent = ({ quote, correctAuthor, incorrectAuthor }: { 
    quote: Quote; 
    correctAuthor: Author; 
    incorrectAuthor: Author; 
  }) => (
    <motion.div
      className={`p-8 rounded-lg bg-white dark:bg-slate-800/80 shadow-lg cursor-pointer ${quicksand.className} hover:shadow-xl transition-shadow`}
      onHoverStart={() => !isRevealed && setIsRevealed(true)}
      whileHover={{ scale: 1.02 }}
    >
      <p className="text-xl italic mb-4">&quot;{quote.content}&quot;</p>
      <div className="relative">
        <motion.div
          className="absolute inset-0 flex justify-end items-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: isRevealed ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-right text-gray-600 dark:text-gray-400">
            — {incorrectAuthor.name}
          </p>
        </motion.div>

        <motion.div 
          className="relative flex justify-end items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isRevealed ? 1 : 0,
            scale: isRevealed ? 1 : 0.8,
          }}
          transition={{ 
            duration: 0.5,
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-lg -m-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: isRevealed ? [0, 1, 0] : 0,
              scale: isRevealed ? [0.5, 1.2, 1.5] : 0.5,
            }}
            transition={{ 
              duration: 1,
              repeat: isRevealed ? 2 : 0,
            }}
          />
          <p className="relative text-right font-bold text-blue-600 dark:text-blue-400">
            — {correctAuthor.name}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

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
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size={48} />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading quote...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error: {error}</p>
            <button
              onClick={() => fetchQuoteAndAuthors()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : quote && correctAuthor && incorrectAuthor ? (
          isValidUrl(quote.source) ? (
            <a 
              href={quote.source}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <QuoteContent 
                quote={quote}
                correctAuthor={correctAuthor}
                incorrectAuthor={incorrectAuthor}
              />
            </a>
          ) : (
            <QuoteContent 
              quote={quote}
              correctAuthor={correctAuthor}
              incorrectAuthor={incorrectAuthor}
            />
          )
        ) : null}
      </motion.div>
    </PageLayout>
  );
} 