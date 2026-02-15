import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { certificateId } = req.query;

  if (req.method === "GET") {
    try {
      if (!certificateId || typeof certificateId !== "string") {
        return res.status(400).json({ error: "certificateId обязателен" });
      }

      const certificate = await prisma.certificate.findUnique({
        where: { id: certificateId },
        include: {
          enrollment: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  instructor: true,
                  category: true,
                },
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!certificate) {
        return res.status(404).json({ error: "Сертификат не найден" });
      }

      res.status(200).json({
        id: certificate.id,
        certificateNumber: certificate.certificateNumber,
        issuedAt: certificate.issuedAt,
        course: certificate.enrollment.course,
        user: certificate.enrollment.user,
      });
    } catch (error) {
      console.error("Ошибка получения сертификата:", error);
      res.status(500).json({ error: "Ошибка получения сертификата" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
