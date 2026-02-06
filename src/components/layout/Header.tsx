import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, User, Menu, X, Heart, Bell, LogOut, LogIn, Shield, FileSpreadsheet } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { favoriteCourses, favoriteWebinars } = useFavorites();
  const { user, isAuthenticated, logout, isAdmin, isTeacher } = useAuth();
  const favoritesCount = favoriteCourses.length + favoriteWebinars.length;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">EduPlatform</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/courses"
              className="text-gray-700 hover:text-blue-600 transition">
              Курсы
            </Link>
            <Link
              href="/webinars"
              className="text-gray-700 hover:text-blue-600 transition">
              Вебинары
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition">
              О нас
            </Link>
            <Link
              href="/favorites"
              className="relative flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
              <Heart className="w-5 h-5" />
              <span>Избранное</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Link
              href="/notifications"
              className="relative flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
              <Bell className="w-5 h-5" />
              <span>Уведомления</span>
            </Link>
            {(isAdmin || isTeacher) && (
              <Link
                href="/admin/students-results"
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition">
                <FileSpreadsheet className="w-5 h-5" />
                <span>Результаты</span>
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin/users"
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition">
                <Shield className="w-5 h-5" />
                <span>Админ-панель</span>
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight">
                      {user?.name || "Пользователь"}
                    </span>
                    <span className="text-xs text-gray-500 leading-tight">{user?.email}</span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition text-sm">
                  <LogOut className="w-4 h-4" />
                  <span>Выйти</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
                  <LogIn className="w-5 h-5" />
                  <span>Войти</span>
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
                  Регистрация
                </Link>
              </div>
            )}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Меню">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                href="/courses"
                className="text-gray-700 hover:text-blue-600 transition">
                Курсы
              </Link>
              <Link
                href="/webinars"
                className="text-gray-700 hover:text-blue-600 transition">
                Вебинары
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition">
                О нас
              </Link>
              <Link
                href="/favorites"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
                <Heart className="w-5 h-5" />
                <span>Избранное {favoritesCount > 0 && `(${favoritesCount})`}</span>
              </Link>
              <Link
                href="/notifications"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
                <Bell className="w-5 h-5" />
                <span>Уведомления</span>
              </Link>
              {(isAdmin || isTeacher) && (
                <Link
                  href="/admin/students-results"
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition">
                  <FileSpreadsheet className="w-5 h-5" />
                  <span>Результаты</span>
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition">
                  <Shield className="w-5 h-5" />
                  <span>Админ-панель</span>
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
                    <User className="w-5 h-5" />
                    <span>Профиль</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition text-left">
                    <LogOut className="w-5 h-5" />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
                    <LogIn className="w-5 h-5" />
                    <span>Войти</span>
                  </Link>
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-700 font-medium">
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
