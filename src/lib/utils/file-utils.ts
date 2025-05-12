/**
 * Extract file extension from MIME type or file name
 */
export const getFileExtension = (
  fileType: string | null,
  fileName: string | null,
): string => {
  if (!fileType && !fileName) return '';

  // Try to extract from fileName first
  if (fileName) {
    const nameParts = fileName.split('.');
    if (nameParts.length > 1) {
      return nameParts.pop()?.toLowerCase() || '';
    }
  }

  // If we have a MIME type, extract from it
  if (fileType) {
    // Normalize to lowercase for consistent processing
    const normalizedType = fileType.toLowerCase();

    // Handle common MIME types
    if (normalizedType.includes('pdf')) return 'pdf';
    if (normalizedType.includes('word') || normalizedType.includes('doc'))
      return 'doc';
    if (normalizedType.includes('excel') || normalizedType.includes('sheet'))
      return 'xls';
    if (
      normalizedType.includes('powerpoint') ||
      normalizedType.includes('presentation')
    )
      return 'ppt';
    if (normalizedType.includes('image/jpeg') || normalizedType.includes('jpg'))
      return 'jpg';
    if (normalizedType.includes('image/png')) return 'png';
    if (normalizedType.includes('text/plain')) return 'txt';

    // Extract subtype after slash
    const parts = normalizedType.split('/');
    if (parts.length > 1) {
      return parts[1];
    }
  }

  return '';
};

/**
 * Determine if the file type can be displayed in an iframe
 */
export const canDisplayInIframe = (
  fileType: string | null,
  fileExtension: string,
): boolean => {
  if (!fileType) return false;

  // Normalize the file type
  const normalizedType = fileType.toLowerCase();

  // Check if it's a PDF (various ways it might be represented)
  if (
    normalizedType === 'pdf' ||
    normalizedType === 'application/pdf' ||
    normalizedType.includes('pdf')
  ) {
    return true;
  }

  // Directly supported types that can be rendered in an iframe
  const directlySupportedTypes = [
    'pdf',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'svg',
    'html',
    'txt',
  ];

  // Microsoft Office formats that can be viewed via Office Online Viewer
  const officeFormats = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

  // Check against our extracted extension
  return (
    directlySupportedTypes.includes(fileExtension) ||
    officeFormats.includes(fileExtension) ||
    directlySupportedTypes.includes(normalizedType) ||
    officeFormats.includes(normalizedType)
  );
};

/**
 * Get the appropriate URL for displaying in iframe based on file type
 */
export const getIframeUrl = (
  fileUrl: string,
  fileType: string,
  fileName: string | null,
): string => {
  const lowerFileType = fileType.toLowerCase();
  const extension = getFileExtension(lowerFileType, fileName);

  // Microsoft Office formats should be viewed via Office Online Viewer
  const officeFormats = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

  if (
    officeFormats.includes(lowerFileType) ||
    officeFormats.includes(extension)
  ) {
    // Use Microsoft Office Online Viewer
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      fileUrl,
    )}`;
  }

  // Try Google Docs viewer as a fallback for other supported formats
  const googleSupportedFormats = [
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
  ];
  if (
    googleSupportedFormats.includes(lowerFileType) ||
    googleSupportedFormats.includes(extension)
  ) {
    // Use Google Docs Viewer as a fallback option
    return `https://docs.google.com/viewer?url=${encodeURIComponent(
      fileUrl,
    )}&embedded=true`;
  }

  // For all other supported formats, use the direct URL
  return fileUrl;
};

/**
 * Determine if this is a PDF
 */
export const isPdf = (
  fileType: string | null,
  fileName: string | null,
  fileExtension: string,
): boolean => {
  if (!fileType && !fileName) return false;

  // Check various ways a PDF might be represented
  if (fileType?.toLowerCase().includes('pdf')) return true;
  if (fileExtension === 'pdf') return true;
  if (fileName?.toLowerCase().endsWith('.pdf')) return true;

  return false;
};

/**
 * Get appropriate file type description
 */
export const getFileTypeDescription = (fileType: string | null): string => {
  if (!fileType) return 'Unknown';

  const lowerType = fileType.toLowerCase();

  // Return more descriptive names for common file types
  const fileTypeNames: Record<string, string> = {
    pdf: 'PDF Document',
    doc: 'Word Document',
    docx: 'Word Document',
    xls: 'Excel Spreadsheet',
    xlsx: 'Excel Spreadsheet',
    ppt: 'PowerPoint Presentation',
    pptx: 'PowerPoint Presentation',
    txt: 'Text Document',
    jpg: 'JPEG Image',
    jpeg: 'JPEG Image',
    png: 'PNG Image',
    gif: 'GIF Image',
    svg: 'SVG Image',
    pages: 'Apple Pages Document',
    numbers: 'Apple Numbers Spreadsheet',
    keynote: 'Apple Keynote Presentation',
  };

  return fileTypeNames[lowerType] || fileType.toUpperCase();
};
