## Структура проекта

```text
frontend (Next.js приложение)
│
├─ public/                  – статичные файлы (иконки, svg)
│
├─ src/
│  ├─ pages/                – маршруты приложения
│  │  ├─ _app.tsx           – обёртка всего приложения, подключение контекстов/стилей
│  │  ├─ _document.tsx      – базовый HTML-документ
│  │  ├─ index.tsx          – главная страница
│  │  ├─ about.tsx          – страница "О нас"
│  │  ├─ favorites.tsx      – избранное
│  │  ├─ login.tsx          – логин
│  │  ├─ register.tsx       – регистрация
│  │  ├─ notifications.tsx  – уведомления
│  │  ├─ profile.tsx        – профиль пользователя
│  │  ├─ courses/
│  │  │  ├─ index.tsx       – список курсов
│  │  │  ├─ create.tsx      – создание курса
│  │  │  └─ [id].tsx        – страница одного курса
│  │  └─ webinars/
│  │     ├─ index.tsx       – список вебинаров
│  │     ├─ create.tsx      – создание вебинара
│  │     └─ [id].tsx        – страница одного вебинара
│  │
│  ├─ components/           – переиспользуемые компоненты
│  │  ├─ Header.tsx         – шапка сайта
│  │  ├─ Footer.tsx         – подвал
│  │  ├─ Layout.tsx         – общий layout (обёртка страниц)
│  │  ├─ CourseCard.tsx     – карточка курса
│  │  └─ WebinarCard.tsx    – карточка вебинара
│  │
│  ├─ contexts/             – контексты (глобальное состояние)
│  │  ├─ AuthContext.tsx        – аутентификация пользователя
│  │  ├─ CoursesContext.tsx     – список/состояние курсов
│  │  ├─ FavoritesContext.tsx   – избранные курсы/вебинары
│  │  └─ WebinarsContext.tsx    – список/состояние вебинаров
│  │
│  └─ styles/               – стили
│     ├─ globals.css        – глобальные стили
│     └─ Home.module.css    – модульные стили для главной/компонентов
│
├─ next.config.ts           – конфигурация Next.js
├─ tailwind.config.js       – конфигурация Tailwind CSS
├─ postcss.config.js        – конфигурация PostCSS
├─ eslint.config.mjs        – конфигурация линтера
├─ tsconfig.json            – конфигурация TypeScript
└─ package.json             – зависимости и скрипты проекта
```

## Используемые технологии

- **Next.js** – фреймворк поверх React для роутинга, сборки и SSR/SSG.
- **React** – UI‑библиотека для построения компонентов и страниц.
- **TypeScript** – типизация кода, удобная разработка и рефакторинг.
- **Tailwind CSS** – утилитарные CSS‑классы для быстрой стилизации интерфейса.
- **CSS Modules** (`Home.module.css`) – локальные стили для отдельных компонентов/страниц.
- **Context API (React Context)** – глобальное состояние (`AuthContext`, `CoursesContext`, `FavoritesContext`, `WebinarsContext`).
- **ESLint** – линтер для проверки качества и стиля кода.
- **PostCSS** – обработка CSS (плагины, интеграция с Tailwind).


