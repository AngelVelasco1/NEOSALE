import express from "express";
import { initRoutes } from "./routes/router.js";
import { BACK_CONFIG } from "./config/credentials.js";
import cors from "cors";
import { prisma } from "./lib/prisma";
import { errorsHandler } from "./middlewares/errorsHandler";

const app = express();

app.use(
  cors({
    origin: BACK_CONFIG.cors_origin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ 
    message: "API is running",
    timestamp: new Date().toISOString()
  });
});
app.use("/api", initRoutes());

app.use((req, res, next) => {
  const error = new Error(`Ruta ${req.originalUrl} no encontrada`);
  error.name = 'NotFoundError';
  next(error);
});

app.use(errorsHandler)

app.listen(Number(BACK_CONFIG.port), "0.0.0.0", () => {
  console.log(
    `Servidor corriendo en http://${BACK_CONFIG.host}:${BACK_CONFIG.port}`
  );
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Servidor cerrado correctamente");
  process.exit();
});
