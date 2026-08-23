/**
 * Optimizes Cloudinary and remote image URLs with auto-format, auto-quality, and max width
 * @param {string} url - Original image URL
 * @param {number} width - Requested width limit
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (url, width = 600) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/upload/f_auto')) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }
  return url;
};
