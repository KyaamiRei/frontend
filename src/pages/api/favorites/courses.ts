import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId обязателен' });
  }

  if (req.method === 'GET') {
    try {
      const favorites = await prisma.favoriteCourse.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              lessons: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      res.status(200).json(favorites.map((f) => f.courseId));
    } catch (error) {
      console.error('Ошибка получения избранных курсов:', error);
      res.status(500).json({ error: 'Ошибка получения избранных курсов' });
    }
  } else if (req.method === 'POST') {
    try {
      const { courseId } = req.body;

      if (!courseId) {
        return res.status(400).json({ error: 'courseId обязателен' });
      }

      // Проверяем, существует ли уже избранное
      const existing = await prisma.favoriteCourse.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (existing) {
        // Удаляем из избранного
        await prisma.favoriteCourse.delete({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
        });
        return res.status(200).json({ isFavorite: false });
      } else {
        // Добавляем в избранное
        await prisma.favoriteCourse.create({
          data: {
            userId,
            courseId,
          },
        });
        return res.status(200).json({ isFavorite: true });
      }
    } catch (error) {
      console.error('Ошибка обновления избранного курса:', error);
      res.status(500).json({ error: 'Ошибка обновления избранного курса' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}






