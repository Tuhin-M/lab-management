import { supabase } from '../lib/supabase';

export const storageService = {
    /**
     * Upload an image to a Supabase Storage bucket
     * @param bucket Name of the bucket
     * @param path Path within the bucket
     * @param file File object to upload
     */
    uploadImage: async (bucket: string, path: string, file: File) => {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },

    /**
     * Delete an image from a Supabase Storage bucket
     * @param bucket Name of the bucket
     * @param path Path within the bucket
     */
    deleteImage: async (bucket: string, path: string) => {
        try {
            const { error } = await supabase.storage
                .from(bucket)
                .remove([path]);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }
};
