import {
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

type IconComponent = typeof DocumentIcon;

export function getFileIcon(fileNameOrType: string): IconComponent {
  const extension = fileNameOrType.toLowerCase().split('.').pop() || '';
  const mimeType = fileNameOrType.toLowerCase();

  // Image files
  if (
    ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension) ||
    mimeType.startsWith('image/')
  ) {
    return PhotoIcon;
  }

  // Video files
  if (
    ['mp4', 'webm', 'mov', 'avi'].includes(extension) ||
    mimeType.startsWith('video/')
  ) {
    return VideoCameraIcon;
  }

  // Audio files
  if (
    ['mp3', 'wav', 'ogg'].includes(extension) ||
    mimeType.startsWith('audio/')
  ) {
    return MusicalNoteIcon;
  }

  // Code files
  if (
    [
      'js',
      'ts',
      'jsx',
      'tsx',
      'html',
      'css',
      'json',
      'py',
      'java',
      'cpp',
    ].includes(extension) ||
    mimeType.includes('code') ||
    mimeType.includes('script')
  ) {
    return CodeBracketIcon;
  }

  // Default to document icon
  return DocumentIcon;
}
