import { Router } from "express";
import { search } from "../controllers/search.js";
import { cacheMiddleware } from "../middlewares/cache.js";

export const searchRoutes = () =>
  Router().get("/", cacheMiddleware(5 * 60 * 1000), search);
