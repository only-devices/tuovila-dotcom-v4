'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Quicksand } from 'next/font/google';
import { useParams, usePathname } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageLayout from '@/components/PageLayout';
import { logError } from '@/utils/logger';


const quicksand = Quicksand({ 
  subsets: ['latin'],
});

interface BlogPost {
  title: string;
  date: string;
  content: string;
}

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const routeParams = useParams();
  const slug = routeParams.slug as string;
  const currentPath = usePathname();

  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPost(null);

      const response = await fetch(`/api/blog/${slug}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch post');
      }

      const data = await response.json();
      
      if (!data.post) {
        throw new Error('Post data not found in response');
      }

      if (!data.post.content) {
        throw new Error('Post content not found');
      }

      setPost(data.post);
      setError(null);
    } catch (error) {
      logError('Error fetching post:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch post');
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return (
    <PageLayout currentPath={currentPath}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
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
          <p className={`text-gray-700 dark:text-gray-100 mb-8 ${quicksand.className}`}>
            {post.date}
          </p>
          <div className={`prose dark:prose-invert prose-slate max-w-none ${quicksand.className} 
            prose-p:text-gray-700 prose-p:dark:text-gray-100
            prose-headings:text-slate-900 prose-headings:dark:text-gray-100
            prose-strong:text-gray-700 prose-strong:dark:text-gray-100
            prose-em:text-gray-700 prose-em:dark:text-gray-100
            prose-li:text-gray-700 prose-li:dark:text-gray-100
            prose-code:text-gray-700 prose-code:dark:text-gray-100
            prose-blockquote:text-gray-700 prose-blockquote:dark:text-gray-100
            prose-a:text-blue-600 prose-a:dark:text-blue-300
            hover:prose-a:text-blue-500 hover:prose-a:dark:text-blue-200
            prose-pre:dark:bg-slate-800/80
            prose-pre:text-gray-700 prose-pre:dark:text-gray-100
            prose-code:bg-gray-100 prose-code:dark:bg-slate-800/50
            prose-blockquote:border-gray-300 prose-blockquote:dark:border-gray-600
            prose-hr:border-gray-300 prose-hr:dark:border-gray-600
            prose-th:text-gray-700 prose-th:dark:text-gray-100
            prose-td:text-gray-700 prose-td:dark:text-gray-100`}>
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
    </PageLayout>
  );
} 