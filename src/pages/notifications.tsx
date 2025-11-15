import React, { useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  date: Date;
  read: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Курс завершен!",
    message: "Поздравляем! Вы успешно завершили курс 'Основы веб-разработки'",
    date: new Date("2024-12-15T10:00:00"),
    read: false,
    link: "/profile",
  },
  {
    id: "2",
    type: "info",
    title: "Новый вебинар",
    message: "Завтра в 18:00 состоится вебинар 'Искусственный интеллект в образовании'",
    date: new Date("2024-12-19T14:30:00"),
    read: false,
    link: "/webinars/1",
  },
  {
    id: "3",
    type: "warning",
    title: "Напоминание",
    message: "У вас есть незавершенные уроки в курсе 'Python для начинающих'",
    date: new Date("2024-12-18T09:00:00"),
    read: true,
    link: "/courses/2",
  },
  {
    id: "4",
    type: "info",
    title: "Новый курс доступен",
    message: "Доступен новый курс 'React и современный JavaScript'. Запишитесь сейчас!",
    date: new Date("2024-12-17T16:00:00"),
    read: true,
    link: "/courses/4",
  },
  {
    id: "5",
    type: "success",
    title: "Достижение разблокировано",
    message: "Вы получили достижение 'Первые шаги' за завершение первого урока",
    date: new Date("2024-12-16T11:00:00"),
    read: true,
    link: "/profile",
  },
];

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case "info":
      return <Info className="w-6 h-6 text-blue-500" />;
    case "warning":
      return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    case "error":
      return <AlertCircle className="w-6 h-6 text-red-500" />;
  }
};

const getBgColor = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "bg-green-50 border-green-200";
    case "info":
      return "bg-blue-50 border-blue-200";
    case "warning":
      return "bg-yellow-50 border-yellow-200";
    case "error":
      return "bg-red-50 border-red-200";
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <Head>
        <title>Уведомления - EduPlatform</title>
        <meta
          name="description"
          content="Ваши уведомления"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">Уведомления</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {unreadCount} непрочитанных
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-700 font-medium">
                Отметить все как прочитанные
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              Все
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              Непрочитанные ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 transition ${
                    notification.read ? "bg-white" : getBgColor(notification.type)
                  } ${!notification.read ? "border-l-4" : ""}`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            className={`font-semibold mb-1 ${
                              !notification.read ? "text-gray-900" : "text-gray-700"
                            }`}>
                            {notification.title}
                          </h3>
                          <p
                            className={`text-sm mb-2 ${
                              !notification.read ? "text-gray-700" : "text-gray-500"
                            }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {format(notification.date, "d MMMM yyyy, HH:mm", { locale: ru })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-blue-600 hover:text-blue-700">
                              Прочитано
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {notification.link && (
                        <a
                          href={notification.link}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                          Перейти →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {filter === "unread"
                  ? "Нет непрочитанных уведомлений"
                  : "У вас пока нет уведомлений"}
              </p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
