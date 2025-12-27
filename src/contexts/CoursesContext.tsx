import React, { createContext, useContext, useState, useEffect } from "react";

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
    completed?: boolean;
  }>;
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    date: Date | string;
    text: string;
  }>;
}

interface CoursesContextType {
  courses: Course[];
  isLoading: boolean;
  addCourse: (course: Omit<Course, "id" | "students" | "rating">) => Promise<Course>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
  refreshCourses: () => Promise<void>;
  addReview: (courseId: string, userId: string, rating: number, text: string) => Promise<void>;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const CoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка курсов из API
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/courses");
      if (!response.ok) {
        throw new Error("Ошибка загрузки курсов");
      }
      const data = await response.json();
      // Преобразуем даты в reviews
      const coursesWithDates = data.map((course: Course) => ({
        ...course,
        reviews: course.reviews?.map((review: any) => ({
          ...review,
          date: new Date(review.date),
        })),
      }));
      setCourses(coursesWithDates);
    } catch (error) {
      console.error("Ошибка загрузки курсов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async (courseData: Omit<Course, "id" | "students" | "rating">): Promise<Course> => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error("Ошибка создания курса");
      }

      const newCourse = await response.json();
      setCourses((prev) => [...prev, newCourse]);
      return newCourse;
    } catch (error) {
      console.error("Ошибка создания курса:", error);
      throw error;
    }
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error("Ошибка обновления курса");
      }

      const updatedCourse = await response.json();
      setCourses((prev) =>
        prev.map((course) => (course.id === id ? { ...course, ...updatedCourse } : course)),
      );
    } catch (error) {
      console.error("Ошибка обновления курса:", error);
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ошибка удаления курса");
      }

      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Ошибка удаления курса:", error);
      throw error;
    }
  };

  const getCourseById = (id: string): Course | undefined => {
    return courses.find((course) => course.id === id);
  };

  const refreshCourses = async () => {
    await fetchCourses();
  };

  const addReview = async (courseId: string, userId: string, rating: number, text: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, rating, text }),
      });

      if (!response.ok) {
        throw new Error("Ошибка добавления отзыва");
      }

      // Обновляем курс с новым отзывом
      await refreshCourses();
    } catch (error) {
      console.error("Ошибка добавления отзыва:", error);
      throw error;
    }
  };

  return (
    <CoursesContext.Provider
      value={{
        courses,
        isLoading,
        addCourse,
        updateCourse,
        deleteCourse,
        getCourseById,
        refreshCourses,
        addReview,
      }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error("useCourses must be used within CoursesProvider");
  }
  return context;
};
