# UML Диаграммы для EduPlatform

## 1. ER-диаграмма (Entity-Relationship Diagram)

```mermaid
erDiagram
    User ||--o{ Enrollment : "имеет"
    User ||--o{ CourseReview : "пишет"
    User ||--o{ FavoriteCourse : "добавляет"
    User ||--o{ FavoriteWebinar : "добавляет"
    User ||--o{ Certificate : "получает"
    
    Course ||--o{ Lesson : "содержит"
    Course ||--o{ Enrollment : "имеет"
    Course ||--o{ CourseReview : "имеет"
    Course ||--o{ FavoriteCourse : "в избранном"
    
    Enrollment ||--o{ LessonCompletion : "отслеживает"
    Enrollment ||--|| Certificate : "генерирует"
    
    Lesson ||--o{ LessonCompletion : "завершается"
    
    Webinar ||--o{ FavoriteWebinar : "в избранном"
    
    User {
        string id PK
        string name
        string email UK
        string password
        string avatar
        string[] interests
        boolean hasCompletedTest
        enum role
        datetime createdAt
        datetime updatedAt
    }
    
    Course {
        string id PK
        string title
        string description
        string fullDescription
        string instructor
        string duration
        int students
        float rating
        string category
        float price
        string image
        datetime createdAt
        datetime updatedAt
    }
    
    Lesson {
        string id PK
        string courseId FK
        string title
        string duration
        string content
        int order
        datetime createdAt
    }
    
    Enrollment {
        string id PK
        string userId FK
        string courseId FK
        float progress
        datetime createdAt
        datetime updatedAt
    }
    
    LessonCompletion {
        string id PK
        string enrollmentId FK
        string lessonId FK
        datetime completedAt
    }
    
    Certificate {
        string id PK
        string enrollmentId FK UK
        string userId FK
        string courseId FK
        string certificateNumber UK
        datetime issuedAt
    }
    
    CourseReview {
        string id PK
        string courseId FK
        string userId FK
        int rating
        string text
        datetime createdAt
        datetime updatedAt
    }
    
    Webinar {
        string id PK
        string title
        string description
        string fullDescription
        string instructor
        string instructorBio
        datetime date
        string duration
        int participants
        boolean isLive
        string[] topics
        string category
        datetime createdAt
        datetime updatedAt
    }
    
    FavoriteCourse {
        string id PK
        string userId FK
        string courseId FK
        datetime createdAt
    }
    
    FavoriteWebinar {
        string id PK
        string userId FK
        string webinarId FK
        datetime createdAt
    }
```

## 2. Диаграмма классов (Class Diagram)

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String password
        +String avatar
        +String[] interests
        +Boolean hasCompletedTest
        +Role role
        +DateTime createdAt
        +DateTime updatedAt
        +login()
        +register()
        +logout()
    }
    
    class Course {
        +String id
        +String title
        +String description
        +String fullDescription
        +String instructor
        +String duration
        +Int students
        +Float rating
        +String category
        +Float price
        +String image
        +DateTime createdAt
        +DateTime updatedAt
        +addLesson()
        +updateLesson()
        +deleteLesson()
        +addReview()
    }
    
    class Lesson {
        +String id
        +String courseId
        +String title
        +String duration
        +String content
        +Int order
        +DateTime createdAt
        +complete()
    }
    
    class Enrollment {
        +String id
        +String userId
        +String courseId
        +Float progress
        +DateTime createdAt
        +DateTime updatedAt
        +calculateProgress()
        +completeLesson()
        +generateCertificate()
    }
    
    class LessonCompletion {
        +String id
        +String enrollmentId
        +String lessonId
        +DateTime completedAt
    }
    
    class Certificate {
        +String id
        +String enrollmentId
        +String userId
        +String courseId
        +String certificateNumber
        +DateTime issuedAt
        +generateNumber()
        +download()
    }
    
    class CourseReview {
        +String id
        +String courseId
        +String userId
        +Int rating
        +String text
        +DateTime createdAt
        +DateTime updatedAt
    }
    
    class Webinar {
        +String id
        +String title
        +String description
        +String fullDescription
        +String instructor
        +String instructorBio
        +DateTime date
        +String duration
        +Int participants
        +Boolean isLive
        +String[] topics
        +String category
        +DateTime createdAt
        +DateTime updatedAt
    }
    
    User "1" --> "*" Enrollment : enrolls
    User "1" --> "*" CourseReview : writes
    User "1" --> "*" Certificate : receives
    Course "1" --> "*" Lesson : contains
    Course "1" --> "*" Enrollment : has
    Course "1" --> "*" CourseReview : has
    Enrollment "1" --> "*" LessonCompletion : tracks
    Enrollment "1" --> "0..1" Certificate : generates
    Lesson "1" --> "*" LessonCompletion : completed_in
```

## 3. Диаграмма компонентов (Component Diagram)

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A[Pages]
        B[Components]
        C[Contexts]
        D[API Routes]
    end
    
    subgraph "Contexts"
        C1[AuthContext]
        C2[CoursesContext]
        C3[EnrollmentsContext]
        C4[FavoritesContext]
        C5[WebinarsContext]
    end
    
    subgraph "API Layer"
        D1[/api/auth]
        D2[/api/courses]
        D3[/api/enrollments]
        D4[/api/certificates]
        D5[/api/webinars]
        D6[/api/favorites]
        D7[/api/admin]
    end
    
    subgraph "Business Logic"
        E1[Authentication Service]
        E2[Course Service]
        E3[Enrollment Service]
        E4[Certificate Service]
    end
    
    subgraph "Data Layer"
        F[Prisma ORM]
        G[(PostgreSQL Database)]
    end
    
    A --> B
    A --> C
    C --> C1
    C --> C2
    C --> C3
    C --> C4
    C --> C5
    C --> D
    D --> D1
    D --> D2
    D --> D3
    D --> D4
    D --> D5
    D --> D6
    D --> D7
    D1 --> E1
    D2 --> E2
    D3 --> E3
    D4 --> E4
    E1 --> F
    E2 --> F
    E3 --> F
    E4 --> F
    F --> G
```

## 4. Диаграмма последовательности - Запись на курс

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant P as Course Page
    participant EC as EnrollmentsContext
    participant API as /api/enrollments
    participant DB as Database
    participant CC as CoursesContext
    
    U->>P: Нажимает "Записаться на курс"
    P->>EC: handleEnroll()
    EC->>API: POST /api/enrollments
    API->>DB: Проверка существующей записи
    DB-->>API: Результат проверки
    alt Запись не существует
        API->>DB: Создание Enrollment
        API->>DB: Увеличение счетчика студентов
        DB-->>API: Enrollment создан
        API-->>EC: Успешный ответ
        EC->>EC: fetchEnrollments()
        EC->>CC: refreshCourses()
        EC-->>P: Обновление состояния
        P-->>U: Отображение статуса "Записан"
    else Запись уже существует
        API-->>EC: Ошибка "Уже записан"
        EC-->>P: Сообщение об ошибке
        P-->>U: Показ ошибки
    end
```

## 5. Диаграмма последовательности - Завершение урока и получение сертификата

```mermaid
sequenceDiagram
    participant U as User
    participant LP as Lesson Page
    participant EC as EnrollmentsContext
    participant API as /api/enrollments/.../complete
    participant DB as Database
    
    U->>LP: Завершает урок
    LP->>EC: completeLesson()
    EC->>API: POST /api/enrollments/{id}/lessons/{id}/complete
    API->>DB: Создание LessonCompletion
    API->>DB: Подсчет завершенных уроков
    API->>DB: Обновление progress в Enrollment
    
    alt progress >= 100%
        API->>DB: Проверка существования Certificate
        alt Certificate не существует
            API->>DB: Создание Certificate
            API->>DB: Генерация certificateNumber
            DB-->>API: Certificate создан
        end
        API-->>EC: Ответ с Certificate
        EC->>EC: fetchEnrollments()
        EC-->>LP: Обновление состояния
        LP-->>U: Уведомление о получении сертификата
    else progress < 100%
        API-->>EC: Ответ без Certificate
        EC-->>LP: Обновление progress
        LP-->>U: Отображение обновленного прогресса
    end
```

## 6. Диаграмма состояний - Enrollment (Запись на курс)

```mermaid
stateDiagram-v2
    [*] --> NotEnrolled: Пользователь не записан
    
    NotEnrolled --> Enrolling: Нажатие "Записаться"
    Enrolling --> Enrolled: Успешная запись
    Enrolling --> NotEnrolled: Ошибка записи
    
    Enrolled --> InProgress: Начало прохождения
    InProgress --> LessonCompleted: Завершение урока
    LessonCompleted --> InProgress: Продолжение курса
    LessonCompleted --> Completed: Все уроки завершены
    
    Completed --> CertificateGenerated: Генерация сертификата
    CertificateGenerated --> [*]
    
    Enrolled --> Unenrolled: Отписка от курса
    InProgress --> Unenrolled: Отписка от курса
    Unenrolled --> [*]
```

## 7. Диаграмма вариантов использования (Use Case Diagram)

```mermaid
graph TB
    subgraph "Актеры"
        Student[Студент]
        Teacher[Преподаватель]
        Admin[Администратор]
    end
    
    subgraph "Основные функции"
        UC1[Регистрация/Вход]
        UC2[Просмотр курсов]
        UC3[Запись на курс]
        UC4[Прохождение уроков]
        UC5[Получение сертификата]
        UC6[Просмотр вебинаров]
        UC7[Добавление в избранное]
        UC8[Оставление отзывов]
        UC9[Создание курса]
        UC10[Управление уроками]
        UC11[Управление пользователями]
        UC12[Просмотр статистики]
    end
    
    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7
    Student --> UC8
    
    Teacher --> UC1
    Teacher --> UC2
    Teacher --> UC9
    Teacher --> UC10
    Teacher --> UC8
    
    Admin --> UC1
    Admin --> UC2
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
```

## 8. Диаграмма развертывания (Deployment Diagram)

```mermaid
graph TB
    subgraph "Клиент"
        Browser[Веб-браузер]
    end
    
    subgraph "Frontend Server"
        NextJS[Next.js Application]
        Static[Static Files]
    end
    
    subgraph "Backend API"
        API[API Routes]
        Prisma[Prisma Client]
    end
    
    subgraph "Database Server"
        PostgreSQL[(PostgreSQL Database)]
    end
    
    Browser --> NextJS
    Browser --> Static
    NextJS --> API
    API --> Prisma
    Prisma --> PostgreSQL
```

## Описание диаграмм

### 1. ER-диаграмма
Показывает структуру базы данных, связи между таблицами и основные атрибуты каждой сущности.

### 2. Диаграмма классов
Отображает основные классы системы, их атрибуты и методы, а также отношения между классами.

### 3. Диаграмма компонентов
Демонстрирует архитектуру приложения, разделение на слои (Frontend, API, Business Logic, Data Layer).

### 4. Диаграмма последовательности - Запись на курс
Показывает пошаговый процесс записи пользователя на курс с взаимодействием между компонентами.

### 5. Диаграмма последовательности - Завершение урока
Иллюстрирует процесс завершения урока, обновления прогресса и автоматической генерации сертификата при достижении 100%.

### 6. Диаграмма состояний
Отображает жизненный цикл записи на курс (Enrollment) от момента записи до получения сертификата.

### 7. Диаграмма вариантов использования
Показывает основные функции системы и роли пользователей, которые могут их выполнять.

### 8. Диаграмма развертывания
Демонстрирует физическую архитектуру системы и взаимодействие между компонентами на уровне инфраструктуры.
