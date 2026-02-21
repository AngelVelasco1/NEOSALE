import { Notification } from "./types";
import { api } from "@/config/api";

export async function fetchNotifications({
  staffId,
}: {
  staffId: string;
}): Promise<Notification[]> {
  try {
    const response = await api.get("/api/notifications/", {
      params: { staffId },
    });
    return response.data;
  } catch (error) {
    
    return [];
  }
}

export async function deleteNotification({
  notificationId,
}: {
  notificationId: string;
}) {
  try {
    await api.delete(`/api/notifications/${notificationId}`);
  } catch (error) {
    
    throw new Error("No se pudo eliminar la notificación");
  }
}

export async function fetchNotificationsCount({
  staffId,
}: {
  staffId: string;
}): Promise<number> {
  try {
    const response = await api.get("/api/notifications/", {
      params: { staffId, count: true },
    });
    return response.data.count ?? 0;
  } catch (error) {
    
    return 0;
  }
}

export async function markNotificationAsRead({
  notificationId,
}: {
  notificationId: string;
}) {
  try {
    await api.patch(`/api/notifications/${notificationId}/read`);
  } catch (error) {
    
    throw new Error("No se pudo marcar la notificación como leída");
  }
}

export async function markAllNotificationsAsRead({
  staffId,
}: {
  staffId: string;
}) {
  try {
    await api.patch("/api/notifications/read-all", { staffId });
  } catch (error) {
    
    throw new Error("No se pudieron marcar todas las notificaciones como leídas");
  }
}
