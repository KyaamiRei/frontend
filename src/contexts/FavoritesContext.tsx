import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favoriteCourses: string[];
  favoriteWebinars: string[];
  isLoading: boolean;
  toggleCourseFavorite: (courseId: string) => Promise<void>;
  toggleWebinarFavorite: (webinarId: string) => Promise<void>;
  isCourseFavorite: (courseId: string) => boolean;
  isWebinarFavorite: (webinarId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favoriteCourses, setFavoriteCourses] = useState<string[]>([]);
  const [favoriteWebinars, setFavoriteWebinars] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка избранного из API
  const fetchFavorites = async () => {
    if (!user?.id) {
      setFavoriteCourses([]);
      setFavoriteWebinars([]);
      return;
    }

    try {
      setIsLoading(true);
      const [coursesResponse, webinarsResponse] = await Promise.all([
        fetch(`/api/favorites/courses?userId=${user.id}`),
        fetch(`/api/favorites/webinars?userId=${user.id}`),
      ]);

      if (coursesResponse.ok) {
        const courses = await coursesResponse.json();
        setFavoriteCourses(courses);
      }

      if (webinarsResponse.ok) {
        const webinars = await webinarsResponse.json();
        setFavoriteWebinars(webinars);
      }
    } catch (error) {
      console.error("Ошибка загрузки избранного:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  const toggleCourseFavorite = async (courseId: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/favorites/courses?userId=${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        const { isFavorite } = await response.json();
        setFavoriteCourses((prev) =>
          isFavorite
            ? [...prev, courseId]
            : prev.filter((id) => id !== courseId)
        );
      }
    } catch (error) {
      console.error("Ошибка обновления избранного курса:", error);
    }
  };

  const toggleWebinarFavorite = async (webinarId: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/favorites/webinars?userId=${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ webinarId }),
      });

      if (response.ok) {
        const { isFavorite } = await response.json();
        setFavoriteWebinars((prev) =>
          isFavorite
            ? [...prev, webinarId]
            : prev.filter((id) => id !== webinarId)
        );
      }
    } catch (error) {
      console.error("Ошибка обновления избранного вебинара:", error);
    }
  };

  const isCourseFavorite = (courseId: string) => favoriteCourses.includes(courseId);
  const isWebinarFavorite = (webinarId: string) => favoriteWebinars.includes(webinarId);

  const refreshFavorites = async () => {
    await fetchFavorites();
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteCourses,
        favoriteWebinars,
        isLoading,
        toggleCourseFavorite,
        toggleWebinarFavorite,
        isCourseFavorite,
        isWebinarFavorite,
        refreshFavorites,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};

