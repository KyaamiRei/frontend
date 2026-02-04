import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, CourseCard, WebinarCard } from "@/components";
import { useCourses } from "@/contexts/CoursesContext";
import { useWebinars } from "@/contexts/WebinarsContext";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Video, TrendingUp, Award, Sparkles } from "lucide-react";

export default function Home() {
  const { courses } = useCourses();
  const { webinars } = useWebinars();
  const { user } = useAuth();
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);

  // Получаем топ-3 курса по рейтингу
  const featuredCourses = [...courses].sort((a, b) => b.rating - a.rating).slice(0, 3);

  // Получаем предстоящие вебинары
  const now = new Date();
  const upcomingWebinars = webinars
    .filter((w) => w.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 2);

  // Функция для получения рекомендаций на основе интересов
  useEffect(() => {
    const getRecommendedCourses = () => {
      if (!user?.interests || user.interests.length === 0) {
        setRecommendedCourses([]);
        return;
      }

      // Маппинг интересов на категории курсов
      const interestToCategory: { [key: string]: string[] } = {
        "Веб-разработка": ["Веб-разработка", "Программирование"],
        "Мобильная разработка": ["Мобильная разработка", "Программирование"],
        "Базы данных": ["Базы данных", "Программирование"],
        "Машинное обучение": ["Программирование"],
        "UI/UX дизайн": ["Дизайн"],
        "Графический дизайн": ["Дизайн"],
        "Веб-дизайн": ["Дизайн", "Веб-разработка"],
        "Начинающий": [],
        "Средний": [],
        "Продвинутый": [],
        "Эксперт": [],
        "Видео-уроки": [],
        "Интерактивные задания": [],
        "Смешанный формат": [],
        "1-3 часа": [],
        "4-7 часов": [],
        "8-15 часов": [],
        "Более 15 часов": [],
        "Не интересует": [],
      };

      // Собираем все релевантные категории
      const relevantCategories = new Set<string>();
      user.interests.forEach((interest) => {
        const categories = interestToCategory[interest] || [];
        categories.forEach((cat) => relevantCategories.add(cat));
      });

      // Фильтруем курсы по релевантным категориям
      const recommended = courses
        .filter((course) => {
          // Проверяем, соответствует ли категория курса интересам
          return relevantCategories.has(course.category);
        })
        .sort((a, b) => {
          // Сортируем по рейтингу
          return b.rating - a.rating;
        })
        .slice(0, 6); // Берем топ-6 рекомендованных курсов

      setRecommendedCourses(recommended);
    };

    getRecommendedCourses();
  }, [user?.interests, courses]);

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

        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                  <h2 className="text-3xl font-bold text-gray-800">Рекомендуемые курсы для вас</h2>
                </div>
                <Link
                  href="/courses"
                  className="text-blue-600 hover:text-blue-700 font-semibold">
                  Смотреть все →
                </Link>
              </div>
              <p className="text-gray-600 mb-6">
                Мы подобрали эти курсы специально для вас на основе ваших интересов
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

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
