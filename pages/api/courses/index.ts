import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const courses = await prisma.course.findMany({
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: {
              favorites: true,
              enrollments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const formattedCourses = courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        fullDescription: course.fullDescription,
        instructor: course.instructor,
        duration: course.duration,
        students: course.students,
        rating: course.rating,
        category: course.category,
        price: course.price,
        image: course.image,
        lessons: course.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          completed: false,
        })),
        reviews: course.reviews.map((review) => ({
          id: review.id,
          author: review.user.name,
          rating: review.rating,
          date: review.createdAt,
          text: review.text,
        })),
      }));

      res.status(200).json(formattedCourses);
    } catch (error) {
      console.error("Ошибка получения курсов:", error);
      res.status(500).json({ error: "Ошибка получения курсов" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        title,
        description,
        fullDescription,
        instructor,
        duration,
        category,
        price,
        image,
        lessons,
      } = req.body;

      const course = await prisma.course.create({
        data: {
          title,
          description,
          fullDescription,
          instructor,
          duration,
          category,
          price: price || 0,
          image,
          lessons: lessons
            ? {
                create: lessons.map((lesson: any, index: number) => ({
                  title: lesson.title,
                  duration: lesson.duration,
                  order: index + 1,
                })),
              }
            : undefined,
        },
        include: {
          lessons: true,
        },
      });

      res.status(201).json({
        id: course.id,
        title: course.title,
        description: course.description,
        fullDescription: course.fullDescription,
        instructor: course.instructor,
        duration: course.duration,
        students: course.students,
        rating: course.rating,
        category: course.category,
        price: course.price,
        image: course.image,
        lessons: course.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          completed: false,
        })),
      });
    } catch (error) {
      console.error("Ошибка создания курса:", error);
      res.status(500).json({ error: "Ошибка создания курса" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
