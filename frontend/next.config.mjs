import { FRONT_CONFIG } from "./config/credentials.js";
import path from "path";
import { fileURLToPath } from "url";
import { getSecurityHeaders } from "./lib/security.js";
import withBundleAnalyzerConfig from "./next.bundle-analyzer.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    `${FRONT_CONFIG.host}:${FRONT_CONFIG.front_port}`,
    `${FRONT_CONFIG.api_origin}`,
  ],

  // Ignorar errores de TypeScript durante build (opcional)
  typescript: {
    ignoreBuildErrors: false, // Mantener validación de tipos
  },

  // 🚀 OPTIMIZACIONES DE COMPILACIÓN
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
  poweredByHeader: false,
  
  // Experimental features optimizadas
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tooltip",
      "framer-motion",
      "recharts",
      "react-icons",
    ],
  },

  // Compilador optimizado
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
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

    // Optimizaciones de cliente (solo en producción)
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework (React)
            framework: {
              name: "framework",
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Librerías grandes
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                const packageName = match ? match[1] : null;
                
                // Agrupar por paquete
                if (packageName) {
                  if (packageName.startsWith('@radix-ui')) return 'radix-ui';
                  if (['framer-motion', 'motion'].includes(packageName)) return 'animations';
                  if (['lucide-react', 'react-icons'].includes(packageName)) return 'icons';
                  if (['recharts', 'react-chartjs-2'].includes(packageName)) return 'charts';
                }
                return 'lib';
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
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
      // Headers para páginas estáticas (mejor caché)
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Headers para imágenes optimizadas
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Headers para dashboard (privado, pero sin no-store para bfcache)
      {
        source: "/dashboard/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, max-age=0, must-revalidate",
          },
        ],
      },
      // Headers para páginas públicas (habilitando bfcache)
      {
        source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      // Headers específicos para API sensibles
      {
        source: "/api/auth/:path*",
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
      {
        source: "/api/payments/:path*",
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
      // Headers específicos para API routes (sin no-store por defecto)
      {
        source: "/api/:path*",
        headers: [
          ...getSecurityHeaders(),
          {
            key: "Cache-Control",
            value: "private, max-age=0, must-revalidate",
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

export default withBundleAnalyzerConfig(nextConfig);
