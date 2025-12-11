import { FRONT_CONFIG } from "./config/credentials.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    `${FRONT_CONFIG.host}:${FRONT_CONFIG.front_port}`,
    `${FRONT_CONFIG.api_origin}`,
  ],

  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }

    // Suprimir warnings específicos de webpack
    config.infrastructureLogging = {
      level: "error",
      debug: false,
    };

    // Optimización adicional para módulos grandes
    config.optimization = {
      ...config.optimization,
      moduleIds: "deterministic",
    };

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
  // Headers para mejorar CORS
  async headers() {
    return [
      {
        source: "/(.*)",
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
