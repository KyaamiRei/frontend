import React from "react";
import Link from "next/link";
import { Calendar, Clock, Users, Heart } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { useFavorites } from "@/contexts/FavoritesContext";

interface WebinarCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: Date;
  duration: string;
  participants: number;
  isLive?: boolean;
}

const WebinarCard: React.FC<WebinarCardProps> = ({
  id,
  title,
  description,
  instructor,
  date,
  duration,
  participants,
  isLive = false,
}) => {
  const { isWebinarFavorite, toggleWebinarFavorite } = useFavorites();
  const isFavorite = isWebinarFavorite(id);
  const isUpcoming = date > new Date();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWebinarFavorite(id);
  };

  return (
    <Link href={`/webinars/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-blue-500 relative">
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition z-10">
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-800 flex-1 pr-8">{title}</h3>
            {isLive && (
              <span className="ml-2 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse">
                LIVE
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          <p className="text-sm text-gray-500 mb-4">Преподаватель: {instructor}</p>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{format(date, "d MMMM yyyy, HH:mm", { locale: ru })}</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{participants} участников</span>
              </div>
            </div>
          </div>

          {isUpcoming && !isLive && (
            <div className="mt-4 pt-4 border-t">
              <span className="text-sm text-blue-600 font-medium">Регистрация открыта</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default WebinarCard;
