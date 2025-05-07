import { Document } from '@/types/document';
import { Database } from '@/types/supabase';

// Define a type for the document data coming from the database
type DatabaseDocument = Database['public']['Tables']['documents']['Row'];

/**
 * Converts database document data to the Document type
 * Handles missing fields by providing default values
 */
export function convertToDocument(dbDocument: DatabaseDocument): Document {
  // Convert null values to undefined for optional string fields
  // Ensure required fields have default values
  return {
    id: dbDocument.id,
    title: dbDocument.title,
    description: dbDocument.description || undefined,
    category: dbDocument.category,
    // Required fields with defaults for missing values
    file_name: dbDocument.title || '', // Use title as fallback
    file_type: dbDocument.file_type || 'unknown', // Required - provide default
    file_size: dbDocument.file_size || 0, // Required - provide default
    file_path: dbDocument.content_url || '', // Required - provide default
    // Optional fields - convert null to undefined
    file_url: dbDocument.content_url || undefined,
    created_at: dbDocument.created_at,
    updated_at: dbDocument.updated_at || dbDocument.created_at, // Use created_at as fallback
    created_by: dbDocument.author_id || '', // Required - provide default
    created_by_name: dbDocument.author_name || undefined,
    author_name: dbDocument.author_name || undefined,
    content_url: dbDocument.content_url || undefined,
    region: dbDocument.region || undefined,
    language: dbDocument.language || undefined,
  };
}

/**
 * Converts an array of database documents to Document type
 */
export function convertToDocuments(
  dbDocuments: DatabaseDocument[],
): Document[] {
  if (!dbDocuments || !Array.isArray(dbDocuments)) {
    return [];
  }
  return dbDocuments.map(convertToDocument);
}
