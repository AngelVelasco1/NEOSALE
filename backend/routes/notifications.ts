import { Router } from "express";
import * as notificationController from "../controllers/notifications.js";

const router = Router();

// Obtener notificaciones
router.get("/", notificationController.getNotifications);

// Marcar notificación como leída
router.patch("/:id/read", notificationController.markAsRead);

// Marcar todas las notificaciones como leídas
router.patch("/read-all", notificationController.markAllAsRead);

// Eliminar notificación
router.delete("/:id", notificationController.deleteNotification);

export default router;
