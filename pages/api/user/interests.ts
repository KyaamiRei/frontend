import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { userId, interests } = req.body;

      if (!userId || !Array.isArray(interests)) {
        return res.status(400).json({ error: "userId и interests обязательны" });
      }

      // Обновляем интересы пользователя и отмечаем, что тест пройден
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          interests: interests,
          hasCompletedTest: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          interests: true,
          hasCompletedTest: true,
        },
      });

      res.status(200).json(user);
    } catch (error) {
      console.error("Ошибка сохранения интересов:", error);
      res.status(500).json({ error: "Ошибка сохранения интересов" });
    }
  } else if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "userId обязателен" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          interests: true,
          hasCompletedTest: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Ошибка получения интересов:", error);
      res.status(500).json({ error: "Ошибка получения интересов" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
