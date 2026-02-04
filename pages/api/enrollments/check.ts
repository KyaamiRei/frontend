import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { userId, courseId } = req.query;

      if (!userId || !courseId) {
        return res.status(400).json({ error: "userId и courseId обязательны" });
      }

      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: userId as string,
            courseId: courseId as string,
          },
        },
        include: {
          course: {
            include: {
              lessons: {
                orderBy: { order: "asc" },
              },
              _count: {
                select: {
                  lessons: true,
                },
              },
            },
          },
        },
      });

      if (!enrollment) {
        return res.status(200).json({ enrolled: false });
      }

      const formattedEnrollment = {
        enrolled: true,
        id: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        progress: enrollment.progress,
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title,
          description: enrollment.course.description,
          instructor: enrollment.course.instructor,
          duration: enrollment.course.duration,
          category: enrollment.course.category,
          rating: enrollment.course.rating,
          students: enrollment.course.students,
          lessons: enrollment.course.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            order: lesson.order,
          })),
          totalLessons: enrollment.course._count.lessons,
        },
      };

      res.status(200).json(formattedEnrollment);
    } catch (error) {
      console.error("Ошибка проверки записи на курс:", error);
      res.status(500).json({ error: "Ошибка проверки записи на курс" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
