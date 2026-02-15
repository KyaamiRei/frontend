import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "userId обязателен" });
      }

      const enrollments = await prisma.enrollment.findMany({
        where: {
          userId: userId,
        },
        include: {
          course: {
            include: {
              lessons: {
                orderBy: { order: "asc" },
              },
              _count: {
                select: {
                  lessons: true,
                },
              },
            },
          },
          certificate: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const formattedEnrollments = await Promise.all(enrollments.map(async (enrollment) => {
        if (!enrollment.course) {
          // Handle orphaned enrollments by providing placeholder course data
          return {
            id: enrollment.id,
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            progress: enrollment.progress,
            createdAt: enrollment.createdAt,
            updatedAt: enrollment.updatedAt,
            course: {
              id: enrollment.courseId,
              title: 'Курс удален',
              description: 'Этот курс был удален',
              instructor: 'Неизвестно',
              duration: 'Неизвестно',
              category: 'Неизвестно',
              rating: 0,
              students: 0,
              lessons: [],
              totalLessons: 0,
            },
          };
        }

        let progress = enrollment.progress;

        try {
          // Recalculate progress based on completed lessons
          const completedLessonsCount = await prisma.lessonCompletion.count({
            where: { enrollmentId: enrollment.id },
          });
          const totalLessons = enrollment.course._count.lessons;
          const calculatedProgress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

          // Update progress in database if it differs
          if (Math.abs(enrollment.progress - calculatedProgress) > 0.01) {
            await prisma.enrollment.update({
              where: { id: enrollment.id },
              data: { progress: calculatedProgress, updatedAt: new Date() },
            });
          }

          progress = calculatedProgress;
        } catch (progressError) {
          console.error('Failed to calculate/update progress for enrollment:', enrollment.id, progressError);
          // Use stored progress if calculation fails
          progress = enrollment.progress;
        }

        // Format certificate data if exists
        const certificate = enrollment.certificate ? {
          id: enrollment.certificate.id,
          certificateNumber: enrollment.certificate.certificateNumber,
          issuedAt: enrollment.certificate.issuedAt,
        } : null;

        return {
          id: enrollment.id,
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          progress: progress,
          createdAt: enrollment.createdAt,
          updatedAt: enrollment.updatedAt,
          certificate,
          course: {
            id: enrollment.course.id,
            title: enrollment.course.title,
            description: enrollment.course.description,
            instructor: enrollment.course.instructor,
            duration: enrollment.course.duration,
            category: enrollment.course.category,
            rating: enrollment.course.rating,
            students: enrollment.course.students,
            lessons: enrollment.course.lessons.map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              duration: lesson.duration,
              order: lesson.order,
            })),
            totalLessons: enrollment.course._count.lessons,
          },
        };
      }));

      res.status(200).json(formattedEnrollments);
    } catch (error) {
      console.error("Ошибка получения результатов прохождения курсов:", error);
      res.status(500).json({ error: "Ошибка получения результатов прохождения курсов" });
    }
  } else if (req.method === "POST") {
    try {
      const { userId, courseId } = req.body;

      if (!userId || !courseId) {
        return res.status(400).json({ error: "userId и courseId обязательны" });
      }

      // Проверяем, существует ли курс
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return res.status(404).json({ error: "Курс не найден" });
      }

      // Проверяем, записан ли пользователь уже на курс
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (existingEnrollment) {
        return res.status(400).json({ error: "Вы уже записаны на этот курс" });
      }

      // Создаем запись на курс
      const enrollment = await prisma.enrollment.create({
        data: {
          userId,
          courseId,
          progress: 0,
        },
        include: {
          course: {
            include: {
              lessons: {
                orderBy: { order: "asc" },
              },
              _count: {
                select: {
                  lessons: true,
                },
              },
            },
          },
          certificate: true,
        },
      });

      // Увеличиваем счетчик студентов на курсе
      await prisma.course.update({
        where: { id: courseId },
        data: {
          students: {
            increment: 1,
          },
        },
      });

      // Format certificate data if exists
      const certificate = enrollment.certificate ? {
        id: enrollment.certificate.id,
        certificateNumber: enrollment.certificate.certificateNumber,
        issuedAt: enrollment.certificate.issuedAt,
      } : null;

      const formattedEnrollment = {
        id: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        progress: enrollment.progress,
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
        certificate,
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title,
          description: enrollment.course.description,
          instructor: enrollment.course.instructor,
          duration: enrollment.course.duration,
          category: enrollment.course.category,
          rating: enrollment.course.rating,
          students: enrollment.course.students + 1,
          lessons: enrollment.course.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            order: lesson.order,
          })),
          totalLessons: enrollment.course._count.lessons,
        },
      };

      res.status(201).json(formattedEnrollment);
    } catch (error) {
      console.error("Ошибка записи на курс:", error);
      const errorMessage = error instanceof Error ? error.message : "Ошибка записи на курс";
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
