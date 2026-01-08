import React from "react";
import Head from "next/head";
import { Layout } from "@/components";
import { Target, Users, Award, Heart } from "lucide-react";

export default function About() {
  return (
    <>
      <Head>
        <title>О нас - EduPlatform</title>
        <meta
          name="description"
          content="О платформе EduPlatform"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">О нас</h1>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                EduPlatform — это современная платформа для онлайн-обучения, созданная специально
                для образовательных учреждений. Мы предоставляем инструменты для создания и
                проведения онлайн-курсов и вебинаров.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Наша миссия — сделать качественное образование доступным для всех, независимо от
                географического расположения и временных ограничений.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <Target className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Наша миссия</h3>
                <p className="text-gray-600">
                  Предоставить лучшие инструменты для онлайн-обучения и сделать образование
                  доступным для всех.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <Users className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Наша команда</h3>
                <p className="text-gray-600">
                  Опытные специалисты в области образования и технологий работают над улучшением
                  платформы каждый день.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <Award className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Качество</h3>
                <p className="text-gray-600">
                  Мы гарантируем высокое качество всех курсов и вебинаров на нашей платформе.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <Heart className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Поддержка</h3>
                <p className="text-gray-600">
                  Наша команда поддержки всегда готова помочь вам с любыми вопросами.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Присоединяйтесь к нам!</h2>
              <p className="text-gray-600 mb-6">
                Начните обучение уже сегодня или станьте преподавателем на нашей платформе.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/courses"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Начать обучение
                </a>
                <a
                  href="/contact"
                  className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                  Стать преподавателем
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
