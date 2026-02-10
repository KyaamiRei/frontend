import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { enrollmentId } = req.query;

  if (req.method === "DELETE") {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId обязателен" });
      }

      // Check if enrollment exists and belongs to the authenticated user
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId as string },
        include: {
          course: true,
        },
      });

      if (!enrollment) {
        return res.status(404).json({ error: "Запись на курс не найдена" });
      }

      // Check if enrollment belongs to the authenticated user
      if (enrollment.userId !== userId) {
        return res.status(403).json({ error: "Нет доступа к этой записи" });
      }

      // Delete lesson completions first (cascade delete should handle this, but to be safe)
      await prisma.lessonCompletion.deleteMany({
        where: { enrollmentId: enrollmentId as string },
      });

      // Delete the enrollment
      await prisma.enrollment.delete({
        where: { id: enrollmentId as string },
      });

      // Decrease student count on the course
      await prisma.course.update({
        where: { id: enrollment.courseId },
        data: {
          students: {
            decrement: 1,
          },
        },
      });

      res.status(200).json({ message: "Отписка от курса выполнена" });
    } catch (error) {
      console.error("Ошибка отписки от курса:", error);
      res.status(500).json({ error: "Ошибка отписки от курса" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
