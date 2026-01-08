import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, WebinarCard } from "@/components";
import { useWebinars } from "@/contexts/WebinarsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Calendar, Plus } from "lucide-react";

export default function Webinars() {
  const { webinars } = useWebinars();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const now = new Date();
  const filteredWebinars = webinars.filter((webinar) => {
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Вебинары</h1>
            {isAuthenticated && (
              <Link
                href="/webinars/create"
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                <Plus className="w-5 h-5" />
                <span>Создать вебинар</span>
              </Link>
            )}
          </div>

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
