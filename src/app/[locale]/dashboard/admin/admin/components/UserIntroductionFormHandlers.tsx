import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

interface UserIntroductionFormData {
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  left_column_image_url?: string;
  left_column_image_position?: 'above' | 'below';
  right_column_image_url?: string;
  right_column_image_position?: 'above' | 'below';
}

export const useFormHandlers = (
  formData: UserIntroductionFormData,
  setFormData: React.Dispatch<React.SetStateAction<UserIntroductionFormData>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setUploadingLeft: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadingRight: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleImageUpload = async (file: File, column: 'left' | 'right') => {
    if (column === 'left') setUploadingLeft(true);
    else setUploadingRight(true);

    try {
      const supabase = createClient<Database>();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `user-introduction/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('images')
        .createSignedUrl(filePath, 31536000);

      if (signedUrlError) {
        throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
      }

      setFormData((prev) => ({
        ...prev,
        [`${column}_column_image_url`]: signedUrlData.signedUrl,
      }));

    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      if (column === 'left') setUploadingLeft(false);
      else setUploadingRight(false);
    }
  };

  const handleImageDelete = async (column: 'left' | 'right') => {
    try {
      const supabase = createClient<Database>();
      const imageUrl = formData[`${column}_column_image_url` as keyof typeof formData] as string;

      if (imageUrl) {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `user-introduction/${fileName}`;

        const { error: deleteError } = await supabase.storage
          .from('images')
          .remove([filePath]);

        if (deleteError) {
          console.error('Error deleting image from storage:', deleteError);
        }
      }

      setFormData((prev) => ({
        ...prev,
        [`${column}_column_image_url`]: undefined,
      }));

    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  return { handleImageUpload, handleImageDelete };
};