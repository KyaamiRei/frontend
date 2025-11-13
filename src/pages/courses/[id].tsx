import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Clock, Users, Star, Play, CheckCircle, BookOpen } from "lucide-react";

// Моковые данные
const courseData: { [key: string]: any } = {
  "1": {
    title: "Основы веб-разработки",
    description: "Изучите HTML, CSS и JavaScript с нуля. Создайте свои первые веб-приложения.",
    fullDescription:
      "Этот курс предназначен для начинающих разработчиков, которые хотят освоить основы веб-разработки. Вы изучите HTML для структуры, CSS для стилизации и JavaScript для интерактивности. К концу курса вы сможете создавать полноценные веб-приложения.",
    instructor: "Иван Петров",
    duration: "40 часов",
    students: 1250,
    rating: 4.8,
    lessons: [
      { id: 1, title: "Введение в HTML", duration: "45 мин", completed: true },
      { id: 2, title: "Структура HTML документа", duration: "50 мин", completed: true },
      { id: 3, title: "Основы CSS", duration: "60 мин", completed: false },
      { id: 4, title: "Flexbox и Grid", duration: "70 мин", completed: false },
      { id: 5, title: "Введение в JavaScript", duration: "55 мин", completed: false },
      { id: 6, title: "DOM манипуляции", duration: "65 мин", completed: false },
    ],
  },
};

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<"overview" | "lessons">("overview");

  const course = courseData[id as string];

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Курс не найден</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{course.title} - EduPlatform</title>
        <meta
          name="description"
          content={course.description}
        />
      </Head>
      <Layout>
        <div className="bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{course.rating}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>{course.students} студентов</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="text-gray-600">
                  Преподаватель: <span className="font-semibold">{course.instructor}</span>
                </div>
              </div>

              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Записаться на курс
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b">
                <div className="flex space-x-4 px-8">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 px-2 border-b-2 font-semibold transition ${
                      activeTab === "overview"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-800"
                    }`}>
                    Описание
                  </button>
                  <button
                    onClick={() => setActiveTab("lessons")}
                    className={`py-4 px-2 border-b-2 font-semibold transition ${
                      activeTab === "lessons"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-800"
                    }`}>
                    Уроки ({course.lessons.length})
                  </button>
                </div>
              </div>

              <div className="p-8">
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">О курсе</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">{course.fullDescription}</p>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Чему вы научитесь:</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Создавать структурированные HTML документы</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Стилизовать веб-страницы с помощью CSS</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Добавлять интерактивность с JavaScript</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Работать с DOM и событиями</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === "lessons" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Программа курса</h2>
                    <div className="space-y-3">
                      {course.lessons.map((lesson: any, index: number) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex-shrink-0">
                              {lesson.completed ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">{index + 1}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                <Clock className="w-4 h-4" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                            <Play className="w-5 h-5" />
                            <span>Смотреть</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
