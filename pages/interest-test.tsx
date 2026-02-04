import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, CheckCircle } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Какая область программирования вас больше всего интересует?",
    options: ["Веб-разработка", "Мобильная разработка", "Базы данных", "Машинное обучение"],
    category: "Программирование",
  },
  {
    id: 2,
    question: "Какой уровень сложности вы предпочитаете?",
    options: ["Начинающий", "Средний", "Продвинутый", "Эксперт"],
    category: "Уровень",
  },
  {
    id: 3,
    question: "Что вас больше интересует в дизайне?",
    options: ["UI/UX дизайн", "Графический дизайн", "Веб-дизайн", "Не интересует"],
    category: "Дизайн",
  },
  {
    id: 4,
    question: "Какой формат обучения вам больше подходит?",
    options: ["Видео-уроки", "Интерактивные задания", "Веб-разработка", "Смешанный формат"],
    category: "Формат",
  },
  {
    id: 5,
    question: "Сколько времени вы готовы уделять обучению в неделю?",
    options: ["1-3 часа", "4-7 часов", "8-15 часов", "Более 15 часов"],
    category: "Время",
  },
];

export default function InterestTest() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Редирект, если не авторизован или уже прошел тест
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!isLoading && isAuthenticated && user?.hasCompletedTest) {
      router.replace("/");
      return;
    }
  }, [isLoading, isAuthenticated, user?.hasCompletedTest, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <p className="text-gray-600 text-lg">Загрузка...</p>
        </div>
      </Layout>
    );
  }

  const handleAnswer = (option: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: option });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Извлекаем категории из ответов
      const selectedInterests: string[] = [];
      Object.values(answers).forEach((answer) => {
        if (answer && !selectedInterests.includes(answer)) {
          selectedInterests.push(answer);
        }
      });

      const response = await fetch("/api/user/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          interests: selectedInterests,
        }),
      });

      if (response.ok) {
        // Обновляем пользователя в контексте
        const updatedUser = await response.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Обновляем состояние через перезагрузку страницы или обновление контекста
        window.location.href = "/";
      } else {
        alert("Ошибка при сохранении результатов теста");
      }
    } catch (error) {
      console.error("Ошибка сохранения результатов теста:", error);
      alert("Ошибка при сохранении результатов теста");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[questions[currentQuestion].id];
  const canProceed = currentAnswer !== undefined;

  return (
    <>
      <Head>
        <title>Тест интересов - EduPlatform</title>
        <meta
          name="description"
          content="Пройдите тест, чтобы мы могли подобрать для вас подходящие курсы"
        />
      </Head>
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Тест интересов</h1>
              <p className="text-gray-600">
                Ответьте на несколько вопросов, чтобы мы могли подобрать для вас подходящие курсы
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {questions[currentQuestion].question}
              </h2>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected = currentAnswer === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-800"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Назад
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <span>{currentQuestion === questions.length - 1 ? "Завершить" : "Далее"}</span>
                {currentQuestion < questions.length - 1 && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
