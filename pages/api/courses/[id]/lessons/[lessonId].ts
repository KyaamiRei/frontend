import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, lessonId } = req.query;

  if (req.method === "GET") {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId as string },
      });

      if (!lesson || lesson.courseId !== id) {
        return res.status(404).json({ error: "Урок не найден" });
      }

      res.status(200).json({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        content: lesson.content,
        order: lesson.order,
      });
    } catch (error) {
      console.error("Ошибка получения урока:", error);
      res.status(500).json({ error: "Ошибка получения урока" });
    }
  } else if (req.method === "PUT") {
    try {
      const { title, duration, content } = req.body;

      if (!title || !duration) {
        return res.status(400).json({ error: "Название и длительность обязательны" });
      }

      // Check if lesson exists and belongs to the course
      const existingLesson = await prisma.lesson.findUnique({
        where: { id: lessonId as string },
      });

      if (!existingLesson || existingLesson.courseId !== id) {
        return res.status(404).json({ error: "Урок не найден" });
      }

      const updatedLesson = await prisma.lesson.update({
        where: { id: lessonId as string },
        data: {
          title: title.trim(),
          duration: duration.trim(),
          content: content ? content.trim() : null,
        },
      });

      res.status(200).json({
        message: "Урок обновлен",
        lesson: {
          id: updatedLesson.id,
          title: updatedLesson.title,
          duration: updatedLesson.duration,
          content: updatedLesson.content,
          order: updatedLesson.order,
        },
      });
    } catch (error) {
      console.error("Ошибка обновления урока:", error);
      res.status(500).json({ error: "Ошибка обновления урока" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Check if lesson exists and belongs to the course
      const existingLesson = await prisma.lesson.findUnique({
        where: { id: lessonId as string },
      });

      if (!existingLesson || existingLesson.courseId !== id) {
        return res.status(404).json({ error: "Урок не найден" });
      }

      await prisma.lesson.delete({
        where: { id: lessonId as string },
      });

      res.status(200).json({ message: "Урок удален" });
    } catch (error) {
      console.error("Ошибка удаления урока:", error);
      res.status(500).json({ error: "Ошибка удаления урока" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
