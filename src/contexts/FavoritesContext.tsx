import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoritesContextType {
  favoriteCourses: string[];
  favoriteWebinars: string[];
  toggleCourseFavorite: (courseId: string) => void;
  toggleWebinarFavorite: (webinarId: string) => void;
  isCourseFavorite: (courseId: string) => boolean;
  isWebinarFavorite: (webinarId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteCourses, setFavoriteCourses] = useState<string[]>([]);
  const [favoriteWebinars, setFavoriteWebinars] = useState<string[]>([]);

  // Загрузка избранного из localStorage при монтировании
  useEffect(() => {
    const savedCourses = localStorage.getItem("favoriteCourses");
    const savedWebinars = localStorage.getItem("favoriteWebinars");
    if (savedCourses) setFavoriteCourses(JSON.parse(savedCourses));
    if (savedWebinars) setFavoriteWebinars(JSON.parse(savedWebinars));
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("favoriteCourses", JSON.stringify(favoriteCourses));
  }, [favoriteCourses]);

  useEffect(() => {
    localStorage.setItem("favoriteWebinars", JSON.stringify(favoriteWebinars));
  }, [favoriteWebinars]);

  const toggleCourseFavorite = (courseId: string) => {
    setFavoriteCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const toggleWebinarFavorite = (webinarId: string) => {
    setFavoriteWebinars((prev) =>
      prev.includes(webinarId) ? prev.filter((id) => id !== webinarId) : [...prev, webinarId]
    );
  };

  const isCourseFavorite = (courseId: string) => favoriteCourses.includes(courseId);
  const isWebinarFavorite = (webinarId: string) => favoriteWebinars.includes(webinarId);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteCourses,
        favoriteWebinars,
        toggleCourseFavorite,
        toggleWebinarFavorite,
        isCourseFavorite,
        isWebinarFavorite,
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

