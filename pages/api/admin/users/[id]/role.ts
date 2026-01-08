import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { role, adminId } = req.body;

      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "ID пользователя обязателен" });
      }

      if (!role || !["STUDENT", "TEACHER", "ADMIN"].includes(role)) {
        return res
          .status(400)
          .json({ error: "Некорректная роль. Допустимые значения: STUDENT, TEACHER, ADMIN" });
      }

      if (!adminId) {
        return res.status(401).json({ error: "Требуется авторизация администратора" });
      }

      // Проверяем, что запрос делает администратор
      const admin = await prisma.user.findUnique({
        where: { id: adminId },
      });

      if (!admin || admin.role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Только администратор может изменять роли пользователей" });
      }

      // Обновляем роль пользователя
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Ошибка обновления роли:", error);
      res.status(500).json({ error: "Ошибка обновления роли пользователя" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
