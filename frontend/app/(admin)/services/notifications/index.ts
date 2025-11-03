import { Notification } from "./types";

// TODO: Implementar backend de notificaciones
export async function fetchNotifications({
  staffId,
}: {
  staffId: string;
}): Promise<Notification[]> {
  // Mock: Retornar array vacío mientras no existe el backend
  console.log("[MOCK] fetchNotifications called with staffId:", staffId);
  return [];
  
  /* // Implementación real cuando el backend esté listo:
  const queryParams = new URLSearchParams({
    staffId,
    published: "true",
  });

  const response = await fetch(`/api/notifications?${queryParams.toString()}`);

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error fetching notifications:", errorMessage);
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
  */
}

// TODO: Implementar backend de notificaciones
export async function deleteNotification({
  notificationId,
}: {
  notificationId: string;
}) {
  // Mock: Simular eliminación exitosa
  console.log("[MOCK] deleteNotification called with id:", notificationId);
  return;
  
  /* // Implementación real cuando el backend esté listo:
  const response = await fetch(`/api/notifications/${notificationId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error deleting notification:", errorMessage);
    throw new Error("Could not dismiss the notification.");
  }

  return;
  */
}

// TODO: Implementar backend de notificaciones
export async function fetchNotificationsCount({
  staffId,
}: {
  staffId: string;
}): Promise<number> {
  // Mock: Retornar 0 notificaciones mientras no existe el backend
  console.log("[MOCK] fetchNotificationsCount called with staffId:", staffId);
  return 0;
  
  /* // Implementación real cuando el backend esté listo:
  const queryParams = new URLSearchParams({
    staffId,
    isRead: "false",
    published: "true",
    count: "true",
  });

  const response = await fetch(`/api/notifications?${queryParams.toString()}`);

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error fetching notification count:", errorMessage);
    throw new Error("Could not fetch notification count.");
  }

  const data = await response.json();
  return data.count ?? 0;
  */
}
