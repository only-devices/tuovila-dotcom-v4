import React from 'react';
import { FaRegCopyright } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="container mx-auto py-6 px-6 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          <FaRegCopyright size={14} />
          <span>2025 eric tuovila</span>
        </div>
        <span className="text-gray-400 dark:text-gray-600">•</span>
        <div>
          made mostly by{' '}
          <a 
            href="https://cursor.sh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Cursor
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 