'use client';

import React from 'react';
import Link from 'next/link'; // Import Link
import { FolderIcon as HeroFolderIcon } from '@heroicons/react/24/outline'; // Renamed to avoid conflict

interface FolderComponentProps {
  basePath: string; // Add basePath for dynamic linking
  categoryName: string;
  // Remove onClick and isSelected as navigation handles this
}

export function FolderComponent({ basePath, categoryName }: FolderComponentProps) {
  // Encode categoryName for URL safety
  const encodedCategoryName = encodeURIComponent(categoryName);
  const href = `${basePath}/folders/${encodedCategoryName}`;

  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-start pt-6 pb-2 px-2 border border-blue-100 rounded-lg text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full h-36 sm:h-40 bg-blue-50 text-blue-800 hover:bg-blue-100 hover:border-blue-200 hover:shadow-sm active:bg-blue-200"
    >
      <HeroFolderIcon className="h-16 w-16 sm:h-20 sm:w-20 mb-2 text-blue-400 group-hover:text-blue-500 transition-colors" />
      <span className="text-sm font-medium break-words w-full px-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {categoryName}
      </span>
    </Link>
  );
}