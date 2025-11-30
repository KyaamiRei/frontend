import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useWebinars } from "@/contexts/WebinarsContext";
import { Calendar, Clock, Users, Video, MessageCircle, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";

export default function WebinarDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { getWebinarById } = useWebinars();
  const [chatMessage, setChatMessage] = useState("");

  const webinar = id ? getWebinarById(id as string) : undefined;
  const now = new Date();
  const isUpcoming = webinar && webinar.date > now;
  const isLive = webinar && Math.abs(webinar.date.getTime() - now.getTime()) < 2 * 60 * 60 * 1000;

  if (!webinar) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Вебинар не найден</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{webinar.title} - EduPlatform</title>
        <meta
          name="description"
          content={webinar.description}
        />
      </Head>
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Webinar Header */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  {isLive && (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full animate-pulse">
                        ИДЕТ ПРЯМОЙ ЭФИР
                      </span>
                    </div>
                  )}
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{webinar.title}</h1>
                  <p className="text-lg text-gray-600 mb-6">{webinar.description}</p>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{format(webinar.date, "d MMMM yyyy, HH:mm", { locale: ru })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{webinar.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>{webinar.participants} участников</span>
                    </div>
                  </div>

                  {isUpcoming && (
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                      Записаться на вебинар
                    </button>
                  )}
                  {isLive && (
                    <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                      Присоединиться к трансляции
                    </button>
                  )}
                </div>

                {/* Video Player */}
                <div className="bg-black rounded-lg shadow-md aspect-video flex items-center justify-center">
                  {isLive ? (
                    <div className="text-white text-center">
                      <Video className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl">Прямая трансляция</p>
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <Video className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl">
                        Трансляция начнется {format(webinar.date, "d MMMM в HH:mm", { locale: ru })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">О вебинаре</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">{webinar.fullDescription}</p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Темы вебинара:</h3>
                  <ul className="space-y-2">
                    {webinar.topics.map((topic: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start text-gray-600">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructor */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">О преподавателе</h2>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-blue-600">
                        {webinar.instructor.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {webinar.instructor}
                      </h3>
                      <p className="text-gray-600">{webinar.instructorBio}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Chat */}
                {(isLive || isUpcoming) && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Чат
                    </h3>
                    <div className="h-64 overflow-y-auto mb-4 space-y-2">
                      <div className="text-sm text-gray-500 text-center py-4">
                        {isUpcoming
                          ? "Чат откроется во время трансляции"
                          : "Сообщения появятся здесь"}
                      </div>
                    </div>
                    {isLive && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Написать сообщение..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                          Отправить
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Share */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Share2 className="w-5 h-5 mr-2" />
                    Поделиться
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      Копировать ссылку
                    </button>
                    <button className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                      Поделиться в соцсетях
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
