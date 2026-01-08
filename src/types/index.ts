// Общие типы для всего приложения

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  category: string;
  price: number;
  image?: string;
  lessons?: Array<{
    id: string;
    title: string;
    duration: string;
    order: number;
    completed?: boolean;
  }>;
  reviews?: Array<{
    id: string;
    userId: string;
    author: string;
    rating: number;
    date: Date | string;
    text: string;
  }>;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  instructor: string;
  instructorBio?: string;
  date: Date;
  duration: string;
  participants: number;
  isLive: boolean;
  topics: string[];
  category?: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  text: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  author?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  order: number;
  createdAt: Date | string;
}
