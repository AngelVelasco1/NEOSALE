import express from "express";
import { initRoutes } from "./routes/router.js";
import { BACK_CONFIG } from "./config/credentials.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma";
import { errorsHandler } from "./middlewares/errorsHandler";



const app = express();

// Desactivar directory listing y X-Powered-By
app.disable("x-powered-by");
app.set("trust proxy", 1);

// Desactivar el error handler HTML de Express y mostrar solo JSON
app.set("env", "production");
app.set("json spaces", 0);

app.use(
  cors({
    origin: BACK_CONFIG.cors_origin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-User-ID"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Prevenir directory listing y exposición de información
app.use((req, res, next) => {
  // Headers de seguridad
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Content-Security-Policy", "default-src 'none'");
  
  // Ocultar información de timing
  res.removeHeader("Date");
  res.removeHeader("Last-Modified");
  res.removeHeader("ETag");
  res.removeHeader("Server");
  
  // Forzar respuestas JSON, nunca HTML
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Servidor Corriendo",
    status: "online",
  });
});
app.use("/api", initRoutes());

// Manejador 404 que previene exposición de rutas
app.use((req, res, next) => {
  // Si ya hay una respuesta enviada, no hacer nada
  if (res.headersSent) {
    return next();
  }
  
  // Respuesta 404 sanitizada sin exponer rutas
  res.status(404).json({
    success: false,
    message: "Recurso no encontrado",
    code: "NOT_FOUND"
  });
});

// Error handler debe ser el último middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Prevenir que Express devuelva HTML con stack traces
  if (!res.headersSent) {
    errorsHandler(err, req, res);
  }
});

app.listen(Number(BACK_CONFIG.port), "0.0.0.0", async () => {
  console.log(
    `Servidor corriendo en http://${BACK_CONFIG.host}:${BACK_CONFIG.port}`
  );
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Servidor cerrado correctamente");
  process.exit();
});
