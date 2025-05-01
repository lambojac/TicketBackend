// Add these helper functions to your codebase

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null if not found
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // Extract path from URL
    const urlPath = new URL(url).pathname;
    
    // Sample URL: https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/users/profile/abcdef.jpg
    // We need to extract "users/profile/abcdef"
    
    // Find the 'upload/' part in the path
    const uploadIndex = urlPath.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload/v1234567890/'
    let publicId = urlPath.substring(uploadIndex + '/upload/'.length);
    
    // Remove version number if present (v1234567890/)
    if (publicId.match(/^v\d+\//)) {
      publicId = publicId.replace(/^v\d+\//, '');
    }
    
    // Remove file extension
    publicId = publicId.replace(/\.\w+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

/**
 * Delete image from Cloudinary by public ID
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise} - Result of the deletion
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    // Make sure your cloudinary is configured elsewhere in your application
    // This is just the deletion function
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    // Don't throw error to prevent breaking the flow of the application
    return null;
  }
};