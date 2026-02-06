import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Layout } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { Download, FileSpreadsheet, AlertCircle, Users, BookOpen, TrendingUp } from "lucide-react";

interface StudentResult {
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  instructor: string;
  duration: string;
  progress: number;
  enrollmentDate: string;
  lastUpdate: string;
}

export default function StudentsResultsPage() {
  const router = useRouter();
  const { user, isAdmin, isTeacher, isLoading: authLoading } = useAuth();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin && !isTeacher) {
      router.replace("/");
    }
  }, [authLoading, isAdmin, isTeacher, router]);

  useEffect(() => {
    if ((isAdmin || isTeacher) && user) {
      fetchResults();
    }
  }, [isAdmin, isTeacher, user]);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/students-results?userId=${user?.id}&role=${user?.role}`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки результатов");
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Ошибка загрузки результатов:", error);
      setError("Не удалось загрузить результаты учеников");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) {
      alert("Нет данных для экспорта");
      return;
    }

    // Заголовки CSV
    const headers = [
      "ID ученика",
      "Имя ученика",
      "Email ученика",
      "ID курса",
      "Название курса",
      "Категория",
      "Преподаватель",
      "Длительность",
      "Прогресс (%)",
      "Дата записи",
      "Последнее обновление",
    ];

    // Преобразуем данные в CSV формат
    const csvRows = [
      headers.join(","),
      ...results.map((result) =>
        [
          result.studentId,
          `"${result.studentName}"`,
          result.studentEmail,
          result.courseId,
          `"${result.courseTitle}"`,
          `"${result.courseCategory}"`,
          `"${result.instructor}"`,
          `"${result.duration}"`,
          result.progress,
          new Date(result.enrollmentDate).toLocaleDateString("ru-RU"),
          new Date(result.lastUpdate).toLocaleDateString("ru-RU"),
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    
    // Добавляем BOM для корректного отображения кириллицы в Excel
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `results_students_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Статистика
  const totalStudents = new Set(results.map((r) => r.studentId)).size;
  const totalCourses = new Set(results.map((r) => r.courseId)).size;
  const averageProgress =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.progress, 0) / results.length)
      : 0;

  if (authLoading || (!isAdmin && !isTeacher)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Доступ запрещен. Только администраторы и учителя могут просматривать эту страницу.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Результаты учеников - EduPlatform</title>
        <meta
          name="description"
          content="Просмотр и экспорт результатов учеников"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                  <FileSpreadsheet className="w-8 h-8 mr-3" />
                  Результаты учеников
                </h1>
                <p className="text-gray-600">Просмотр и экспорт результатов прохождения курсов</p>
              </div>
              <button
                onClick={exportToCSV}
                disabled={isLoading || results.length === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <Download className="w-5 h-5" />
                <span>Экспорт в CSV</span>
              </button>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Всего учеников</p>
                  <p className="text-3xl font-bold text-gray-800">{totalStudents}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Активных курсов</p>
                  <p className="text-3xl font-bold text-gray-800">{totalCourses}</p>
                </div>
                <BookOpen className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Средний прогресс</p>
                  <p className="text-3xl font-bold text-gray-800">{averageProgress}%</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600" />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Загрузка результатов...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Нет данных для отображения</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ученик
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Курс
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Категория
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Преподаватель
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Прогресс
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата записи
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result, index) => (
                      <tr
                        key={`${result.studentId}-${result.courseId}-${index}`}
                        className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{result.studentEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{result.courseTitle}</div>
                          <div className="text-sm text-gray-500">{result.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {result.courseCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{result.instructor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ minWidth: "100px" }}>
                              <div
                                className={`h-2 rounded-full ${
                                  result.progress >= 100
                                    ? "bg-green-600"
                                    : result.progress >= 50
                                    ? "bg-blue-600"
                                    : "bg-yellow-600"
                                }`}
                                style={{ width: `${result.progress}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{result.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(result.enrollmentDate).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
