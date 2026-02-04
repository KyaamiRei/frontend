import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email и пароль обязательны" });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "Неверный email или пароль" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Неверный email или пароль" });
      }

      // Возвращаем пользователя без пароля
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        ...userWithoutPassword,
        interests: user.interests || [],
        hasCompletedTest: user.hasCompletedTest || false,
      });
    } catch (error) {
      console.error("Ошибка входа:", error);
      res.status(500).json({ error: "Ошибка входа" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
