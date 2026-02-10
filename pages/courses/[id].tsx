import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { useCourses } from "@/contexts/CoursesContext";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Users, Star, Play, CheckCircle, BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface Enrollment {
  enrolled: boolean;
  progress?: number;
  course?: {
    totalLessons?: number;
  };
}

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { getCourseById, addReview } = useCourses();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "reviews">("overview");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [courseStudents, setCourseStudents] = useState<number | null>(null);
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [isDeletingLesson, setIsDeletingLesson] = useState<string | null>(null);

  const course = id ? getCourseById(id as string) : undefined;

  // Проверяем запись на курс при загрузке
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!id || !user?.id) {
        setIsCheckingEnrollment(false);
        return;
      }

      try {
        const response = await fetch(`/api/enrollments/check?userId=${user.id}&courseId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setEnrollment(data);
          if (data.enrolled && course) {
            setCourseStudents(course.students);
          }
        }
      } catch (error) {
        console.error("Ошибка проверки записи на курс:", error);
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    if (course && user?.id) {
      setCourseStudents(course.students);
      checkEnrollment();
    } else {
      setIsCheckingEnrollment(false);
      if (course) {
        setCourseStudents(course.students);
      }
    }
  }, [id, user?.id, course]);

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/login?redirect=/courses/${id}`);
      return;
    }

    if (!id) return;

    setIsEnrolling(true);
    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          courseId: id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEnrollment({ enrolled: true, progress: 0, course: data.course });
        const newStudentsCount = (courseStudents !== null ? courseStudents : course?.students || 0) + 1;
        setCourseStudents(newStudentsCount);
        // Обновляем курс в контексте
        if (course) {
          course.students = newStudentsCount;
        }
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при записи на курс");
      }
    } catch (error) {
      console.error("Ошибка записи на курс:", error);
      alert("Ошибка при записи на курс");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleAddLesson = async () => {
    if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
      alert("У вас нет прав для добавления уроков");
      return;
    }

    if (!newLessonTitle.trim() || !newLessonDuration.trim() || !id) return;

    setIsAddingLesson(true);
    try {
      const response = await fetch(`/api/courses/${id}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessons: [{
            title: newLessonTitle.trim(),
            duration: newLessonDuration.trim(),
            content: newLessonContent.trim(),
          }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Обновляем курс в контексте
        if (course && course.lessons) {
          course.lessons = [...course.lessons, ...data.lessons];
        }
        setNewLessonTitle("");
        setNewLessonDuration("");
        setShowAddLessonForm(false);
        alert("Урок добавлен успешно");
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при добавлении урока");
      }
    } catch (error) {
      console.error("Ошибка добавления урока:", error);
      alert("Ошибка при добавлении урока");
    } finally {
      setIsAddingLesson(false);
    }
  };

  const handleEditLesson = async () => {
    if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
      alert("У вас нет прав для редактирования уроков");
      return;
    }

    if (!editingLessonId || !newLessonTitle.trim() || !newLessonDuration.trim() || !id) return;

    setIsAddingLesson(true);
    try {
      const response = await fetch(`/api/courses/${id}/lessons/${editingLessonId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newLessonTitle.trim(),
          duration: newLessonDuration.trim(),
          content: newLessonContent.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Обновляем урок в контексте
        if (course && course.lessons) {
          const lessonIndex = course.lessons.findIndex((l: any) => l.id === editingLessonId);
          if (lessonIndex !== -1) {
            course.lessons = [
              ...course.lessons.slice(0, lessonIndex),
              data.lesson,
              ...course.lessons.slice(lessonIndex + 1)
            ];
          }
        }
        setNewLessonTitle("");
        setNewLessonDuration("");
        setNewLessonContent("");
        setShowAddLessonForm(false);
        setEditingLessonId(null);
        alert("Урок обновлен успешно");
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при обновлении урока");
      }
    } catch (error) {
      console.error("Ошибка обновления урока:", error);
      alert("Ошибка при обновлении урока");
    } finally {
      setIsAddingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
      alert("У вас нет прав для удаления уроков");
      return;
    }

    if (!confirm("Вы уверены, что хотите удалить этот урок?")) return;

    setIsDeletingLesson(lessonId);
    try {
      const response = await fetch(`/api/courses/${id}/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Удаляем урок из контекста
        if (course && course.lessons) {
          course.lessons = course.lessons.filter((l: any) => l.id !== lessonId);
        }
        alert("Урок удален успешно");
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при удалении урока");
      }
    } catch (error) {
      console.error("Ошибка удаления урока:", error);
      alert("Ошибка при удалении урока");
    } finally {
      setIsDeletingLesson(null);
    }
  };

  const startEditingLesson = (lesson: any) => {
    setEditingLessonId(lesson.id);
    setNewLessonTitle(lesson.title);
    setNewLessonDuration(lesson.duration);
    setNewLessonContent(lesson.content || "");
    setShowAddLessonForm(true);
  };

  const startAddingLesson = () => {
    setEditingLessonId(null);
    setNewLessonTitle("");
    setNewLessonDuration("");
    setNewLessonContent("");
    setShowAddLessonForm(true);
  };

  const cancelEditing = () => {
    setEditingLessonId(null);
    setNewLessonTitle("");
    setNewLessonDuration("");
    setNewLessonContent("");
    setShowAddLessonForm(false);
  };

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
                  <span>{courseStudents !== null ? courseStudents : course.students} студентов</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="text-gray-600">
                  Преподаватель: <span className="font-semibold">{course.instructor}</span>
                </div>
              </div>

              {isCheckingEnrollment ? (
                <button
                  disabled
                  className="bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold cursor-not-allowed">
                  Загрузка...
                </button>
              ) : enrollment?.enrolled ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    <span>Вы записаны на этот курс</span>
                  </div>
                  {enrollment.progress !== undefined && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Прогресс прохождения</span>
                        <span className="font-semibold">{Math.round(enrollment.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            enrollment.progress >= 100 ? "bg-green-600" : "bg-blue-600"
                          }`}
                          style={{ width: `${enrollment.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                  <Link
                    href="/profile"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Перейти к моим курсам
                  </Link>
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-gray-600">Для записи на курс необходимо войти в систему</p>
                  <Link
                    href={`/login?redirect=/courses/${id}`}
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Войти
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isEnrolling ? "Записываем..." : "Записаться на курс"}
                </button>
              )}
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
                    Уроки ({course.lessons?.length ?? 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`py-4 px-2 border-b-2 font-semibold transition ${
                      activeTab === "reviews"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-800"
                    }`}>
                    Отзывы ({course.reviews?.length || 0})
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
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Программа курса</h2>
                      {!showAddLessonForm && user && (user.role === "TEACHER" || user.role === "ADMIN") && (
                        <button
                          onClick={() => setShowAddLessonForm(true)}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition">
                          <Plus className="w-5 h-5" />
                          <span>Добавить урок</span>
                        </button>
                      )}
                    </div>

                    {showAddLessonForm && (
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{editingLessonId ? "Редактировать урок" : "Добавить новый урок"}</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Название урока
                            </label>
                            <input
                              type="text"
                              value={newLessonTitle}
                              onChange={(e) => setNewLessonTitle(e.target.value)}
                              placeholder="Введите название урока"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Длительность
                            </label>
                            <input
                              type="text"
                              value={newLessonDuration}
                              onChange={(e) => setNewLessonDuration(e.target.value)}
                              placeholder="Например: 30 мин"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Содержание урока
                            </label>
                            <textarea
                              value={newLessonContent}
                              onChange={(e) => setNewLessonContent(e.target.value)}
                              placeholder="Введите содержание урока..."
                              rows={6}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={editingLessonId ? handleEditLesson : handleAddLesson}
                              disabled={isAddingLesson || !newLessonTitle.trim() || !newLessonDuration.trim()}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                              {isAddingLesson ? (editingLessonId ? "Обновляем..." : "Добавляем...") : (editingLessonId ? "Обновить урок" : "Добавить урок")}
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition">
                              Отмена
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {course.lessons?.map((lesson: any, index: number) => (
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
                          <div className="flex items-center space-x-2">
                            {user && (user.role === "TEACHER" || user.role === "ADMIN") && (
                              <>
                                <button
                                  onClick={() => startEditingLesson(lesson)}
                                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium">
                                  <Edit className="w-4 h-4" />
                                  <span>Редактировать</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  disabled={isDeletingLesson === lesson.id}
                                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium disabled:opacity-50">
                                  <Trash2 className="w-4 h-4" />
                                  <span>{isDeletingLesson === lesson.id ? "Удаляем..." : "Удалить"}</span>
                                </button>
                              </>
                            )}
                            <Link
                              href={`/courses/${id}/lessons/${lesson.id}`}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                              <Play className="w-5 h-5" />
                              <span>Смотреть</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Отзывы студентов</h2>

                    {/* Add Review Form */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Оставить отзыв</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ваша оценка
                          </label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setReviewRating(star)}
                                type="button">
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= reviewRating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ваш отзыв
                          </label>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Поделитесь своими впечатлениями о курсе..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={async () => {
                            if (!user) {
                              alert("Необходимо войти в систему для добавления отзыва");
                              return;
                            }
                            if (reviewText.trim() && id) {
                              setIsSubmittingReview(true);
                              try {
                                await addReview(id as string, user.id, reviewRating, reviewText);
                                setReviewText("");
                                setReviewRating(5);
                              } catch (error) {
                                alert("Ошибка при добавлении отзыва");
                              } finally {
                                setIsSubmittingReview(false);
                              }
                            }
                          }}
                          disabled={isSubmittingReview || !reviewText.trim()}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                          {isSubmittingReview ? "Отправка..." : "Отправить отзыв"}
                        </button>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {course.reviews?.map((review: any) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-800">{review.author}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString("ru-RU", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-5 h-5 ${
                                    star <= review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{review.text}</p>
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
