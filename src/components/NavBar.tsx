import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CiLight, CiDark } from 'react-icons/ci';

interface NavBarProps {
  currentPath: string;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentPath, isDark, setIsDark }) => {
  return (
    <nav className="container mx-auto flex justify-between items-center py-6 px-6">
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

      <div className="flex items-center gap-6">
        {[
          { name: 'home', path: '/' },
          { name: 'about', path: '/about' },
          { name: 'listens', path: '/listens' },
          { name: 'reads', path: '/reads' },
          { name: 'unquotes', path: '/unquotes' },
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
    </nav>
  );
};

export default NavBar; 