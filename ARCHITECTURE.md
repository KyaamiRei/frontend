# Архитектура проекта EduPlatform

## Структура проекта

```
frontend/
├── pages/                    # Next.js Pages Router
│   ├── api/                  # API роуты
│   ├── courses/              # Страницы курсов
│   ├── webinars/             # Страницы вебинаров
│   ├── admin/                # Админ панель
│   ├── _app.tsx             # Главный компонент приложения
│   └── _document.tsx        # HTML документ
│
├── src/
│   ├── components/          # React компоненты
│   │   ├── layout/         # Компоненты макета (Header, Footer, Layout)
│   │   ├── cards/          # Компоненты карточек (CourseCard, WebinarCard)
│   │   └── index.ts        # Экспорт всех компонентов
│   │
│   ├── contexts/            # React Context провайдеры
│   │   ├── AuthContext.tsx
│   │   ├── CoursesContext.tsx
│   │   ├── FavoritesContext.tsx
│   │   └── WebinarsContext.tsx
│   │
│   ├── hooks/               # Кастомные React хуки
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   │
│   ├── types/               # TypeScript типы и интерфейсы
│   │   └── index.ts
│   │
│   ├── utils/               # Утилиты и константы
│   │   └── constants.ts
│   │
│   └── styles/              # Стили
│       ├── globals.css
│       └── Home.module.css
│
├── lib/                      # Библиотеки и утилиты для сервера
│   └── prisma.ts            # Prisma клиент
│
├── app/
│   └── generated/           # Сгенерированный Prisma клиент
│
├── prisma/                   # Prisma схема и миграции
│   ├── schema.prisma
│   └── migrations/
│
└── public/                   # Статические файлы
```

## Принципы организации

### 1. Разделение на слои

- **Pages** - маршрутизация и композиция страниц
- **Components** - переиспользуемые UI компоненты
- **Contexts** - глобальное состояние приложения
- **Hooks** - переиспользуемая логика
- **Types** - централизованные типы TypeScript
- **Utils** - утилиты и константы
- **API Routes** - серверная логика

### 2. Структура компонентов

Компоненты организованы по категориям:

- `layout/` - компоненты макета (Header, Footer, Layout)
- `cards/` - карточки для отображения данных (CourseCard, WebinarCard)

Все компоненты экспортируются через индексные файлы для удобного импорта.

### 3. Типизация

Все типы определены в `src/types/index.ts`:

- `User`, `UserRole`
- `Course`, `CourseReview`, `Lesson`
- `Webinar`

### 4. Контексты

Контексты обеспечивают глобальное состояние:

- `AuthContext` - аутентификация пользователя
- `CoursesContext` - управление курсами
- `WebinarsContext` - управление вебинарами
- `FavoritesContext` - избранное

### 5. Импорты

Используется алиас `@/` для импортов из `src/`:

```typescript
import { Layout, CourseCard } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import type { User, Course } from "@/types";
```

## Технологии

- **Next.js 16** - React фреймворк
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Prisma** - ORM для работы с БД
- **React Context API** - управление состоянием
- **date-fns** - работа с датами

## Конфигурация

- `tsconfig.json` - конфигурация TypeScript с алиасом `@/*`
- `tailwind.config.js` - конфигурация Tailwind CSS
- `next.config.ts` - конфигурация Next.js

## Лучшие практики

1. **Централизованные типы** - все типы в `src/types/`
2. **Индексные экспорты** - использование индексных файлов для удобного импорта
3. **Разделение ответственности** - каждый модуль отвечает за свою область
4. **Типизация** - все компоненты и функции типизированы
5. **Переиспользуемость** - компоненты и хуки вынесены в отдельные модули
