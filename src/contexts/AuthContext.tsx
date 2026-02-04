import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка пользователя из localStorage при монтировании
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setIsLoading(false);
        return false;
      }

      const userData = await response.json();
      // Убеждаемся, что interests и hasCompletedTest присутствуют
      const userWithInterests = {
        ...userData,
        interests: userData.interests || [],
        hasCompletedTest: userData.hasCompletedTest || false,
      };
      setUser(userWithInterests);
      localStorage.setItem("user", JSON.stringify(userWithInterests));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Ошибка входа:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        setIsLoading(false);
        return false;
      }

      const userData = await response.json();
      // Убеждаемся, что interests и hasCompletedTest присутствуют
      const userWithInterests = {
        ...userData,
        interests: userData.interests || [],
        hasCompletedTest: userData.hasCompletedTest || false,
      };
      setUser(userWithInterests);
      localStorage.setItem("user", JSON.stringify(userWithInterests));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("favoriteCourses");
    localStorage.removeItem("favoriteWebinars");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isTeacher: user?.role === "TEACHER",
        isStudent: user?.role === "STUDENT",
        login,
        register,
        logout,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
