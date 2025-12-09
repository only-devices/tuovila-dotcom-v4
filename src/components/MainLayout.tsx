'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import NavBar from './NavBar';
import Footer from './Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const darkMode = localStorage.getItem('darkMode');
        const isDarkClass = document.documentElement.classList.contains('dark');
        setIsDark(darkMode === 'true' || isDarkClass);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('darkMode', isDark.toString());
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [isDark, mounted]);

    return (
        <div className="min-h-screen transition-colors duration-300 font-sans bg-gradient-to-br from-slate-100 to-white text-slate-900 dark:from-slate-900 dark:to-slate-800 dark:text-white">
            <div className="flex flex-col min-h-screen">
                <NavBar
                    currentPath={pathname}
                    isDark={isDark}
                    setIsDark={setIsDark}
                />

                <main className="flex-1 pt-16">
                    <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
                        <motion.div
                            key={pathname}
                            className="max-w-3xl mx-auto mt-8 sm:mt-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
