import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, CourseCard } from "@/components";
import { useCourses } from "@/contexts/CoursesContext";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Filter, X, Plus } from "lucide-react";

const categories = [
  "Все",
  "Веб-разработка",
  "Программирование",
  "Дизайн",
  "Базы данных",
  "Мобильная разработка",
];

export default function Courses() {
  const { courses } = useCourses();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "students" | "duration">("rating");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = courses
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Каталог курсов</h1>
            {isAuthenticated && (user?.role === "ADMIN" || user?.role === "TEACHER") && (
              <Link
                href="/courses/create"
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <Plus className="w-5 h-5" />
                <span>Создать курс</span>
              </Link>
            )}
          </div>

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
