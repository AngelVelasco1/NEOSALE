import 'dotenv/config'
import express from "express";
import { initRoutes } from "./routes/router.js";
import { BACK_CONFIG } from "./config/credentials.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.js";
import compression from "compression";
import { errorsHandler } from "./middlewares/errorsHandler.js";
import { startTokenCleanupInterval } from "./lib/cleanupTokens.js";

const app = express();

// Desactivar directory listing y X-Powered-By
app.disable("x-powered-by");
app.set("trust proxy", 1);

// Optimizaciones JSON y rendering
app.set("json spaces", 0);
app.set("etag", false);

// Compresión con nivel 6 (balance entre CPU y tamaño)
app.use(
  compression({
    level: 6,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origin (como Postman o servidor a servidor)
      if (!origin) return callback(null, true);
      
      // En desarrollo, permitir localhost:3000 y localhost:8000
      if (
        origin === BACK_CONFIG.cors_origin ||
        origin === `http://${BACK_CONFIG.host}:${BACK_CONFIG.front_port}` ||
        origin === `http://localhost:3000` ||
        origin === `http://127.0.0.1:3000`
      ) {
        return callback(null, true);
      }

      // En producción, se configura via variable de entorno
      if (process.env.NODE_ENV === "production") {
        return callback(null, true);
      }

      return callback(null, true); // Permitir por ahora
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-User-ID"],
    maxAge: 86400,
  })
);

// Parser middlewares optimizados
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Headers de seguridad y performance
app.use((req, res, next) => {
  // Headers de seguridad
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Cache-Control", "public, max-age=3600");
  
  // Remover headers de timing
  res.removeHeader("Date");
  res.removeHeader("Last-Modified");
  res.removeHeader("ETag");
  res.removeHeader("Server");
  
  next();
});


app.use("/api", initRoutes());

// Ruta 404 optimizada
app.use((req, res, next) => {
  if (res.headersSent) {
    return next();
  }
  
  res.status(404).json({
    success: false,
    message: "Recurso no encontrado",
    code: "NOT_FOUND",
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response) => {
  if (!res.headersSent) {
    errorsHandler(err, req, res);
  }
});
const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, "0.0.0.0", async () => {
  startTokenCleanupInterval(60 * 60 * 1000);
});

// Timeouts para long-running requests
server.setTimeout(30000);

// Graceful shutdown
process.on("SIGINT", async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
