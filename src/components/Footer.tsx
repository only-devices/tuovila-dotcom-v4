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
      </div>
    </footer>
  );
};

export default Footer; 