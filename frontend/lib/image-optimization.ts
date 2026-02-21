/**
 * Image Optimization Utilities and Best Practices
 * 
 * This file provides utilities and documentation for optimal image usage in the application.
 * All images should use Next.js Image component for automatic optimization.
 */

import { ImageProps } from 'next/image';

/**
 * Image optimization sizes for different breakpoints
 * Used in the 'sizes' attribute for responsive images
 */
export const IMAGE_SIZES = {
  // Hero/Banner images
  hero: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px',
  
  // Product thumbnails
  productThumb: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw',
  
  // Product detail/gallery
  productDetail: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px',
  
  // Avatar/Profile images
  avatar: '(max-width: 640px) 40px, (max-width: 1024px) 48px, 64px',
  
  // Small icons/thumbnails
  icon: '(max-width: 640px) 24px, 32px',
  
  // Blog/Post images
  post: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px',
  
  // Background/Cover images
  cover: '100vw',
};

/**
 * Device sizes for optimization
 * Next.js will generate images for these widths
 */
export const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/**
 * Default image sizes for optimization
 */
export const IMAGE_DEFAULT_SIZES = [16, 32, 48, 64, 96, 128, 256, 384];

/**
 * Image quality settings for different contexts
 */
export const IMAGE_QUALITY = {
  low: 60,      // For small thumbnails
  medium: 75,   // For most images
  high: 85,     // For hero/detailed images
  maximum: 95,  // For critical images
};

/**
 * Placeholder blur data URLs for LQIP (Low Quality Image Placeholder)
 * Using blur effect while image loads for better perceived performance
 */
export const BLUR_PLACEHOLDERS = {
  // Light gray - good for e-commerce
  default: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3C/svg%3E',
  
  // Dark for dark theme
  dark: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%231f2937" width="400" height="400"/%3E%3C/svg%3E',
};

/**
 * Image optimization recommendations by use case
 */
export const IMAGE_OPTIMIZATION_GUIDE = {
  productImages: {
    description: 'Product listing and detail images',
    format: 'WebP/AVIF',
    quality: IMAGE_QUALITY.high,
    sizes: IMAGE_SIZES.productDetail,
    loader: 'default', // Use Next.js default or Cloudinary
    responsive: true,
    priority: false, // Lazy load unless above the fold
  },
  
  avatarImages: {
    description: 'User profile and comment avatars',
    format: 'WebP',
    quality: IMAGE_QUALITY.medium,
    sizes: IMAGE_SIZES.avatar,
    width: 64,
    height: 64,
    responsive: false, // Fixed size
    priority: false,
  },
  
  heroImages: {
    description: 'Hero banner and featured images',
    format: 'AVIF/WebP',
    quality: IMAGE_QUALITY.maximum,
    sizes: IMAGE_SIZES.hero,
    responsive: true,
    priority: true, // Load immediately (LCP candidate)
  },
  
  testimonialAvatars: {
    description: 'Testimonial profile images',
    format: 'WebP',
    quality: IMAGE_QUALITY.medium,
    width: 70,
    height: 70,
    responsive: false,
    priority: false,
  },
};

/**
 * Common image optimization patterns
 */
export const ImageOptimizationPatterns = {
  /**
   * Pattern 1: Responsive Product Image with Loading Skeleton
   * @example
   * <Image
   *   src={product.imageUrl}
   *   alt={product.name}
   *   fill
   *   sizes={IMAGE_SIZES.productThumb}
   *   className="object-cover"
   *   placeholder="blur"
   *   priority={isAboveTheFold}
   * />
   */
  responsiveProduct: 'See example in ProductCard.tsx',

  /**
   * Pattern 2: Fixed-Size Avatar with Error Handling
   * @example
   * <Image
   *   src={user.avatar}
   *   alt={user.name}
   *   width={64}
   *   height={64}
   *   className="rounded-full"
   *   onError={(e) => {
   *     e.currentTarget.src = '/default-avatar.svg';
   *   }}
   * />
   */
  fixedAvatar: 'Use for profile images that need consistent sizing',

  /**
   * Pattern 3: Dynamic Cloudinary Images
   * @example
   * const cloudinaryLoader = (props) => {
   *   return `https://res.cloudinary.com/dezla74jz/image/fetch/c_scale,w_${props.width}/${props.src}`;
   * };
   * 
   * <Image
   *   loader={cloudinaryLoader}
   *   src={externalImageUrl}
   *   width={400}
   *   height={300}
   *   alt="External image"
   * />
   */
  cloudinaryOptimized: 'For external/user-uploaded images',
};

/**
 * Remote image patterns configuration (from next.config.mjs)
 * These are allowed sources for external images
 */
export const ALLOWED_IMAGE_SOURCES = [
  'images.unsplash.com',     // Unsplash (testimonial avatars)
  'res.cloudinary.com',      // Cloudinary (user uploads)
  'static.nike.com',         // Nike (product examples)
  'th.bing.com',            // Bing images
  'm.media-amazon.com',      // Amazon
  'via.placeholder.com',     // Placeholder service
];

/**
 * Performance metrics after optimization
 */
export const PERFORMANCE_IMPROVEMENTS = {
  description: 'Expected improvements from Next.js Image optimization',
  metrics: [
    'WebP/AVIF format reduces image size by 20-35%',
    'Automatic responsive sizing reduces bandwidth for mobile by 40-60%',
    'Lazy loading prevents loading off-screen images',
    'Priority attribute ensures LCP images load first',
    'Blur placeholder improves perceived performance',
    'Proper caching (1 year TTL) reduces server requests',
  ],
};

/**
 * Best Practices Checklist
 * 
 * ✅ Use <Image> component from next/image for all images
 * ✅ Use 'sizes' attribute with responsive values
 * ✅ Set width/height for fixed-size images
 * ✅ Use 'fill' with container position:relative for dynamic sizes
 * ✅ Add 'priority' to above-the-fold images
 * ✅ Use 'placeholder="blur"' for better perceived performance
 * ✅ Configure remote patterns in next.config.mjs for external sources
 * ✅ Handle image errors with onError callbacks
 * ✅ Use WebP/AVIF formats (configured automatically)
 * ✅ Optimize images at source (compress before upload)
 * ✅ Use Cloudinary for dynamic image resizing
 * ✅ Lazy load images below the fold with 'loading="lazy"'
 * ✅ Set alt text for accessibility
 */

/**
 * Image Loader Utilities
 */

/**
 * Custom Cloudinary loader for dynamic image transformation
 * @param props - Image loader props from Next.js
 * @returns Optimized Cloudinary URL
 */
export function cloudinaryLoader(props: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const baseUrl = 'https://res.cloudinary.com/dezla74jz/image/fetch';
  const params = [
    `c_scale,w_${props.width}`,
    `q_${props.quality || 'auto'}`,
    'f_auto', // Auto format (WebP/AVIF)
  ];
  return `${baseUrl}/${params.join(',')}/${props.src}`;
}

/**
 * Default Next.js loader (uses _next/image API)
 */
export function defaultLoader(props: {
  src: string;
  width: number;
  quality?: number;
}): string {
  return `/_next/image?url=${encodeURIComponent(props.src)}&w=${props.width}&q=${props.quality || 75}`;
}

export default {
  IMAGE_SIZES,
  DEVICE_SIZES,
  IMAGE_DEFAULT_SIZES,
  IMAGE_QUALITY,
  BLUR_PLACEHOLDERS,
  IMAGE_OPTIMIZATION_GUIDE,
  ImageOptimizationPatterns,
  ALLOWED_IMAGE_SOURCES,
  PERFORMANCE_IMPROVEMENTS,
  cloudinaryLoader,
  defaultLoader,
};
