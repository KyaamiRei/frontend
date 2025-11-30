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
    id: number;
    title: string;
    duration: string;
    completed?: boolean;
  }>;
  reviews?: Array<{
    id: number;
    author: string;
    rating: number;
    date: Date;
    text: string;
  }>;
}

interface CoursesContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, "id" | "students" | "rating">) => Course;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getCourseById: (id: string) => Course | undefined;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

// Начальные данные
const initialCourses: Course[] = [
  {
    id: "1",
    title: "Основы веб-разработки",
    description: "Изучите HTML, CSS и JavaScript с нуля. Создайте свои первые веб-приложения.",
    fullDescription:
      "Этот курс предназначен для начинающих разработчиков, которые хотят освоить основы веб-разработки. Вы изучите HTML для структуры, CSS для стилизации и JavaScript для интерактивности. К концу курса вы сможете создавать полноценные веб-приложения.",
    instructor: "Иван Петров",
    duration: "40 часов",
    students: 1250,
    rating: 4.8,
    category: "Веб-разработка",
    price: 0,
    lessons: [
      { id: 1, title: "Введение в HTML", duration: "45 мин", completed: false },
      { id: 2, title: "Структура HTML документа", duration: "50 мин", completed: false },
      { id: 3, title: "Основы CSS", duration: "60 мин", completed: false },
      { id: 4, title: "Flexbox и Grid", duration: "70 мин", completed: false },
      { id: 5, title: "Введение в JavaScript", duration: "55 мин", completed: false },
      { id: 6, title: "DOM манипуляции", duration: "65 мин", completed: false },
    ],
    reviews: [
      {
        id: 1,
        author: "Алексей Смирнов",
        rating: 5,
        date: new Date("2024-12-10"),
        text: "Отличный курс для начинающих! Все объясняется очень понятно, много практических примеров. Рекомендую!",
      },
      {
        id: 2,
        author: "Мария Козлова",
        rating: 5,
        date: new Date("2024-12-08"),
        text: "Преподаватель очень опытный, материал подается структурированно. Уже после первых уроков смогла создать свой первый сайт.",
      },
    ],
  },
  {
    id: "2",
    title: "Python для начинающих",
    description: "Полный курс по программированию на Python. От основ до продвинутых тем.",
    instructor: "Мария Сидорова",
    duration: "60 часов",
    students: 2100,
    rating: 4.9,
    category: "Программирование",
    price: 2999,
  },
  {
    id: "3",
    title: "Дизайн интерфейсов",
    description: "Изучите принципы UI/UX дизайна и создавайте красивые интерфейсы.",
    instructor: "Алексей Козлов",
    duration: "35 часов",
    students: 890,
    rating: 4.7,
    category: "Дизайн",
    price: 2499,
  },
  {
    id: "4",
    title: "React и современный JavaScript",
    description: "Освойте React, хуки, контекст и создание полноценных приложений.",
    instructor: "Сергей Иванов",
    duration: "50 часов",
    students: 1800,
    rating: 4.9,
    category: "Веб-разработка",
    price: 3499,
  },
  {
    id: "5",
    title: "Базы данных и SQL",
    description: "Изучите проектирование баз данных, SQL запросы и оптимизацию.",
    instructor: "Ольга Смирнова",
    duration: "30 часов",
    students: 1100,
    rating: 4.6,
    category: "Базы данных",
    price: 1999,
  },
  {
    id: "6",
    title: "Мобильная разработка",
    description: "Создавайте мобильные приложения для iOS и Android.",
    instructor: "Андрей Морозов",
    duration: "70 часов",
    students: 950,
    rating: 4.8,
    category: "Мобильная разработка",
    price: 3999,
  },
];

export const CoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) {
      try {
        const parsed = JSON.parse(savedCourses);
        // Преобразуем даты в reviews
        const coursesWithDates = parsed.map((course: Course) => ({
          ...course,
          reviews: course.reviews?.map((review: any) => ({
            ...review,
            date: new Date(review.date),
          })),
        }));
        setCourses(coursesWithDates);
      } catch (error) {
        console.error("Ошибка загрузки курсов:", error);
      }
    }
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const addCourse = (courseData: Omit<Course, "id" | "students" | "rating">): Course => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      students: 0,
      rating: 0,
    };
    setCourses((prev) => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === id ? { ...course, ...courseData } : course)),
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const getCourseById = (id: string): Course | undefined => {
    return courses.find((course) => course.id === id);
  };

  return (
    <CoursesContext.Provider
      value={{
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        getCourseById,
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
