import { Request, Response } from "express";
import * as notificationService from "../services/notifications.js";

// GET /api/notifications - Obtener notificaciones
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { staffId, isRead, count } = req.query;

    if (!staffId) {
      return res.status(400).json({ error: "staffId is required" });
    }

    // Si solo quieren el conteo
    if (count === 'true') {
      const unreadCount = await notificationService.getUnreadNotificationsCount(Number(staffId));
      return res.json({ count: unreadCount });
    }

    // Obtener notificaciones
    const isReadFilter = isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    const notifications = await notificationService.getNotificationsByStaffId(
      Number(staffId),
      isReadFilter
    );

    res.json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// PATCH /api/notifications/:id/read - Marcar como leída
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await notificationService.markNotificationAsRead(Number(id));

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

// PATCH /api/notifications/read-all - Marcar todas como leídas
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({ error: "staffId is required" });
    }

    await notificationService.markAllNotificationsAsRead(Number(staffId));

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};

// DELETE /api/notifications/:id - Eliminar notificación
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await notificationService.deleteNotification(Number(id));

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
