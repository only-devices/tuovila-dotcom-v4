'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CiLight, CiDark } from 'react-icons/ci';
import ReactMarkdown from 'react-markdown';
import { Quicksand } from 'next/font/google';
import { useParams } from 'next/navigation';

const quicksand = Quicksand({ 
  subsets: ['latin'],
});

interface BlogPost {
  title: string;
  date: string;
  content: string;
}

export default function BlogPostPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const routeParams = useParams();
  const slug = routeParams.slug as string;

  const fetchPost = useCallback(async () => {
    try {
      console.log('Fetching post for slug:', slug);
      setIsLoading(true);
      setError(null);
      setPost(null);

      const response = await fetch(`/api/blog/${slug}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch post');
      }

      const data = await response.json();
      console.log('Received post data:', data);
      
      if (!data.post) {
        console.error('No post data in response:', data);
        throw new Error('Post data not found in response');
      }

      if (!data.post.content) {
        console.error('No content in post data:', data.post);
        throw new Error('Post content not found');
      }

      setPost(data.post);
      setError(null);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch post');
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

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
    if (mounted) {
      fetchPost();
    }
  }, [fetchPost, mounted]);

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
              {isLoading ? (
                <div className="text-center py-8">Loading post...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>Error: {error}</p>
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      setError(null);
                      fetchPost();
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : post ? (
                <>
                  <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
                  <p className={`text-gray-700 dark:text-gray-300 mb-8 ${quicksand.className}`}>
                    {post.date}
                  </p>
                  <div className={`prose dark:prose-invert prose-gray dark:prose-gray max-w-none ${quicksand.className}`}>
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Post not found
                  </p>
                  <Link
                    href="/blog"
                    className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Back to Blog
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
} 