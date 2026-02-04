# Инструкция по миграции базы данных

Для работы функционала теста интересов необходимо обновить схему базы данных.

## Шаги для применения миграции:

1. **Обновите схему Prisma** (уже сделано в `prisma/schema.prisma`):

   - Добавлены поля `interests String[] @default([])`
   - Добавлено поле `hasCompletedTest Boolean @default(false)`

2. **Создайте и примените миграцию**:

   ```bash
   npm run db:migrate
   ```

   или

   ```bash
   npx prisma migrate dev --name add_interests_to_user
   ```

3. **Сгенерируйте Prisma Client**:

   ```bash
   npm run db:generate
   ```

   или

   ```bash
   npx prisma generate
   ```

4. **Примените изменения к базе данных** (если используете db push):
   ```bash
   npm run db:push
   ```
   или
   ```bash
   npx prisma db push
   ```

## Что было добавлено:

- `interests: String[]` - массив интересов пользователя, полученных из теста
- `hasCompletedTest: Boolean` - флаг, указывающий, прошел ли пользователь тест интересов

## Примечание:

Для существующих пользователей:

- `interests` будет пустым массивом `[]`
- `hasCompletedTest` будет `false`

Они смогут пройти тест при следующем входе в систему.
