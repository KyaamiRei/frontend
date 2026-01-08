# Инструкция по настройке и запуску Seed

## Настройка конфигурации

Seed файл настроен и готов к использованию. Конфигурация находится в `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Шаги для запуска

### 1. Убедитесь, что база данных запущена

```bash
docker-compose up -d
```

### 2. Примените миграции (если еще не применены)

```bash
npm run db:migrate
```

Или если используете `db push`:

```bash
npm run db:push
```

### 3. Сгенерируйте Prisma Client

```bash
npm run db:generate
```

### 4. Запустите seed

```bash
npm run db:seed
```

Или напрямую через Prisma:

```bash
npx prisma db seed
```

## Что создается в seed

### Пользователи (6 штук):

1. **Администратор**
   - Email: `admin@example.com`
   - Пароль: `password123`
   - Роль: `ADMIN`

2. **Ученики (3 штуки)**
   - `test@example.com` / `password123` (Иван Петров)
   - `maria@example.com` / `password123` (Мария Сидорова)
   - `alex@example.com` / `password123` (Алексей Смирнов)
   - Роль: `STUDENT`

3. **Учителя (2 штуки)**
   - `teacher@example.com` / `password123` (Сергей Иванов)
   - `anna@example.com` / `password123` (Анна Козлова)
   - Роль: `TEACHER`

## Важные замечания

- Все пароли хешируются с помощью `bcrypt` (10 раундов)
- Используется `upsert`, поэтому повторный запуск seed безопасен
- Если нужно очистить базу данных перед seed, раскомментируйте строки очистки в начале функции `main()`

## Устранение проблем

### Ошибка: "Property 'role' does not exist"

Это означает, что Prisma Client не обновлен. Выполните:

```bash
npm run db:generate
```

### Ошибка: "Cannot find module '@prisma/client'"

Установите зависимости:

```bash
npm install
```

### Ошибка подключения к базе данных

Проверьте, что:
1. Docker контейнер с PostgreSQL запущен
2. В `.env` файле указан правильный `DATABASE_URL`
3. База данных создана и доступна

## Структура seed файла

```typescript
prisma/seed.ts
├── Импорты (PrismaClient, bcrypt)
├── Функция main()
│   ├── Очистка БД (опционально, закомментировано)
│   ├── Создание пользователей с ролями
│   └── Вывод статистики
└── Обработка ошибок и отключение от БД
```




