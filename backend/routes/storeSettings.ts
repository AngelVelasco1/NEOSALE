import { Router } from "express";
import {
  getStoreSettings,
  updateStoreSettings,
  getStoreColors,
} from "../controllers/storeSettings.js";
import { cacheMiddleware } from "../middlewares/cache.js";

export const storeSettingsRoutes = () =>
  Router()
    .get("/", cacheMiddleware(60 * 60 * 1000), getStoreSettings) // Cache 1 hour
    .get("/colors", cacheMiddleware(60 * 60 * 1000), getStoreColors) // Cache 1 hour
    .put("/", updateStoreSettings);
