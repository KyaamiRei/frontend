import React from "react";
import Head from "next/head";
import { Layout, CourseCard, WebinarCard } from "@/components";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCourses } from "@/contexts/CoursesContext";
import { useWebinars } from "@/contexts/WebinarsContext";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { favoriteCourses, favoriteWebinars } = useFavorites();
  const { courses } = useCourses();
  const { webinars } = useWebinars();

  const favoriteCoursesData = courses.filter((course) => favoriteCourses.includes(course.id));
  const favoriteWebinarsData = webinars.filter((webinar) => favoriteWebinars.includes(webinar.id));

  return (
    <>
      <Head>
        <title>Избранное - EduPlatform</title>
        <meta
          name="description"
          content="Ваши избранные курсы и вебинары"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-8">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-4xl font-bold text-gray-800">Избранное</h1>
          </div>

          {/* Favorite Courses */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Избранные курсы ({favoriteCoursesData.length})
            </h2>
            {favoriteCoursesData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteCoursesData.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">У вас пока нет избранных курсов</p>
                <p className="text-gray-400 text-sm mt-2">
                  Добавьте курсы в избранное, нажав на иконку сердца
                </p>
              </div>
            )}
          </section>

          {/* Favorite Webinars */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Избранные вебинары ({favoriteWebinarsData.length})
            </h2>
            {favoriteWebinarsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favoriteWebinarsData.map((webinar) => (
                  <WebinarCard
                    key={webinar.id}
                    {...webinar}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">У вас пока нет избранных вебинаров</p>
                <p className="text-gray-400 text-sm mt-2">
                  Добавьте вебинары в избранное, нажав на иконку сердца
                </p>
              </div>
            )}
          </section>
        </div>
      </Layout>
    </>
  );
}
