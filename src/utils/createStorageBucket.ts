
import { supabase } from "../lib/supabase";

export const ensureAvatarsBucketExists = async () => {
  try {
    // Check if the avatars bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
    
    // If the bucket doesn't exist, create it
    if (!avatarBucketExists) {
      const { data, error } = await supabase.storage.createBucket('avatars', {
        public: true // Make it publicly accessible
      });
      
      if (error) {
        console.error('Error creating avatars bucket:', error);
        return false;
      }
      
      console.log('Avatars bucket created successfully');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring avatars bucket exists:', error);
    return false;
  }
};
