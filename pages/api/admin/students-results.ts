import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { userId, role } = req.query;

      if (!userId || typeof userId !== "string") {
        return res.status(401).json({ error: "Требуется авторизация" });
      }

      // Проверяем роль пользователя
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      if (user.role !== "ADMIN" && user.role !== "TEACHER") {
        return res.status(403).json({ error: "Доступ запрещен. Только администраторы и учителя могут просматривать результаты" });
      }

      // Получаем все записи на курсы (enrollments) с информацией о студентах и курсах
      const enrollments = await prisma.enrollment.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              category: true,
              instructor: true,
              duration: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      // Форматируем данные для экспорта
      const results = enrollments.map((enrollment) => ({
        studentId: enrollment.user.id,
        studentName: enrollment.user.name,
        studentEmail: enrollment.user.email,
        courseId: enrollment.course.id,
        courseTitle: enrollment.course.title,
        courseCategory: enrollment.course.category,
        instructor: enrollment.course.instructor,
        duration: enrollment.course.duration,
        progress: Math.round(enrollment.progress),
        enrollmentDate: enrollment.createdAt.toISOString(),
        lastUpdate: enrollment.updatedAt.toISOString(),
      }));

      res.status(200).json(results);
    } catch (error) {
      console.error("Ошибка получения результатов учеников:", error);
      res.status(500).json({ error: "Ошибка получения результатов учеников" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
