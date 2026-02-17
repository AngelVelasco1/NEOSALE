import { Request, Response, NextFunction } from "express";
import * as notificationService from "../services/notifications.js";

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { staffId, isRead, count } = req.query;

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
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markNotificationAsRead(Number(id));
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { staffId } = req.body;
    await notificationService.markAllNotificationsAsRead(Number(staffId));
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await notificationService.deleteNotification(Number(id));
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
