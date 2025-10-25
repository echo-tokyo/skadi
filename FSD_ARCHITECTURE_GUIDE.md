# FSD Architecture Guide - Skadi Project

## Entities vs Features - Ключевые различия

### Entities (Сущности)
**Что это:** Бизнес-сущности приложения

**Характеристики:**
- Представляют данные (User, Product, Order, Comment и т.д.)
- НЕ содержат действий пользователя
- Переиспользуемые между разными фичами
- Отвечают на вопрос "Что это?"

**Пример структуры:**
```
entities/
  user/
    model/
      userSlice.ts      # Redux state: { id, name, role, email, avatar }
      types.ts          # type User = { id: string; name: string; ... }
    ui/
      UserCard.tsx      # Компонент для отображения пользователя
      UserAvatar.tsx    # Аватар пользователя
    api/
      userApi.ts        # CRUD операции: getUser(), updateUser()
    index.ts
```

### Features (Фичи)
**Что это:** Действия пользователя (бизнес-процессы)

**Характеристики:**
- Интерактивная логика
- Используют entities
- Содержат конкретные действия
- Отвечают на вопрос "Что делает пользователь?"

**Пример структуры:**
```
features/
  auth/                 # Действие: авторизация
    model/
      authSlice.ts      # Redux state: { isAuth, tokens, isLoading, error }
      types.ts          # type LoginCredentials, AuthResponse
    api/
      authApi.ts        # signIn(), signOut(), refreshToken()
    lib/
      helpers.ts        # saveTokens(), clearTokens()
    ui/
      SignInForm.tsx    # Форма входа (опционально)
    index.ts
```

---

## Архитектура авторизации в проекте

### Правильное разделение ответственности:

#### Shared Layer
```
shared/
  api/
    http/
      api-http.ts       # Базовая конфигурация axios
      utils/            # Вспомогательные функции
```
**Ответственность:** Общая конфигурация HTTP клиента, интерцепторы

#### Features Layer
```
features/
  auth/
    api/
      authApi.ts        # signIn(credentials), signOut(), refreshToken()
    model/
      authSlice.ts      # Состояние процесса авторизации
      types.ts          # LoginCredentials, AuthResponse
    lib/
      helpers.ts        # saveTokens(), clearTokens()
    index.ts            # Публичный API фичи
```
**Ответственность:** Логика процесса авторизации, управление токенами

#### Entities Layer
```
entities/
  user/
    model/
      userSlice.ts      # Глобальное состояние пользователя
      types.ts          # type User
    api/
      userApi.ts        # getMe(), updateProfile()
    index.ts
```
**Ответственность:** Данные текущего пользователя, профиль

#### Pages Layer
```
pages/
  authorization/
    ui/
      Authorization.tsx # Композиция UI + использование features/auth
    index.ts
```
**Ответственность:** Компоновка фичи и UI для страницы

---

## Как слои взаимодействуют (Flow авторизации):

1. **User вводит логин/пароль** → `pages/authorization`
2. **Вызывается** → `features/auth/api/authApi.signIn()`
3. **API возвращает** → `{ token, user: { id, name, role } }`
4. **Токен сохраняется** → `features/auth/model/authSlice` + localStorage
5. **Данные юзера сохраняются** → `entities/user/model/userSlice`
6. **Redirect** → `/main`

---

## Минимальный старт для авторизации:

Если не нужно хранить данные пользователя глобально, можно начать только с:

```
features/
  auth/
    api/
      authApi.ts        # Функция signIn({ login, password })
    model/
      types.ts          # LoginCredentials, AuthResponse
    index.ts
```

**Когда добавить entities/user:**
- Нужны данные юзера в разных местах приложения
- Есть профиль пользователя
- Нужна глобальная проверка роли/прав

---

## Простое правило запоминания:

| Слой | Вопрос | Пример |
|------|--------|--------|
| **Entities** | "Что это?" | User, Product, Order |
| **Features** | "Что делает юзер?" | Войти, Купить, Отменить |

---

## Текущая структура проекта:

```
src/
  app/                  # Инициализация приложения, роутинг
  pages/
    authorization/      # Страница авторизации
    main/               # Главная страница
  shared/
    api/                # HTTP клиент (axios)
    ui/                 # Переиспользуемые компоненты
      button/
      input/
```

---

## Рекомендации по развитию:

1. Создать `features/auth` для логики авторизации
2. При необходимости добавить `entities/user` для глобального состояния
3. Документировать архитектурные решения
4. Делать коммиты с понятными сообщениями

---

**Создано:** 2025-10-22
**Проект:** Skadi (Frontend FSD)
