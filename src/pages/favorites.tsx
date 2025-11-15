import React from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import CourseCard from "@/components/CourseCard";
import WebinarCard from "@/components/WebinarCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Heart } from "lucide-react";

// Моковые данные (в реальном приложении будут загружаться по ID)
const allCourses = [
  {
    id: "1",
    title: "Основы веб-разработки",
    description: "Изучите HTML, CSS и JavaScript с нуля. Создайте свои первые веб-приложения.",
    instructor: "Иван Петров",
    duration: "40 часов",
    students: 1250,
    rating: 4.8,
  },
  {
    id: "2",
    title: "Python для начинающих",
    description: "Полный курс по программированию на Python. От основ до продвинутых тем.",
    instructor: "Мария Сидорова",
    duration: "60 часов",
    students: 2100,
    rating: 4.9,
  },
  {
    id: "3",
    title: "Дизайн интерфейсов",
    description: "Изучите принципы UI/UX дизайна и создавайте красивые интерфейсы.",
    instructor: "Алексей Козлов",
    duration: "35 часов",
    students: 890,
    rating: 4.7,
  },
  {
    id: "4",
    title: "React и современный JavaScript",
    description: "Освойте React, хуки, контекст и создание полноценных приложений.",
    instructor: "Сергей Иванов",
    duration: "50 часов",
    students: 1800,
    rating: 4.9,
  },
  {
    id: "5",
    title: "Базы данных и SQL",
    description: "Изучите проектирование баз данных, SQL запросы и оптимизацию.",
    instructor: "Ольга Смирнова",
    duration: "30 часов",
    students: 1100,
    rating: 4.6,
  },
  {
    id: "6",
    title: "Мобильная разработка",
    description: "Создавайте мобильные приложения для iOS и Android.",
    instructor: "Андрей Морозов",
    duration: "70 часов",
    students: 950,
    rating: 4.8,
  },
];

const allWebinars = [
  {
    id: "1",
    title: "Искусственный интеллект в образовании",
    description: "Обсудим применение AI в современном образовании и перспективы развития.",
    instructor: "Дмитрий Волков",
    date: new Date("2024-12-20T18:00:00"),
    duration: "1.5 часа",
    participants: 450,
  },
  {
    id: "2",
    title: "Цифровая трансформация школ",
    description: "Как внедрить цифровые технологии в образовательный процесс.",
    instructor: "Елена Новикова",
    date: new Date("2024-12-22T16:00:00"),
    duration: "2 часа",
    participants: 320,
  },
  {
    id: "3",
    title: "Онлайн-обучение: лучшие практики",
    description: "Эффективные методы организации онлайн-обучения для студентов.",
    instructor: "Анна Петрова",
    date: new Date("2024-12-25T14:00:00"),
    duration: "1.5 часа",
    participants: 280,
  },
  {
    id: "4",
    title: "Геймификация в образовании",
    description: "Как использовать игровые элементы для повышения мотивации студентов.",
    instructor: "Максим Соколов",
    date: new Date("2024-12-18T19:00:00"),
    duration: "2 часа",
    participants: 380,
    isLive: true,
  },
];

export default function Favorites() {
  const { favoriteCourses, favoriteWebinars } = useFavorites();

  const favoriteCoursesData = allCourses.filter((course) => favoriteCourses.includes(course.id));
  const favoriteWebinarsData = allWebinars.filter((webinar) =>
    favoriteWebinars.includes(webinar.id),
  );

  return (
    <>
      <Head>
        <title>Избранное - EduPlatform</title>
        <meta
          name="description"
          content="Ваши избранные курсы и вебинары"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-8">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-4xl font-bold text-gray-800">Избранное</h1>
          </div>

          {/* Favorite Courses */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Избранные курсы ({favoriteCoursesData.length})
            </h2>
            {favoriteCoursesData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteCoursesData.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">У вас пока нет избранных курсов</p>
                <p className="text-gray-400 text-sm mt-2">
                  Добавьте курсы в избранное, нажав на иконку сердца
                </p>
              </div>
            )}
          </section>

          {/* Favorite Webinars */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Избранные вебинары ({favoriteWebinarsData.length})
            </h2>
            {favoriteWebinarsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favoriteWebinarsData.map((webinar) => (
                  <WebinarCard
                    key={webinar.id}
                    {...webinar}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">У вас пока нет избранных вебинаров</p>
                <p className="text-gray-400 text-sm mt-2">
                  Добавьте вебинары в избранное, нажав на иконку сердца
                </p>
              </div>
            )}
          </section>
        </div>
      </Layout>
    </>
  );
}
