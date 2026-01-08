import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { useCourses } from "@/contexts/CoursesContext";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const categories = [
  "Веб-разработка",
  "Программирование",
  "Дизайн",
  "Базы данных",
  "Мобильная разработка",
  "Другое",
];

export default function CreateCourse() {
  const router = useRouter();
  const { addCourse } = useCourses();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    instructor: user?.name || "",
    duration: "",
    category: "Веб-разработка",
    price: "0",
  });

  // Редирект, если не авторизован
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/courses/create");
    }
  }, [isAuthenticated, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Валидация
    if (!formData.title.trim()) {
      setError("Название курса обязательно");
      return;
    }
    if (!formData.description.trim()) {
      setError("Описание курса обязательно");
      return;
    }
    if (!formData.instructor.trim()) {
      setError("Имя преподавателя обязательно");
      return;
    }
    if (!formData.duration.trim()) {
      setError("Длительность курса обязательна");
      return;
    }

    setIsSubmitting(true);

    try {
      const newCourse = addCourse({
        title: formData.title.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim() || formData.description.trim(),
        instructor: formData.instructor.trim(),
        duration: formData.duration.trim(),
        category: formData.category,
        price: parseFloat(formData.price) || 0,
      });

      // Редирект на страницу созданного курса
      router.push(`/courses/${newCourse.id}`);
    } catch (err) {
      setError("Ошибка при создании курса. Попробуйте еще раз.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Загрузка...</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Создать курс - EduPlatform</title>
        <meta
          name="description"
          content="Создайте новый курс"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link
              href="/courses"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к курсам
            </Link>
            <div className="flex items-center space-x-3 mb-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">Создать новый курс</h1>
            </div>
            <p className="text-gray-600">Заполните форму ниже, чтобы создать новый курс</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2">
                Название курса <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: Основы веб-разработки"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2">
                Краткое описание <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Краткое описание курса (будет отображаться в каталоге)"
              />
            </div>

            <div>
              <label
                htmlFor="fullDescription"
                className="block text-sm font-medium text-gray-700 mb-2">
                Полное описание
              </label>
              <textarea
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Подробное описание курса, что студенты узнают, программа и т.д."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="instructor"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Преподаватель <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Имя преподавателя"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Категория <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Длительность <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: 40 часов"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Цена (₽)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">Оставьте 0 для бесплатного курса</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <Link
                href="/courses"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                Отмена
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <Save className="w-5 h-5" />
                <span>{isSubmitting ? "Создание..." : "Создать курс"}</span>
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
