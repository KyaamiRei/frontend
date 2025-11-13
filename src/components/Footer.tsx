import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-6 h-6" />
              <span className="text-xl font-bold">EduPlatform</span>
            </div>
            <p className="text-gray-400">
              Платформа для онлайн-обучения и вебинаров. Получите качественное образование в удобном
              формате.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="text-gray-400 hover:text-white transition">
                  Курсы
                </Link>
              </li>
              <li>
                <Link
                  href="/webinars"
                  className="text-gray-400 hover:text-white transition">
                  Вебинары
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition">
                  О нас
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@eduplatform.ru</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+7 (800) 123-45-67</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2024 EduPlatform. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
