import React from "react";
import Link from "next/link";
import { Clock, Users, Star } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  image?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  instructor,
  duration,
  students,
  rating,
  image,
}) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
              {title.charAt(0)}
            </div>
          )}
          <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          <p className="text-sm text-gray-500 mb-3">Преподаватель: {instructor}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{students} студентов</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
