"use client";

import { useEffect, useState } from "react";
import { Bell, Trash2, Check, Package, ShoppingCart, Star, AlertTriangle, Tag, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchNotifications,
  fetchNotificationsCount,
  deleteNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notifications";
import { Notification, NotificationType } from "../services/notifications/types";
import { toast } from "sonner";

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  low_stock: <Package className="h-4 w-4 text-orange-500" />,
  out_of_stock: <AlertTriangle className="h-4 w-4 text-red-500" />,
  new_order: <ShoppingCart className="h-4 w-4 text-blue-500" />,
  order_status_change: <ShoppingCart className="h-4 w-4 text-green-500" />,
  new_review: <Star className="h-4 w-4 text-yellow-500" />,
  system_alert: <AlertTriangle className="h-4 w-4 text-purple-500" />,
  promotion: <Tag className="h-4 w-4 text-pink-500" />,
};

interface NotificationBellProps {
  staffId: number;
}

export function NotificationBell({ staffId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar notificaciones y contador
  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const [notifs, count] = await Promise.all([
        fetchNotifications({ staffId: staffId.toString() }),
        fetchNotificationsCount({ staffId: staffId.toString() }),
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar al montar y cada 30 segundos
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [staffId]);

  // Marcar como leída
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead({ notificationId: notificationId.toString() });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error("Error al marcar como leída");
    }
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead({ staffId: staffId.toString() });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success("Todas las notificaciones marcadas como leídas");
    } catch (error) {
      toast.error("Error al marcar todas como leídas");
    }
  };

  // Eliminar notificación
  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification({ notificationId: notificationId.toString() });
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (!notifications.find((n) => n.id === notificationId)?.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success("Notificación eliminada");
    } catch (error) {
      toast.error("Error al eliminar notificación");
    }
  };

  // Formatear fecha relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Ahora";
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-800 transition-colors"
      >
        <Bell className="h-5 w-5 text-slate-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-96 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-gray-800 to-gray-900">
                <h3 className="font-semibold text-white">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-500 font-medium flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Marcar todas
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="py-8 text-center text-gray-500">
                    Cargando...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-300 text-sm">
                      No hay notificaciones
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4     hover:bg-slate-800/50 transition-colors cursor-pointer group ${
                          !notification.is_read
                            ? "bg-blue-900/10"
                            : ""
                        }`}
                        onClick={() => {
                          if (!notification.is_read) {
                            handleMarkAsRead(notification.id);
                          }
                          if (notification.link) {
                            window.location.href = notification.link;
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {notificationIcons[notification.type]}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium text-white">
                                {notification.title}
                              </h4>
                              {!notification.is_read && (
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatRelativeTime(notification.created_at)}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                          >
                            <XIcon className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
