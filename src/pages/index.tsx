import React from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import CourseCard from "@/components/CourseCard";
import WebinarCard from "@/components/WebinarCard";
import { useCourses } from "@/contexts/CoursesContext";
import { useWebinars } from "@/contexts/WebinarsContext";
import { BookOpen, Video, TrendingUp, Award } from "lucide-react";

export default function Home() {
  const { courses } = useCourses();
  const { webinars } = useWebinars();

  // Получаем топ-3 курса по рейтингу
  const featuredCourses = [...courses]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Получаем предстоящие вебинары
  const now = new Date();
  const upcomingWebinars = webinars
    .filter((w) => w.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 2);

  return (
    <>
      <Head>
        <title>EduPlatform - Онлайн-курсы и вебинары</title>
        <meta
          name="description"
          content="Платформа для онлайн-обучения и вебинаров"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Образование нового уровня</h1>
              <p className="text-xl mb-8 text-blue-100">
                Изучайте новые навыки, посещайте вебинары и развивайтесь вместе с нами
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/courses"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center">
                  Смотреть курсы
                </Link>
                <Link
                  href="/webinars"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-center">
                  Записаться на вебинар
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Качественные курсы</h3>
                <p className="text-gray-600">Более 100 курсов от опытных преподавателей</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Живые вебинары</h3>
                <p className="text-gray-600">Интерактивные вебинары с экспертами индустрии</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Сертификаты</h3>
                <p className="text-gray-600">Получайте сертификаты по завершении курсов</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Популярные курсы</h2>
              <Link
                href="/courses"
                className="text-blue-600 hover:text-blue-700 font-semibold">
                Смотреть все →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Webinars */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Предстоящие вебинары</h2>
              <Link
                href="/webinars"
                className="text-blue-600 hover:text-blue-700 font-semibold">
                Смотреть все →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingWebinars.map((webinar) => (
                <WebinarCard
                  key={webinar.id}
                  {...webinar}
                />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
