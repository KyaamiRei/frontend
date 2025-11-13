import React from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import { User, BookOpen, Video, Award, Settings } from "lucide-react";

export default function Profile() {
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
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Иван Иванов</h1>
                  <p className="text-gray-600">ivan.ivanov@example.com</p>
                  <p className="text-gray-500 text-sm mt-1">Студент с января 2024</p>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Мои курсы</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">Основы веб-разработки</h3>
                    <p className="text-sm text-gray-500">Прогресс: 60%</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Продолжить
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">Python для начинающих</h3>
                    <p className="text-sm text-gray-500">Прогресс: 30%</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Продолжить
                  </button>
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
