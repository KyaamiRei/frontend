import React from "react";
import Link from "next/link";
import { Star, Users, Clock, Heart, Trash2 } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses } from "@/contexts/CoursesContext";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  image?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  instructor,
  rating,
  students,
  duration,
  price,
  image,
}) => {
  const { isCourseFavorite, toggleCourseFavorite } = useFavorites();
  const { user } = useAuth();
  const { deleteCourse } = useCourses();
  const isFavorite = isCourseFavorite(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCourseFavorite(id);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить этот курс?")) {
      try {
        await deleteCourse(id);
        alert("Курс успешно удален");
      } catch (error) {
        alert("Ошибка при удалении курса");
      }
    }
  };

  return (
    <Link href={`/courses/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-blue-500 relative">
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition z-10">
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          <p className="text-sm text-gray-500 mb-4">Преподаватель: {instructor}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-lg font-semibold">{rating}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{price} ₽</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{students} студентов</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>

          {user && (user.role === "ADMIN" || user.role === "TEACHER") && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={handleDeleteClick}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">
                <Trash2 className="w-4 h-4" />
                <span>Удалить курс</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
