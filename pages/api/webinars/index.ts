import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const webinars = await prisma.webinar.findMany({
        orderBy: { date: "desc" },
      });

      const formattedWebinars = webinars.map((webinar) => ({
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
      }));

      res.status(200).json(formattedWebinars);
    } catch (error) {
      console.error("Ошибка получения вебинаров:", error);
      res.status(500).json({ error: "Ошибка получения вебинаров" });
    }
  } else if (req.method === "POST") {
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
      } = req.body;

      const webinar = await prisma.webinar.create({
        data: {
          title,
          description,
          fullDescription,
          instructor,
          instructorBio,
          date: new Date(date),
          duration,
          topics: topics || [],
          category,
        },
      });

      res.status(201).json({
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
      console.error("Ошибка создания вебинара:", error);
      res.status(500).json({ error: "Ошибка создания вебинара" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
