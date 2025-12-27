import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Начало заполнения базы данных...");

  // Очистка базы данных (опционально, раскомментируйте если нужно)
  // await prisma.courseReview.deleteMany();
  // await prisma.favoriteCourse.deleteMany();
  // await prisma.favoriteWebinar.deleteMany();
  // await prisma.enrollment.deleteMany();
  // await prisma.lesson.deleteMany();
  // await prisma.course.deleteMany();
  // await prisma.webinar.deleteMany();
  // await prisma.user.deleteMany();

  // Создаем пользователей
  console.log("👤 Создание пользователей...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    // Администратор
    prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        name: "Администратор",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
        avatar: "https://i.pravatar.cc/150?img=11",
      },
    }),
    // Ученики
    prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {},
      create: {
        name: "Иван Петров",
        email: "test@example.com",
        password: hashedPassword,
        role: "STUDENT",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
    }),
    prisma.user.upsert({
      where: { email: "maria@example.com" },
      update: {},
      create: {
        name: "Мария Сидорова",
        email: "maria@example.com",
        password: hashedPassword,
        role: "STUDENT",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    }),
    prisma.user.upsert({
      where: { email: "alex@example.com" },
      update: {},
      create: {
        name: "Алексей Смирнов",
        email: "alex@example.com",
        password: hashedPassword,
        role: "STUDENT",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
    }),
    // Учителя
    prisma.user.upsert({
      where: { email: "teacher@example.com" },
      update: {},
      create: {
        name: "Сергей Иванов",
        email: "teacher@example.com",
        password: hashedPassword,
        role: "TEACHER",
        avatar: "https://i.pravatar.cc/150?img=15",
      },
    }),
    prisma.user.upsert({
      where: { email: "anna@example.com" },
      update: {},
      create: {
        name: "Анна Козлова",
        email: "anna@example.com",
        password: hashedPassword,
        role: "TEACHER",
        avatar: "https://i.pravatar.cc/150?img=9",
      },
    }),
  ]);

  // Подсчитываем пользователей по ролям
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const teacherCount = users.filter((u) => u.role === "TEACHER").length;
  const studentCount = users.filter((u) => u.role === "STUDENT").length;

  console.log("✅ База данных успешно заполнена тестовыми данными!");
  console.log(`   👤 Пользователей: ${users.length}`);
  console.log(`      - Администраторов: ${adminCount}`);
  console.log(`      - Учителей: ${teacherCount}`);
  console.log(`      - Учеников: ${studentCount}`);
  console.log("\n📝 Тестовые аккаунты:");
  console.log("   Администратор: admin@example.com / password123");
  console.log("   Ученик: test@example.com / password123");
  console.log("   Учитель: teacher@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
