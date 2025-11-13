import React, { useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import CourseCard from "@/components/CourseCard";
import { Search, Filter } from "lucide-react";

// Моковые данные
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

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <Head>
        <title>Каталог курсов - EduPlatform</title>
        <meta
          name="description"
          content="Просмотрите все доступные курсы"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Каталог курсов</h1>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск курсов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Курсы не найдены</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
