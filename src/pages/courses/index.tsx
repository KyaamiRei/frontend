import React, { useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import CourseCard from "@/components/CourseCard";
import { Search, Filter, X } from "lucide-react";

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
    category: "Веб-разработка",
    price: 0,
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

const categories = [
  "Все",
  "Веб-разработка",
  "Программирование",
  "Дизайн",
  "Базы данных",
  "Мобильная разработка",
];

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "students" | "duration">("rating");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = allCourses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "Все" || course.category === selectedCategory;
      const matchesRating = course.rating >= minRating;

      return matchesSearch && matchesCategory && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "students") return b.students - a.students;
      return 0;
    });

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
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск курсов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter className="w-5 h-5" />
                <span>Фильтры</span>
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Фильтры</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          selectedCategory === category
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}>
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Минимальный рейтинг: {minRating.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Сортировка</label>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "rating" | "students" | "duration")
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="rating">По рейтингу</option>
                    <option value="students">По количеству студентов</option>
                    <option value="duration">По длительности</option>
                  </select>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(selectedCategory !== "Все" || minRating > 0) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Активные фильтры:</span>
                {selectedCategory !== "Все" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1">
                    <span>{selectedCategory}</span>
                    <button onClick={() => setSelectedCategory("Все")}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1">
                    <span>Рейтинг ≥ {minRating.toFixed(1)}</span>
                    <button onClick={() => setMinRating(0)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}
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
