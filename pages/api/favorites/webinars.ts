import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "userId обязателен" });
  }

  if (req.method === "GET") {
    try {
      const favorites = await prisma.favoriteWebinar.findMany({
        where: { userId },
      });

      res.status(200).json(favorites.map((f) => f.webinarId));
    } catch (error) {
      console.error("Ошибка получения избранных вебинаров:", error);
      res.status(500).json({ error: "Ошибка получения избранных вебинаров" });
    }
  } else if (req.method === "POST") {
    try {
      const { webinarId } = req.body;

      if (!webinarId) {
        return res.status(400).json({ error: "webinarId обязателен" });
      }

      // Проверяем, существует ли уже избранное
      const existing = await prisma.favoriteWebinar.findUnique({
        where: {
          userId_webinarId: {
            userId,
            webinarId,
          },
        },
      });

      if (existing) {
        // Удаляем из избранного
        await prisma.favoriteWebinar.delete({
          where: {
            userId_webinarId: {
              userId,
              webinarId,
            },
          },
        });
        return res.status(200).json({ isFavorite: false });
      } else {
        // Добавляем в избранное
        await prisma.favoriteWebinar.create({
          data: {
            userId,
            webinarId,
          },
        });
        return res.status(200).json({ isFavorite: true });
      }
    } catch (error) {
      console.error("Ошибка обновления избранного вебинара:", error);
      res.status(500).json({ error: "Ошибка обновления избранного вебинара" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
