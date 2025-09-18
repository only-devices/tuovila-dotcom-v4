'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import PageLayout from '@/components/PageLayout';

interface Book {
  title: string;
  author: string;
  coverUrl: string;
  hardcoverUrl: string;
  rating: number;
  dateRead: string;
}

export default function ReadsPage() {
  const [typewriterText, setTypewriterText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const fullText = "Here's my past 12 months, in book form.";
  const currentPath = usePathname();

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/hardcover');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data.books);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch books');
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
    fetchBooks();
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
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <div className="text-center py-8">Loading books...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error: {error}</p>
            <button
              onClick={() => {
                setIsLoading(true);
                setError(null);
                fetchBooks();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
            {books.map((book) => (
              <motion.a
                key={`${book.title}-${book.dateRead}`}
                href={book.hardcoverUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-lg group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={(e) => {
                  setHoveredBook(`${book.title}-${book.dateRead}`);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({
                    x: rect.left - 30,
                    y: rect.top - 10
                  });
                }}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <div className="relative aspect-[2/3] mb-4 rounded-md overflow-hidden">
                  <Image
                    src={book.coverUrl}
                    alt={`${book.title} cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                
                {book.rating > 0 && (
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < book.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{book.dateRead}</p>
              </motion.a>
            ))}
            
            {/* Tooltip rendered outside of individual cards */}
            <AnimatePresence>
              {hoveredBook && (
                <motion.div
                  className="fixed px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-sm pointer-events-none z-[9999] max-w-sm shadow-xl"
                  style={{
                    bottom: `${window.innerHeight - tooltipPosition.y}px`,
                    left: `${tooltipPosition.x}px`
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <p>
                      <span className="font-semibold">
                        {books.find(book => `${book.title}-${book.dateRead}` === hoveredBook)?.title}
                      </span>
                      {' '}
                      <span className="text-slate-300">
                        by {books.find(book => `${book.title}-${book.dateRead}` === hoveredBook)?.author}
                      </span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </PageLayout>
  );
} 