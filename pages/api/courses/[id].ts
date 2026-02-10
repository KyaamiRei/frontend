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
          content: lesson.content,
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
      const { title, description, fullDescription, instructor, duration, category, price, image, lessons } =
        req.body;

      // Update course data
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

      // If lessons are provided, add them to the course
      if (lessons && Array.isArray(lessons)) {
        // Get the current max order for lessons in this course
        const maxOrderLesson = await prisma.lesson.findFirst({
          where: { courseId: id as string },
          orderBy: { order: 'desc' },
        });
        const nextOrder = maxOrderLesson ? maxOrderLesson.order + 1 : 1;

        // Create new lessons
        await prisma.lesson.createMany({
          data: lessons.map((lesson: any, index: number) => ({
            courseId: id as string,
            title: lesson.title,
            duration: lesson.duration,
            content: lesson.content,
            order: nextOrder + index,
          })),
        });
      }

      // Fetch the updated course with lessons
      const updatedCourse = await prisma.course.findUnique({
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

      res.status(200).json({
        id: updatedCourse!.id,
        title: updatedCourse!.title,
        description: updatedCourse!.description,
        fullDescription: updatedCourse!.fullDescription,
        instructor: updatedCourse!.instructor,
        duration: updatedCourse!.duration,
        students: updatedCourse!.students,
        rating: updatedCourse!.rating,
        category: updatedCourse!.category,
        price: updatedCourse!.price,
        image: updatedCourse!.image,
        lessons: updatedCourse!.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          content: lesson.content,
          completed: false,
        })),
        reviews: updatedCourse!.reviews.map((review) => ({
          id: review.id,
          author: review.user.name,
          rating: review.rating,
          date: review.createdAt,
          text: review.text,
        })),
      });
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
