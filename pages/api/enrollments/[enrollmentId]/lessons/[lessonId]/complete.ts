import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { enrollmentId, lessonId } = req.query;

  if (req.method === "POST") {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId обязателен" });
      }

      // Check if enrollment exists and belongs to the authenticated user
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId as string },
        include: {
          course: {
            include: {
              lessons: true,
            },
          },
        },
      });

      if (!enrollment) {
        return res.status(404).json({ error: "Запись на курс не найдена" });
      }

      // Check if enrollment belongs to the authenticated user
      if (enrollment.userId !== userId) {
        return res.status(403).json({ error: "Нет доступа к этой записи" });
      }

      // Check if lesson belongs to the course
      const lesson = enrollment.course.lessons.find((l) => l.id === lessonId);
      if (!lesson) {
        return res.status(404).json({ error: "Урок не найден в этом курсе" });
      }

      // Check if lesson is already completed
      const existingCompletion = await prisma.lessonCompletion.findUnique({
        where: {
          enrollmentId_lessonId: {
            enrollmentId: enrollmentId as string,
            lessonId: lessonId as string,
          },
        },
      });

      if (existingCompletion) {
        return res.status(200).json({ message: "Урок уже завершен", progress: enrollment.progress });
      }

      // Create lesson completion
      await prisma.lessonCompletion.create({
        data: {
          enrollmentId: enrollmentId as string,
          lessonId: lessonId as string,
        },
      });

      // Calculate new progress
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = await prisma.lessonCompletion.count({
        where: { enrollmentId: enrollmentId as string },
      });

      const newProgress = (completedLessons / totalLessons) * 100;

      // Update enrollment progress
      await prisma.enrollment.update({
        where: { id: enrollmentId as string },
        data: {
          progress: newProgress,
          updatedAt: new Date(),
        },
      });

      // Check if progress reached 100% and generate certificate if not exists
      let certificate = null;
      if (newProgress >= 100) {
        // Check if certificate already exists
        const existingCertificate = await prisma.certificate.findUnique({
          where: { enrollmentId: enrollmentId as string },
        });

        if (!existingCertificate) {
          // Generate unique certificate number
          const certificateNumber = `CERT-${enrollment.course.title.substring(0, 3).toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          
          // Create certificate
          const newCertificate = await prisma.certificate.create({
            data: {
              enrollmentId: enrollmentId as string,
              userId: enrollment.userId,
              courseId: enrollment.courseId,
              certificateNumber,
            },
          });

          certificate = {
            id: newCertificate.id,
            certificateNumber: newCertificate.certificateNumber,
            issuedAt: newCertificate.issuedAt,
          };
        } else {
          // Return existing certificate
          certificate = {
            id: existingCertificate.id,
            certificateNumber: existingCertificate.certificateNumber,
            issuedAt: existingCertificate.issuedAt,
          };
        }
      }

      res.status(200).json({
        message: newProgress >= 100 ? "Курс завершен! Сертификат получен." : "Урок завершен",
        progress: newProgress,
        certificate,
      });
    } catch (error) {
      console.error("Ошибка завершения урока:", error);
      res.status(500).json({ error: "Ошибка завершения урока" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
