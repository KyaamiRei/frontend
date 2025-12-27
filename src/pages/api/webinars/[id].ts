import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const webinar = await prisma.webinar.findUnique({
        where: { id: id as string },
      });

      if (!webinar) {
        return res.status(404).json({ error: 'Вебинар не найден' });
      }

      res.status(200).json({
        id: webinar.id,
        title: webinar.title,
        description: webinar.description,
        fullDescription: webinar.fullDescription,
        instructor: webinar.instructor,
        instructorBio: webinar.instructorBio,
        date: webinar.date,
        duration: webinar.duration,
        participants: webinar.participants,
        isLive: webinar.isLive,
        topics: webinar.topics,
        category: webinar.category,
      });
    } catch (error) {
      console.error('Ошибка получения вебинара:', error);
      res.status(500).json({ error: 'Ошибка получения вебинара' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        title,
        description,
        fullDescription,
        instructor,
        instructorBio,
        date,
        duration,
        topics,
        category,
        isLive,
      } = req.body;

      const webinar = await prisma.webinar.update({
        where: { id: id as string },
        data: {
          title,
          description,
          fullDescription,
          instructor,
          instructorBio,
          date: date ? new Date(date) : undefined,
          duration,
          topics,
          category,
          isLive,
        },
      });

      res.status(200).json(webinar);
    } catch (error) {
      console.error('Ошибка обновления вебинара:', error);
      res.status(500).json({ error: 'Ошибка обновления вебинара' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.webinar.delete({
        where: { id: id as string },
      });

      res.status(200).json({ message: 'Вебинар удален' });
    } catch (error) {
      console.error('Ошибка удаления вебинара:', error);
      res.status(500).json({ error: 'Ошибка удаления вебинара' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}






