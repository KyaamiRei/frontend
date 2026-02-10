import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    duration: string;
    category: string;
    rating: number;
    students: number;
    lessons: {
      id: string;
      title: string;
      duration: string;
      order: number;
    }[];
    totalLessons: number;
  };
}

interface EnrollmentsContextType {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
  fetchEnrollments: () => Promise<void>;
  getEnrollmentByCourseId: (courseId: string) => Enrollment | undefined;
  completeLesson: (enrollmentId: string, lessonId: string) => Promise<void>;
  checkLessonCompletion: (enrollmentId: string, lessonId: string) => Promise<boolean>;
  unenroll: (enrollmentId: string) => Promise<void>;
}

export const EnrollmentsContext = createContext<EnrollmentsContextType | undefined>(undefined);

export const useEnrollments = () => {
  const context = useContext(EnrollmentsContext);
  if (!context) {
    throw new Error("useEnrollments must be used within an EnrollmentsProvider");
  }
  return context;
};

interface EnrollmentsProviderProps {
  children: ReactNode;
}

export const EnrollmentsProvider: React.FC<EnrollmentsProviderProps> = ({ children }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const fetchEnrollments = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/enrollments?userId=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch enrollments");
      }
      const data = await response.json();
      setEnrollments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getEnrollmentByCourseId = (courseId: string): Enrollment | undefined => {
    return enrollments.find((enrollment) => enrollment.courseId === courseId);
  };

  const completeLesson = async (enrollmentId: string, lessonId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete lesson");
      }

      // Refresh enrollments after completion
      await fetchEnrollments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const checkLessonCompletion = async (enrollmentId: string, lessonId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}/lessons/${lessonId}/check?userId=${user?.id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to check lesson completion");
      }

      const data = await response.json();
      return data.completed;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  const unenroll = async (enrollmentId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to unenroll from course");
      }

      // Refresh enrollments after unenrollment
      await fetchEnrollments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchEnrollments();
    }
  }, [isAuthenticated, user?.id]);

  const value: EnrollmentsContextType = {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    getEnrollmentByCourseId,
    completeLesson,
    checkLessonCompletion,
    unenroll,
  };

  return <EnrollmentsContext.Provider value={value}>{children}</EnrollmentsContext.Provider>;
};
