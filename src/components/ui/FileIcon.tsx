'use client';

import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileCode,
  File,
  FileArchive,
  Video,
  Music
} from 'lucide-react';

interface FileIconProps {
  fileType?: string;
  size?: number;
  className?: string;
}

// Map file extensions directly to icon types
const fileTypeToIconMap: { [key: string]: string } = {
  pdf: 'pdf',
  doc: 'word',
  docx: 'word',
  xls: 'excel',
  xlsx: 'excel',
  ppt: 'powerpoint',
  pptx: 'powerpoint',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  svg: 'image',
  webp: 'image',
  mp4: 'video',
  mov: 'video',
  avi: 'video',
  webm: 'video',
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  js: 'code',
  ts: 'code',
  jsx: 'code',
  tsx: 'code',
  html: 'code',
  css: 'code',
  json: 'code',
  // Add more mappings as needed
};

export function FileIcon({ fileType, size = 24, className = '' }: FileIconProps) {
  const typeLower = fileType?.toLowerCase() || '';
  const iconType = fileTypeToIconMap[typeLower] || 'document'; // Default to 'document'

  const iconColor = getIconColor(iconType);
  const props = { size, className: `${iconColor} ${className}` };

  switch (iconType) {
    case 'pdf':
      return <File {...props} />; // Using generic File for PDF now
    case 'word':
      return <FileText {...props} />;
    case 'excel':
      return <FileSpreadsheet {...props} />;
    case 'powerpoint':
      return <FileText {...props} />; // Using FileText for PPT too
    case 'image':
      return <ImageIcon {...props} />;
    case 'video':
      return <Video {...props} />;
    case 'audio':
      return <Music {...props} />;
    case 'archive':
      return <FileArchive {...props} />;
    case 'code':
      return <FileCode {...props} />;
    default: // 'document' or any other unmapped type
      return <File {...props} />;
  }
}

function getIconColor(iconType: string): string {
  switch (iconType) {
    case 'pdf':
      return 'text-red-600';
    case 'word':
      return 'text-blue-600';
    case 'excel':
      return 'text-green-600';
    case 'powerpoint':
      return 'text-orange-600';
    case 'image':
      return 'text-purple-600';
    case 'video':
      return 'text-pink-600';
    case 'audio':
      return 'text-indigo-600';
    case 'archive':
      return 'text-yellow-600';
    case 'code':
      return 'text-gray-600';
    default:
      return 'text-gray-500';
  }
}