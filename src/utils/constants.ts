// Константы приложения

export const APP_NAME = "EduPlatform";

export const ROUTES = {
  HOME: "/",
  COURSES: "/courses",
  COURSE: (id: string) => `/courses/${id}`,
  CREATE_COURSE: "/courses/create",
  WEBINARS: "/webinars",
  WEBINAR: (id: string) => `/webinars/${id}`,
  CREATE_WEBINAR: "/webinars/create",
  FAVORITES: "/favorites",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  NOTIFICATIONS: "/notifications",
  ABOUT: "/about",
  ADMIN_USERS: "/admin/users",
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },
  COURSES: {
    INDEX: "/api/courses",
    DETAIL: (id: string) => `/api/courses/${id}`,
    REVIEWS: (id: string) => `/api/courses/${id}/reviews`,
  },
  WEBINARS: {
    INDEX: "/api/webinars",
    DETAIL: (id: string) => `/api/webinars/${id}`,
  },
  FAVORITES: {
    COURSES: "/api/favorites/courses",
    WEBINARS: "/api/favorites/webinars",
  },
  ADMIN: {
    USERS: "/api/admin/users",
    USER_ROLE: (id: string) => `/api/admin/users/${id}/role`,
  },
} as const;
