import React, { useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import WebinarCard from "@/components/WebinarCard";
import { Search, Calendar } from "lucide-react";

// Моковые данные
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

export default function Webinars() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const now = new Date();
  const filteredWebinars = allWebinars.filter((webinar) => {
    const matchesSearch =
      webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webinar.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webinar.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "upcoming") return webinar.date > now;
    if (filter === "past") return webinar.date < now;
    return true;
  });

  return (
    <>
      <Head>
        <title>Вебинары - EduPlatform</title>
        <meta
          name="description"
          content="Просмотрите все доступные вебинары"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Вебинары</h1>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск вебинаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
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
                onClick={() => setFilter("upcoming")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === "upcoming"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                Предстоящие
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === "past"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                Прошедшие
              </button>
            </div>
          </div>

          {/* Webinars Grid */}
          {filteredWebinars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWebinars.map((webinar) => (
                <WebinarCard
                  key={webinar.id}
                  {...webinar}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Вебинары не найдены</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
