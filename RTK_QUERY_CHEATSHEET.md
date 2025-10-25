# RTK Query + Redux - Шпаргалка

## Быстрый старт

### В компоненте авторизации

```tsx
import { useSignInMutation } from '@/features/authorization'
import { setCredentials } from '@/features/authorization'
import { useAppDispatch } from '@/app/store'

const [signIn, { isLoading, error }] = useSignInMutation()
const dispatch = useAppDispatch()

const handleLogin = async (formData) => {
  try {
    const result = await signIn(formData).unwrap()
    dispatch(setCredentials({ token: result.token }))
  } catch (err) {
    console.error(err)
  }
}
```

### В любом компоненте (проверка авторизации)

```tsx
import { useAppSelector } from '@/app/store'

const { isAuthenticated, token } = useAppSelector((state) => state.auth)
```

### Выход из системы

```tsx
import { logout } from '@/features/authorization'
import { useAppDispatch } from '@/app/store'

const dispatch = useAppDispatch()
const handleLogout = () => dispatch(logout())
```

---

## RTK Query vs Redux - Когда что использовать

| Задача                | Инструмент                            | Где находится                                |
| --------------------- | ------------------------------------- | -------------------------------------------- |
| Запрос к API          | `useSignInMutation()`                 | `features/authorization/api/auth-api.ts`     |
| Сохранить токен       | `dispatch(setCredentials())`          | `features/authorization/model/auth-slice.ts` |
| Проверить авторизацию | `useAppSelector(state => state.auth)` | Любой компонент                              |
| Выход из системы      | `dispatch(logout())`                  | Любой компонент                              |

---

## Структура файлов

```
features/authorization/
├── api/
│   └── auth-api.ts           # RTK Query (POST /signin)
├── model/
│   ├── auth-slice.ts         # Redux (token, isAuthenticated)
│   └── types.ts              # Интерфейсы
├── ui/
│   └── SignIn.tsx            # Форма авторизации
└── index.ts                  # Публичный API
```

---

## Ключевые концепции

### 1. RTK Query - для работы с API

- Автоматический кэш
- Управление loading/error
- Не хранит данные в Redux (только кэш)

### 2. Redux Slice - для глобального состояния

- Хранит token и isAuthenticated
- Синхронизация с localStorage
- Доступен везде через useAppSelector

### 3. Как они работают вместе

```
RTK Query (запрос) → Получить token → Redux (сохранить) → Компоненты (использовать)
```

---

## Часто используемые команды

### Добавить новый endpoint в authApi

```typescript
// features/authorization/api/auth-api.ts
endpoints: (builder) => ({
  signOut: builder.mutation<void, void>({
    query: () => ({ url: '/signout', method: 'POST' }),
  }),
})

// Автоматически создается хук:
export const { useSignOutMutation } = authApi
```

### Добавить новое действие в authSlice

```typescript
// features/authorization/model/auth-slice.ts
reducers: {
  updateToken: (state, action: PayloadAction<string>) => {
    state.token = action.payload
    localStorage.setItem('token', action.payload)
  },
}
```

---

## Troubleshooting

### Ошибка: "Cannot read properties of undefined (reading 'auth')"

→ Проверьте что Provider подключен в app/main.tsx

### Ошибка: "useSignInMutation is not a function"

→ Проверьте экспорт в features/authorization/api/auth-api.ts

### Токен не сохраняется

→ Проверьте что вызываете dispatch(setCredentials({ token }))

### isLoading всегда false

→ Используйте .unwrap() при вызове mutation
