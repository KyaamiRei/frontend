import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { User, BookOpen, Video, Award, Settings, Trophy, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || (!isAuthenticated && typeof window !== "undefined")) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <p className="text-gray-600 text-lg">Загрузка профиля...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Профиль - EduPlatform</title>
        <meta
          name="description"
          content="Ваш профиль"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {user.name || "Пользователь"}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-500 text-sm mt-1">Студент EduPlatform</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Активных курсов</p>
                    <p className="text-3xl font-bold text-gray-800">5</p>
                  </div>
                  <BookOpen className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Завершено курсов</p>
                    <p className="text-3xl font-bold text-gray-800">12</p>
                  </div>
                  <Award className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Посещено вебинаров</p>
                    <p className="text-3xl font-bold text-gray-800">8</p>
                  </div>
                  <Video className="w-12 h-12 text-purple-600" />
                </div>
              </div>
            </div>

            {/* My Courses */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Мои курсы</h2>
                <Link
                  href="/courses"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Все курсы →
                </Link>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">Основы веб-разработки</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Прогресс: 60%</span>
                        <span>•</span>
                        <span>6 из 10 уроков</span>
                      </div>
                    </div>
                    <Link
                      href="/courses/1"
                      className="text-blue-600 hover:text-blue-700 font-medium">
                      Продолжить
                    </Link>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">Python для начинающих</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Прогресс: 30%</span>
                        <span>•</span>
                        <span>3 из 10 уроков</span>
                      </div>
                    </div>
                    <Link
                      href="/courses/2"
                      className="text-blue-600 hover:text-blue-700 font-medium">
                      Продолжить
                    </Link>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "30%" }}></div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        React и современный JavaScript
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Прогресс: 80%</span>
                        <span>•</span>
                        <span>8 из 10 уроков</span>
                      </div>
                    </div>
                    <Link
                      href="/courses/4"
                      className="text-blue-600 hover:text-blue-700 font-medium">
                      Продолжить
                    </Link>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "80%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-800">Достижения</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">Первые шаги</p>
                  <p className="text-xs text-gray-500 mt-1">Завершите первый урок</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-300">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">Стрелок</p>
                  <p className="text-xs text-gray-500 mt-1">Завершите 5 курсов</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">Ученик</p>
                  <p className="text-xs text-gray-500 mt-1">Изучите 10 уроков</p>
                </div>
                <div className="text-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300 opacity-50">
                  <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-600">Мастер</p>
                  <p className="text-xs text-gray-400 mt-1">Завершите 20 курсов</p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Настройки
              </h2>
              <div className="space-y-4">
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Редактировать профиль
                </button>
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Изменить пароль
                </button>
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Уведомления
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
