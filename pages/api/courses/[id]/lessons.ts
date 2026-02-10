import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "POST") {
    try {
      const { lessons } = req.body;

      if (!lessons || !Array.isArray(lessons)) {
        return res.status(400).json({ error: "Массив уроков обязателен" });
      }

      // Get the current max order for lessons in this course
      const maxOrderLesson = await prisma.lesson.findFirst({
        where: { courseId: id as string },
        orderBy: { order: 'desc' },
      });
      const nextOrder = maxOrderLesson ? maxOrderLesson.order + 1 : 1;

      // Create new lessons
      const createdLessons = await prisma.lesson.createManyAndReturn({
        data: lessons.map((lesson: any, index: number) => ({
          courseId: id as string,
          title: lesson.title,
          duration: lesson.duration,
          content: lesson.content || null,
          order: nextOrder + index,
        })),
      });

      res.status(201).json({
        message: "Уроки добавлены",
        lessons: createdLessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          content: lesson.content
        })),
      });
    } catch (error) {
      console.error("Ошибка добавления уроков:", error);
      res.status(500).json({ error: "Ошибка добавления уроков" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
