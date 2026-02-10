import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { useCourses } from "@/contexts/CoursesContext";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LessonDetail() {
  const router = useRouter();
  const { id, lessonId } = router.query;
  const { getCourseById } = useCourses();
  const { user, isAuthenticated } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchLesson = async () => {
      if (!id || !lessonId) {
        setIsLoading(false);
        return;
      }

      try {
        // Получаем курс
        const courseData = getCourseById(id as string);
        if (!courseData) {
          setIsLoading(false);
          return;
        }
        setCourse(courseData);

        // Находим урок в курсе
        const lessonData = courseData.lessons?.find((l: any) => l.id === lessonId);
        if (lessonData) {
          setLesson(lessonData);
        }
      } catch (error) {
        console.error("Ошибка загрузки урока:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [router.isReady, id, lessonId, getCourseById]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Загрузка...</p>
        </div>
      </Layout>
    );
  }

  if (!course || !lesson) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Урок не найден</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{lesson.title} - {course.title} - EduPlatform</title>
        <meta name="description" content={`Урок: ${lesson.title}`} />
      </Head>
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            {/* Navigation */}
            <div className="mb-6">
              <Link
                href={`/courses/${id}`}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                <ArrowLeft className="w-5 h-5" />
                <span>Вернуться к курсу</span>
              </Link>
            </div>

            {/* Lesson Header */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{lesson.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{lesson.duration}</span>
                </div>
                <div>
                  Курс: <span className="font-semibold">{course.title}</span>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="prose max-w-none">
                {lesson.content ? (
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {lesson.content}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Содержание урока пока не добавлено.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
