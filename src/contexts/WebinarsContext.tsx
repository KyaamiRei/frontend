import React, { createContext, useContext, useState, useEffect } from "react";
import type { Webinar } from "@/types";

interface WebinarsContextType {
  webinars: Webinar[];
  isLoading: boolean;
  addWebinar: (webinar: Omit<Webinar, "id" | "participants">) => Promise<Webinar>;
  updateWebinar: (id: string, webinar: Partial<Webinar>) => Promise<void>;
  deleteWebinar: (id: string) => Promise<void>;
  getWebinarById: (id: string) => Webinar | undefined;
  refreshWebinars: () => Promise<void>;
}

const WebinarsContext = createContext<WebinarsContextType | undefined>(undefined);

export const WebinarsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка вебинаров из API
  const fetchWebinars = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/webinars");
      if (!response.ok) {
        throw new Error("Ошибка загрузки вебинаров");
      }
      const data = await response.json();
      // Преобразуем даты
      const webinarsWithDates = data.map((webinar: Webinar) => ({
        ...webinar,
        date: new Date(webinar.date),
      }));
      setWebinars(webinarsWithDates);
    } catch (error) {
      console.error("Ошибка загрузки вебинаров:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  const addWebinar = async (
    webinarData: Omit<Webinar, "id" | "participants">,
  ): Promise<Webinar> => {
    try {
      const response = await fetch("/api/webinars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webinarData),
      });

      if (!response.ok) {
        throw new Error("Ошибка создания вебинара");
      }

      const newWebinar = await response.json();
      const webinarWithDate = {
        ...newWebinar,
        date: new Date(newWebinar.date),
      };
      setWebinars((prev) => [...prev, webinarWithDate]);
      return webinarWithDate;
    } catch (error) {
      console.error("Ошибка создания вебинара:", error);
      throw error;
    }
  };

  const updateWebinar = async (id: string, webinarData: Partial<Webinar>) => {
    try {
      const response = await fetch(`/api/webinars/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webinarData),
      });

      if (!response.ok) {
        throw new Error("Ошибка обновления вебинара");
      }

      const updatedWebinar = await response.json();
      const webinarWithDate = {
        ...updatedWebinar,
        date: new Date(updatedWebinar.date),
      };
      setWebinars((prev) => prev.map((webinar) => (webinar.id === id ? webinarWithDate : webinar)));
    } catch (error) {
      console.error("Ошибка обновления вебинара:", error);
      throw error;
    }
  };

  const deleteWebinar = async (id: string) => {
    try {
      const response = await fetch(`/api/webinars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ошибка удаления вебинара");
      }

      setWebinars((prev) => prev.filter((webinar) => webinar.id !== id));
    } catch (error) {
      console.error("Ошибка удаления вебинара:", error);
      throw error;
    }
  };

  const getWebinarById = (id: string): Webinar | undefined => {
    return webinars.find((webinar) => webinar.id === id);
  };

  const refreshWebinars = async () => {
    await fetchWebinars();
  };

  return (
    <WebinarsContext.Provider
      value={{
        webinars,
        isLoading,
        addWebinar,
        updateWebinar,
        deleteWebinar,
        getWebinarById,
        refreshWebinars,
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
