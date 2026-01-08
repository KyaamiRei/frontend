import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "POST") {
    try {
      const { userId, rating, text } = req.body;

      if (!userId || !rating || !text) {
        return res.status(400).json({ error: "Необходимы userId, rating и text" });
      }

      // Проверяем, не оставлял ли пользователь уже отзыв
      const existingReview = await prisma.courseReview.findUnique({
        where: {
          courseId_userId: {
            courseId: id as string,
            userId: userId,
          },
        },
      });

      if (existingReview) {
        // Обновляем существующий отзыв
        const review = await prisma.courseReview.update({
          where: { id: existingReview.id },
          data: { rating, text },
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
        });

        // Пересчитываем рейтинг курса
        await updateCourseRating(id as string);

        return res.status(200).json({
          id: review.id,
          author: review.user.name,
          rating: review.rating,
          date: review.createdAt,
          text: review.text,
        });
      }

      // Создаем новый отзыв
      const review = await prisma.courseReview.create({
        data: {
          courseId: id as string,
          userId: userId,
          rating,
          text,
        },
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
      });

      // Пересчитываем рейтинг курса
      await updateCourseRating(id as string);

      res.status(201).json({
        id: review.id,
        author: review.user.name,
        rating: review.rating,
        date: review.createdAt,
        text: review.text,
      });
    } catch (error) {
      console.error("Ошибка создания отзыва:", error);
      res.status(500).json({ error: "Ошибка создания отзыва" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function updateCourseRating(courseId: string) {
  const reviews = await prisma.courseReview.findMany({
    where: { courseId },
    select: { rating: true },
  });

  if (reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await prisma.course.update({
      where: { id: courseId },
      data: { rating: averageRating },
    });
  }
}
