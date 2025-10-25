# Пример использования RTK Query + Redux для авторизации

## Структура проекта

```
src/
  app/
    store/
      index.ts          # Redux store
      hooks.ts          # Типизированные хуки
    main.tsx            # Provider подключен

  features/
    authorization/
      api/
        auth-api.ts     # RTK Query endpoints
      model/
        auth-slice.ts   # Redux state (token, isAuthenticated)
        types.ts        # Интерфейсы
      ui/
        SignIn.tsx      # Компонент формы
```

---

## Пример компонента авторизации

```tsx
// features/authorization/ui/SignIn.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSignInMutation } from '../api/auth-api'
import { setCredentials } from '../model/auth-slice'
import { useAppDispatch } from '@/app/store'
import type { ISignInFormData } from '../model/types'

export const SignIn = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // RTK Query mutation
  const [signIn, { isLoading, error }] = useSignInMutation()

  const [formData, setFormData] = useState<ISignInFormData>({
    login: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Вызываем RTK Query mutation
      const result = await signIn(formData).unwrap()

      // Сохраняем токен в Redux state
      dispatch(setCredentials({ token: result.token }))

      // Редирект на главную
      navigate('/main')
    } catch (err) {
      console.error('Ошибка авторизации:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.login}
        onChange={(e) => setFormData({ ...formData, login: e.target.value })}
        placeholder="Логин"
      />

      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Пароль"
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Загрузка...' : 'Войти'}
      </button>

      {error && <div>Ошибка: {JSON.stringify(error)}</div>}
    </form>
  )
}
```

---

## Как использовать состояние авторизации

```tsx
// Любой компонент
import { useAppSelector } from '@/app/store'
import { logout } from '@/features/authorization/model/auth-slice'
import { useAppDispatch } from '@/app/store'

export const Header = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, token } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>Токен: {token?.slice(0, 10)}...</span>
          <button onClick={handleLogout}>Выйти</button>
        </>
      ) : (
        <span>Не авторизован</span>
      )}
    </header>
  )
}
```

---

## Protected Route (пример)

```tsx
// shared/ui/ProtectedRoute.tsx
import { Navigate } from 'react-router'
import { useAppSelector } from '@/app/store'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/authorization" replace />
  }

  return <>{children}</>
}
```

---

## Как это работает вместе?

### 1. RTK Query (authApi)
- Отправляет запросы на сервер
- Кэширует ответы
- Управляет состоянием загрузки/ошибки
- **НЕ хранит токен** (это делает Redux)

### 2. Redux (authSlice)
- Хранит `token` и `isAuthenticated` глобально
- Синхронизирует с localStorage
- Доступен во всех компонентах

### 3. Взаимодействие
```
1. User нажимает "Войти"
   ↓
2. useSignInMutation() → POST /signin
   ↓
3. Сервер возвращает { token: "abc123" }
   ↓
4. dispatch(setCredentials({ token }))
   ↓
5. Redux сохраняет в state + localStorage
   ↓
6. navigate('/main')
```

---

## Преимущества

✅ **RTK Query** автоматически управляет:
- loading/error состояниями
- кэшем запросов
- повторными попытками

✅ **Redux** управляет:
- глобальным состоянием авторизации
- доступом к токену из любого места

✅ **Разделение ответственности по FSD:**
- `api/` — RTK Query endpoints
- `model/` — Redux state + типы
- `ui/` — компоненты

---

## Следующие шаги

1. Добавить обработку ошибок
2. Реализовать refresh token
3. Добавить signOut endpoint
4. Создать middleware для автоматического обновления токена
