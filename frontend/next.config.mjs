import { FRONT_CONFIG } from "./config/credentials.js";
import path from "path";
import { fileURLToPath } from "url";
import { getSecurityHeaders } from "./lib/security.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    `${FRONT_CONFIG.host}:${FRONT_CONFIG.front_port}`,
    `${FRONT_CONFIG.api_origin}`,
  ],

  // 🚀 OPTIMIZACIONES DE COMPILACIÓN
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
  
  // Experimental features optimizadas
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
    optimizePackageImports: [
      "@chakra-ui/react",
      "lucide-react",
      "@radix-ui/*",
      "framer-motion",
      "recharts",
    ],
  },

  // Compilador optimizado
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
    // Eliminar propiedades React no utilizadas
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // Compresión agresiva
  compress: true,
  generateEtags: true,

  // Webpack optimización
  webpack: (config, { dev, isServer }) => {
    config.infrastructureLogging = {
      level: "error",
      debug: false,
    };

    // Caché de compilación mejorada
    config.cache = {
      type: "filesystem",
      allowCollectingMemory: true,
      buildDependencies: {
        config: [__filename],
      },
    };

    // Optimizaciones de cliente (solo en producción)
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: "react-vendors",
              priority: 20,
              reuseExistingChunk: true,
              enforce: true,
            },
            animation: {
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              name: "animation",
              priority: 15,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "th.bing.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.nike.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.lg.com",
        port: "",
        pathname: "/content/dam/channel/wcms/latin/images/tvs/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },

  turbopack: {
    root: __dirname,
  },
  
  // Security Headers con CSP y mejores prácticas
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...getSecurityHeaders(),
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
        ],
      },
      // Headers específicos para API routes
      {
        source: "/api/:path*",
        headers: [
          ...getSecurityHeaders(),
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      // CORS para el backend
      {
        source: "/backend/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: `${FRONT_CONFIG.api_origin}`,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `http://localhost:8000/backend/:path*`,

        /*         destination:  `http://10.5.213.111:8000/backend/:path*`,
         */
      },
    ];
  },
};
export default nextConfig;
