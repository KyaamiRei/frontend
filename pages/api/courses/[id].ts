import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const course = await prisma.course.findUnique({
        where: { id: id as string },
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
        },
      });

      if (!course) {
        return res.status(404).json({ error: "Курс не найден" });
      }

      res.status(200).json({
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
      });
    } catch (error) {
      console.error("Ошибка получения курса:", error);
      res.status(500).json({ error: "Ошибка получения курса" });
    }
  } else if (req.method === "PUT") {
    try {
      const { title, description, fullDescription, instructor, duration, category, price, image } =
        req.body;

      const course = await prisma.course.update({
        where: { id: id as string },
        data: {
          title,
          description,
          fullDescription,
          instructor,
          duration,
          category,
          price,
          image,
        },
      });

      res.status(200).json(course);
    } catch (error) {
      console.error("Ошибка обновления курса:", error);
      res.status(500).json({ error: "Ошибка обновления курса" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.course.delete({
        where: { id: id as string },
      });

      res.status(200).json({ message: "Курс удален" });
    } catch (error) {
      console.error("Ошибка удаления курса:", error);
      res.status(500).json({ error: "Ошибка удаления курса" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
