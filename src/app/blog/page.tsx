'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CiLight, CiDark } from 'react-icons/ci';
import LoadingSpinner from '@/components/LoadingSpinner';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}

interface BlogPostDetail {
  title: string;
  date: string;
  content: string;
}

export default function BlogPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedPosts, setPreloadedPosts] = useState<Record<string, BlogPostDetail>>({});
  const fullText = "Observations, ramblings, and musings incoming!";

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const preloadPost = useCallback(async (slug: string) => {
    if (preloadedPosts[slug]) return;

    try {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) return;
      
      const data = await response.json();
      setPreloadedPosts(prev => ({
        ...prev,
        [slug]: data.post
      }));
    } catch (error) {
      console.error('Error preloading post:', error);
    }
  }, [preloadedPosts]);

  useEffect(() => {
    fetchPosts();
  }, []);

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
        setShowContent(true);
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
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Image src='/images/icon-192x192.png' alt='eric tuovila' height='32' width='32' />
                </div>
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
                    path === '/blog' ? 'text-blue-400' : ''
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
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <LoadingSpinner size={48} />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      No blog posts yet. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {posts.map((post) => (
                      <motion.article
                        key={post.slug}
                        className={`p-6 rounded-lg ${
                          isDark ? 'bg-slate-800/80 hover:bg-slate-700/80' : 'bg-white hover:bg-gray-50'
                        } transition-colors shadow-lg`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onHoverStart={() => preloadPost(post.slug)}
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                          <p className="text-gray-700 dark:text-gray-100 mb-4">{post.excerpt}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{post.date}</p>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}