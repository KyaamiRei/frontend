import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { adminId } = req.query;

      if (!adminId || typeof adminId !== "string") {
        return res.status(401).json({ error: "Требуется авторизация администратора" });
      }

      // Проверяем, что запрос делает администратор
      const admin = await prisma.user.findUnique({
        where: { id: adminId },
      });

      if (!admin || admin.role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Только администратор может просматривать список пользователей" });
      }

      // Получаем всех пользователей
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.status(200).json(users);
    } catch (error) {
      console.error("Ошибка получения пользователей:", error);
      res.status(500).json({ error: "Ошибка получения списка пользователей" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
