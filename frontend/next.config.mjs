import { FRONT_CONFIG } from './config/credentials.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir orígenes de desarrollo para solicitudes cross-origin
  allowedDevOrigins: [`${FRONT_CONFIG.host}:${FRONT_CONFIG.front_port}`, `${FRONT_CONFIG.api_origin}`],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.nike.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.lg.com',
        port: '',
        pathname: '/content/dam/channel/wcms/latin/images/tvs/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/500x500/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },

    ],
  },
  // Headers para mejorar CORS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: `${FRONT_CONFIG.api_origin}`,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
                destination:  `http://localhost:8000/backend/:path*`,

/*         destination:  `http://10.5.213.111:8000/backend/:path*`,
 */      },
    
    ];
  },

};
export default nextConfig;


