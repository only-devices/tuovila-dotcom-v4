'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageLayout from '@/components/PageLayout';
import { logError } from '@/utils/logger';


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
  const [typewriterText, setTypewriterText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedPosts, setPreloadedPosts] = useState<Record<string, BlogPostDetail>>({});
  const fullText = "Observations, ramblings, and musings incoming!";
  const currentPath = usePathname();

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
      logError('Error fetching posts:', error);
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
      logError('Error preloading post:', error);
    }
  }, [preloadedPosts]);

  useEffect(() => {
    fetchPosts();
  }, []);

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
          <div className="py-8">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <motion.article
                key={post.slug}
                className="p-6 rounded-lg bg-white dark:bg-slate-800/80 hover:bg-gray-50 dark:hover:bg-slate-700/80 transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => preloadPost(post.slug)}
              >
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{post.date}</p>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>
    </PageLayout>
  );
}