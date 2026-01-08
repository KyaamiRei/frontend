import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

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

// async function main() {
//   // Создаем тестового пользователя
//   const hashedPassword = await bcrypt.hash("password123", 10);
//   const user = await prisma.user.upsert({
//     where: { email: "test@example.com" },
//     update: {},
//     create: {
//       name: "Тестовый пользователь",
//       email: "test@example.com",
//       password: hashedPassword,
//     },
//   });

//   // Создаем курсы
//   const course1 = await prisma.course.upsert({
//     where: { id: "1" },
//     update: {},
//     create: {
//       id: "1",
//       title: "Основы веб-разработки",
//       description: "Изучите HTML, CSS и JavaScript с нуля. Создайте свои первые веб-приложения.",
//       fullDescription:
//         "Этот курс предназначен для начинающих разработчиков, которые хотят освоить основы веб-разработки. Вы изучите HTML для структуры, CSS для стилизации и JavaScript для интерактивности. К концу курса вы сможете создавать полноценные веб-приложения.",
//       instructor: "Иван Петров",
//       duration: "40 часов",
//       students: 1250,
//       rating: 4.8,
//       category: "Веб-разработка",
//       price: 0,
//       lessons: {
//         create: [
//           { title: "Введение в HTML", duration: "45 мин", order: 1 },
//           { title: "Структура HTML документа", duration: "50 мин", order: 2 },
//           { title: "Основы CSS", duration: "60 мин", order: 3 },
//           { title: "Flexbox и Grid", duration: "70 мин", order: 4 },
//           { title: "Введение в JavaScript", duration: "55 мин", order: 5 },
//           { title: "DOM манипуляции", duration: "65 мин", order: 6 },
//         ],
//       },
//       reviews: {
//         create: [
//           {
//             userId: user.id,
//             rating: 5,
//             text: "Отличный курс для начинающих! Все объясняется очень понятно, много практических примеров. Рекомендую!",
//           },
//         ],
//       },
//     },
//   });

//   await prisma.course.upsert({
//     where: { id: "2" },
//     update: {},
//     create: {
//       id: "2",
//       title: "Python для начинающих",
//       description: "Полный курс по программированию на Python. От основ до продвинутых тем.",
//       instructor: "Мария Сидорова",
//       duration: "60 часов",
//       students: 2100,
//       rating: 4.9,
//       category: "Программирование",
//       price: 2999,
//     },
//   });

//   await prisma.course.upsert({
//     where: { id: "3" },
//     update: {},
//     create: {
//       id: "3",
//       title: "Дизайн интерфейсов",
//       description: "Изучите принципы UI/UX дизайна и создавайте красивые интерфейсы.",
//       instructor: "Алексей Козлов",
//       duration: "35 часов",
//       students: 890,
//       rating: 4.7,
//       category: "Дизайн",
//       price: 2499,
//     },
//   });

//   await prisma.course.upsert({
//     where: { id: "4" },
//     update: {},
//     create: {
//       id: "4",
//       title: "React и современный JavaScript",
//       description: "Освойте React, хуки, контекст и создание полноценных приложений.",
//       instructor: "Сергей Иванов",
//       duration: "50 часов",
//       students: 1800,
//       rating: 4.9,
//       category: "Веб-разработка",
//       price: 3499,
//     },
//   });

//   await prisma.course.upsert({
//     where: { id: "5" },
//     update: {},
//     create: {
//       id: "5",
//       title: "Базы данных и SQL",
//       description: "Изучите проектирование баз данных, SQL запросы и оптимизацию.",
//       instructor: "Ольга Смирнова",
//       duration: "30 часов",
//       students: 1100,
//       rating: 4.6,
//       category: "Базы данных",
//       price: 1999,
//     },
//   });

//   await prisma.course.upsert({
//     where: { id: "6" },
//     update: {},
//     create: {
//       id: "6",
//       title: "Мобильная разработка",
//       description: "Создавайте мобильные приложения для iOS и Android.",
//       instructor: "Андрей Морозов",
//       duration: "70 часов",
//       students: 950,
//       rating: 4.8,
//       category: "Мобильная разработка",
//       price: 3999,
//     },
//   });

//   // Создаем вебинары
//   await prisma.webinar.upsert({
//     where: { id: "1" },
//     update: {},
//     create: {
//       id: "1",
//       title: "Искусственный интеллект в образовании",
//       description: "Обсудим применение AI в современном образовании и перспективы развития.",
//       fullDescription:
//         "На этом вебинаре мы рассмотрим, как искусственный интеллект меняет образовательный ландшафт. Вы узнаете о последних разработках в области AI для образования, практических примерах внедрения и будущих трендах.",
//       instructor: "Дмитрий Волков",
//       instructorBio:
//         "Эксперт в области образовательных технологий с 15-летним опытом. Автор более 50 научных публикаций.",
//       date: new Date("2024-12-20T18:00:00"),
//       duration: "1.5 часа",
//       participants: 450,
//       topics: [
//         "Текущее состояние AI в образовании",
//         "Практические кейсы внедрения",
//         "Перспективы развития",
//         "Вопросы и ответы",
//       ],
//     },
//   });

//   await prisma.webinar.upsert({
//     where: { id: "2" },
//     update: {},
//     create: {
//       id: "2",
//       title: "Цифровая трансформация школ",
//       description: "Как внедрить цифровые технологии в образовательный процесс.",
//       instructor: "Елена Новикова",
//       date: new Date("2024-12-22T16:00:00"),
//       duration: "2 часа",
//       participants: 320,
//     },
//   });

//   await prisma.webinar.upsert({
//     where: { id: "3" },
//     update: {},
//     create: {
//       id: "3",
//       title: "Онлайн-обучение: лучшие практики",
//       description: "Эффективные методы организации онлайн-обучения для студентов.",
//       instructor: "Анна Петрова",
//       date: new Date("2024-12-25T14:00:00"),
//       duration: "1.5 часа",
//       participants: 280,
//     },
//   });

//   await prisma.webinar.upsert({
//     where: { id: "4" },
//     update: {},
//     create: {
//       id: "4",
//       title: "Геймификация в образовании",
//       description: "Как использовать игровые элементы для повышения мотивации студентов.",
//       instructor: "Максим Соколов",
//       date: new Date("2024-12-18T19:00:00"),
//       duration: "2 часа",
//       participants: 380,
//       isLive: false,
//     },
//   });

//   console.log("База данных заполнена тестовыми данными");
// }

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
