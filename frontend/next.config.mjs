/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir orígenes de desarrollo para solicitudes cross-origin
  allowedDevOrigins: ['10.5.213.111:3001', '10.5.213.111', '10.5.213.111:8000'],
  
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
    ],
  },
  // Headers para mejorar CORS y seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://10.5.213.111:8000',
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
        destination:  `http://10.5.213.111:8000/backend/:path*`,
      },
    
    ];
  },

};
export default nextConfig;


