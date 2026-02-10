import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { enrollmentId, lessonId } = req.query;

  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "userId обязателен" });
      }

      // Check if enrollment exists and belongs to the authenticated user
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId as string },
      });

      if (!enrollment) {
        return res.status(404).json({ error: "Запись на курс не найдена" });
      }

      // Check if enrollment belongs to the authenticated user
      if (enrollment.userId !== userId) {
        return res.status(403).json({ error: "Нет доступа к этой записи" });
      }

      // Check if lesson completion exists
      const existingCompletion = await prisma.lessonCompletion.findUnique({
        where: {
          enrollmentId_lessonId: {
            enrollmentId: enrollmentId as string,
            lessonId: lessonId as string,
          },
        },
      });

      res.status(200).json({ completed: !!existingCompletion });
    } catch (error) {
      console.error("Ошибка проверки завершения урока:", error);
      res.status(500).json({ error: "Ошибка проверки завершения урока" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
