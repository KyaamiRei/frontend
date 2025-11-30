import React, { createContext, useContext, useState, useEffect } from "react";

export interface Webinar {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  instructor: string;
  instructorBio?: string;
  date: Date;
  duration: string;
  participants: number;
  isLive?: boolean;
  topics?: string[];
  category?: string;
}

interface WebinarsContextType {
  webinars: Webinar[];
  addWebinar: (webinar: Omit<Webinar, "id" | "participants">) => Webinar;
  updateWebinar: (id: string, webinar: Partial<Webinar>) => void;
  deleteWebinar: (id: string) => void;
  getWebinarById: (id: string) => Webinar | undefined;
}

const WebinarsContext = createContext<WebinarsContextType | undefined>(undefined);

// Начальные данные
const initialWebinars: Webinar[] = [
  {
    id: "1",
    title: "Искусственный интеллект в образовании",
    description: "Обсудим применение AI в современном образовании и перспективы развития.",
    fullDescription:
      "На этом вебинаре мы рассмотрим, как искусственный интеллект меняет образовательный ландшафт. Вы узнаете о последних разработках в области AI для образования, практических примерах внедрения и будущих трендах.",
    instructor: "Дмитрий Волков",
    instructorBio:
      "Эксперт в области образовательных технологий с 15-летним опытом. Автор более 50 научных публикаций.",
    date: new Date("2024-12-20T18:00:00"),
    duration: "1.5 часа",
    participants: 450,
    topics: [
      "Текущее состояние AI в образовании",
      "Практические кейсы внедрения",
      "Перспективы развития",
      "Вопросы и ответы",
    ],
  },
  {
    id: "2",
    title: "Цифровая трансформация школ",
    description: "Как внедрить цифровые технологии в образовательный процесс.",
    instructor: "Елена Новикова",
    date: new Date("2024-12-22T16:00:00"),
    duration: "2 часа",
    participants: 320,
  },
  {
    id: "3",
    title: "Онлайн-обучение: лучшие практики",
    description: "Эффективные методы организации онлайн-обучения для студентов.",
    instructor: "Анна Петрова",
    date: new Date("2024-12-25T14:00:00"),
    duration: "1.5 часа",
    participants: 280,
  },
  {
    id: "4",
    title: "Геймификация в образовании",
    description: "Как использовать игровые элементы для повышения мотивации студентов.",
    instructor: "Максим Соколов",
    date: new Date("2024-12-18T19:00:00"),
    duration: "2 часа",
    participants: 380,
    isLive: false,
  },
];

export const WebinarsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [webinars, setWebinars] = useState<Webinar[]>(initialWebinars);

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const savedWebinars = localStorage.getItem("webinars");
    if (savedWebinars) {
      try {
        const parsed = JSON.parse(savedWebinars);
        // Преобразуем даты
        const webinarsWithDates = parsed.map((webinar: Webinar) => ({
          ...webinar,
          date: new Date(webinar.date),
        }));
        setWebinars(webinarsWithDates);
      } catch (error) {
        console.error("Ошибка загрузки вебинаров:", error);
      }
    }
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("webinars", JSON.stringify(webinars));
  }, [webinars]);

  const addWebinar = (webinarData: Omit<Webinar, "id" | "participants">): Webinar => {
    const newWebinar: Webinar = {
      ...webinarData,
      id: Date.now().toString(),
      participants: 0,
    };
    setWebinars((prev) => [...prev, newWebinar]);
    return newWebinar;
  };

  const updateWebinar = (id: string, webinarData: Partial<Webinar>) => {
    setWebinars((prev) =>
      prev.map((webinar) => (webinar.id === id ? { ...webinar, ...webinarData } : webinar)),
    );
  };

  const deleteWebinar = (id: string) => {
    setWebinars((prev) => prev.filter((webinar) => webinar.id !== id));
  };

  const getWebinarById = (id: string): Webinar | undefined => {
    return webinars.find((webinar) => webinar.id === id);
  };

  return (
    <WebinarsContext.Provider
      value={{
        webinars,
        addWebinar,
        updateWebinar,
        deleteWebinar,
        getWebinarById,
      }}>
      {children}
    </WebinarsContext.Provider>
  );
};

export const useWebinars = () => {
  const context = useContext(WebinarsContext);
  if (!context) {
    throw new Error("useWebinars must be used within WebinarsProvider");
  }
  return context;
};
