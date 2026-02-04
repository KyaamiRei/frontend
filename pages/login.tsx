import React, { useState, FormEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    // Уже авторизован – отправляем в профиль
    if (typeof window !== "undefined") {
      router.replace("/profile");
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const ok = await login(email, password);
    if (!ok) {
      setError("Неверные данные или слишком короткий пароль (мин. 6 символов).");
      return;
    }

    // Проверяем, прошел ли пользователь тест интересов
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (!user.hasCompletedTest) {
        router.push("/interest-test");
        return;
      }
    }

    // Получаем redirect из query параметров, если есть
    const redirect = router.query.redirect as string;
    router.push(redirect || "/profile");
  };

  return (
    <>
      <Head>
        <title>Вход - EduPlatform</title>
        <meta
          name="description"
          content="Вход в аккаунт EduPlatform"
        />
      </Head>
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Вход в аккаунт</h1>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <form
              className="space-y-4"
              onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Минимум 6 символов"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
                {isLoading ? "Входим..." : "Войти"}
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4 text-center">
              Нет аккаунта?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium">
                Зарегистрироваться
              </a>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
