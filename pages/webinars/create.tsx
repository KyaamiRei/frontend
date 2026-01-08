import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { useWebinars } from "@/contexts/WebinarsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Video, ArrowLeft, Save, Calendar } from "lucide-react";
import Link from "next/link";

const categories = ["Образование", "Технологии", "Бизнес", "Дизайн", "Программирование", "Другое"];

export default function CreateWebinar() {
  const router = useRouter();
  const { addWebinar } = useWebinars();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    instructor: user?.name || "",
    date: "",
    time: "",
    duration: "",
    category: "Образование",
  });

  // Редирект, если не авторизован
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/webinars/create");
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
      setError("Название вебинара обязательно");
      return;
    }
    if (!formData.description.trim()) {
      setError("Описание вебинара обязательно");
      return;
    }
    if (!formData.instructor.trim()) {
      setError("Имя преподавателя обязательно");
      return;
    }
    if (!formData.date || !formData.time) {
      setError("Дата и время вебинара обязательны");
      return;
    }
    if (!formData.duration.trim()) {
      setError("Длительность вебинара обязательна");
      return;
    }

    setIsSubmitting(true);

    try {
      // Объединяем дату и время
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      if (isNaN(dateTime.getTime())) {
        setError("Неверная дата или время");
        setIsSubmitting(false);
        return;
      }

      const newWebinar = addWebinar({
        title: formData.title.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim() || formData.description.trim(),
        instructor: formData.instructor.trim(),
        date: dateTime,
        duration: formData.duration.trim(),
        category: formData.category,
      });

      // Редирект на страницу созданного вебинара
      router.push(`/webinars/${newWebinar.id}`);
    } catch (err) {
      setError("Ошибка при создании вебинара. Попробуйте еще раз.");
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
        <title>Создать вебинар - EduPlatform</title>
        <meta
          name="description"
          content="Создайте новый вебинар"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link
              href="/webinars"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к вебинарам
            </Link>
            <div className="flex items-center space-x-3 mb-2">
              <Video className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-800">Создать новый вебинар</h1>
            </div>
            <p className="text-gray-600">Заполните форму ниже, чтобы создать новый вебинар</p>
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
                Название вебинара <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: Искусственный интеллект в образовании"
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
                placeholder="Краткое описание вебинара (будет отображаться в каталоге)"
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
                placeholder="Подробное описание вебинара, темы для обсуждения и т.д."
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
                  Категория
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Дата <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Время <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                  placeholder="Например: 1.5 часа"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <Link
                href="/webinars"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                Отмена
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <Save className="w-5 h-5" />
                <span>{isSubmitting ? "Создание..." : "Создать вебинар"}</span>
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
