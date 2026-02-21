import { prisma } from "../lib/prisma.js";

export interface Notification {
  id: number;
  staff_id: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  related_entity_type?: string;
  related_entity_id?: number;
  is_read: boolean;
  read_at?: Date;
  created_at: Date;
}

export interface CreateNotificationParams {
  staff_id: number;
  type: 'low_stock' | 'out_of_stock' | 'new_order' | 'order_status_change' | 'new_review' | 'system_alert' | 'promotion';
  title: string;
  message: string;
  link?: string;
  related_entity_type?: string;
  related_entity_id?: number;
}

// Obtener notificaciones de un admin
export const getNotificationsByStaffId = async (staffId: number, isRead?: boolean) => {
  try {
    const where: any = { staff_id: staffId };
    
    if (isRead !== undefined) {
      where.is_read = isRead;
    }

    return await prisma.notifications.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Contar notificaciones no leídas
export const getUnreadNotificationsCount = async (staffId: number) => {
  try {
    return await prisma.notifications.count({
      where: {
        staff_id: staffId,
        is_read: false,
      },
    });
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    throw error;
  }
};

// Crear una notificación
export const createNotification = async (params: CreateNotificationParams) => {
  try {
    return await prisma.notifications.create({
      data: {
        staff_id: params.staff_id,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link || null,
        related_entity_type: params.related_entity_type || null,
        related_entity_id: params.related_entity_id || null,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Crear notificación para todos los admins
export const createNotificationForAllAdmins = async (
  params: Omit<CreateNotificationParams, 'staff_id'>
) => {
  try {
    // Obtener todos los usuarios admin
    const admins = await prisma.user.findMany({
      where: {
        role: 'admin',
        active: true,
      },
      select: { id: true },
    });

    const notifications = await Promise.all(
      admins.map((admin) =>
        createNotification({
          ...params,
          staff_id: admin.id,
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error('Error creating notifications for admins:', error);
    throw error;
  }
};

// Marcar notificación como leída
export const markNotificationAsRead = async (notificationId: number) => {
  try {
    return await prisma.notifications.update({
      where: { id: notificationId },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Marcar todas las notificaciones como leídas
export const markAllNotificationsAsRead = async (staffId: number) => {
  try {
    await prisma.notifications.updateMany({
      where: {
        staff_id: staffId,
        is_read: false,
      },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Eliminar notificación
export const deleteNotification = async (notificationId: number) => {
  try {
    await prisma.notifications.delete({
      where: { id: notificationId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Eliminar notificaciones antiguas (más de 30 días)
export const deleteOldNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.notifications.deleteMany({
      where: {
        created_at: {
          lt: thirtyDaysAgo,
        },
      },
    });
    return result.count;
  } catch (error) {
    console.error('Error deleting old notifications:', error);
    throw error;
  }
};

// Helper: Notificar stock bajo
export const notifyLowStock = async (productId: number, productName: string, currentStock: number, threshold: number = 10) => {
  if (currentStock <= threshold) {
    return createNotificationForAllAdmins({
      type: currentStock === 0 ? 'out_of_stock' : 'low_stock',
      title: currentStock === 0 ? 'Producto sin stock' : 'Stock bajo',
      message: currentStock === 0 
        ? `El producto "${productName}" se ha quedado sin stock.`
        : `El producto "${productName}" tiene solo ${currentStock} unidades disponibles.`,
      link: `/dashboard/products/${productId}`,
      related_entity_type: 'product',
      related_entity_id: productId,
    });
  }
};

// Helper: Notificar nueva orden
export const notifyNewOrder = async (orderId: number, customerName: string, orderTotal: number) => {
  return createNotificationForAllAdmins({
    type: 'new_order',
    title: 'Nueva orden recibida',
    message: `Nueva orden #${orderId} de ${customerName} por $${orderTotal.toLocaleString()}.`,
    link: `/dashboard/orders/${orderId}`,
    related_entity_type: 'order',
    related_entity_id: orderId,
  });
};

// Helper: Notificar cambio de estado de orden
export const notifyOrderStatusChange = async (orderId: number, newStatus: string) => {
  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagada',
    confirmed: 'Confirmada',
    shipped: 'Enviada',
    delivered: 'Entregada',
    cancelled: 'Cancelada',
  };

  return createNotificationForAllAdmins({
    type: 'order_status_change',
    title: 'Cambio de estado de orden',
    message: `La orden #${orderId} cambió a estado: "${statusLabels[newStatus] || newStatus}".`,
    link: `/dashboard/orders/${orderId}`,
    related_entity_type: 'order',
    related_entity_id: orderId,
  });
};

// Helper: Notificar nueva reseña
export const notifyNewReview = async (
  productId: number,
  productName: string,
  rating: number
) => {
  return createNotificationForAllAdmins({
    type: 'new_review',
    title: 'Nueva reseña',
    message: `Nueva reseña de ${rating}★ en "${productName}".`,
    link: `/dashboard/products/${productId}`,
    related_entity_type: 'product',
    related_entity_id: productId,
  });
};
