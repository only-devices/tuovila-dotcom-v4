import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CiLight, CiDark } from 'react-icons/ci';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';

interface NavBarProps {
  currentPath: string;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentPath, isDark, setIsDark }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'listens', path: '/listens' },
    { name: 'reads', path: '/reads' },
    //{ name: 'unquotes', path: '/unquotes' },
    { name: 'blog', path: '/blog' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
        {/* Logo */}
        <div className="w-8 h-8">
          <Link href="/">
            <motion.div
              className="block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Image 
                  src='/images/icon-192x192.png' 
                  alt='eric tuovila' 
                  height='32' 
                  width='32'
                  priority={true}
                />
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map(({ name, path }) => (
            <motion.div
              key={path}
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={path}
                className={`hover:text-blue-400 transition-colors ${
                  path === currentPath ? 'text-blue-400' : ''
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

        {/* Mobile Navigation Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <motion.button
            className="p-2 rounded-lg hover:bg-slate-700/20"
            onClick={() => setIsDark(!isDark)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDark ? <CiLight size={24} /> : <CiDark size={24} />}
          </motion.button>
          <motion.button
            className="p-2 rounded-lg hover:bg-slate-700/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <IoClose size={24} /> : <RxHamburgerMenu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-lg lg:hidden overflow-hidden"
            >
              <div className="max-w-[1100px] mx-auto py-2 px-4">
                {navItems.map(({ name, path }) => (
                  <motion.div
                    key={path}
                    className="relative"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={path}
                      className={`block py-3 hover:text-blue-400 transition-colors ${
                        path === currentPath ? 'text-blue-400' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar; 