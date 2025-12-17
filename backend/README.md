# Онлайн-сервис для школы Skadi

## Backend

Бэкенд-часть онлайн-сервиса для школы Skadi.

### Конфигурация

#### Насторойка yaml-конфига

Пример `yaml`-конфига приведён в корне проекта.
После сборки этот файл должен лежать рядом с бинарником.

#### Насторойка переменных окружения

Пример переменных окружения:

```dotenv
DB_PASSWORD="strong#password"
JWT_SECRET="example-secret"
```

### Тестовый стенд (для frontend'а)

Пошаговая инструкция, как развернуть тестовый стенд для frontend'а.

#### 1. Клонировать репозиторий и перейти в корень проекта

```shell
git clone https://github.com/echo-tokyo/skadi
cd ./skadi
```

> ! _Далее все действия проводятся из корневой директории проекта_ !

#### 2. Скопировать конфигурационные файлы

В каталоге `./test-stand/frontend` лежат конфиг-файлы для тестового стенда для frontend'а.
Нужно скопировать содержимое файлов:

1. `./test-stand/frontend/backend.env` в файл `./backend/.env`
2. `./test-stand/frontend/mysql.env` в файл `./mysql/.env`
3. `./test-stand/frontend/backend-config.yml` в файл `./backend/config.yml`

#### 3. Запустить `compose` файл для frontend'а

```shell
docker compose -f dev.front.docker-compose.yml up -d --build
```

Проверить, что все сервисы стартовали, можно командой:

```shell
docker compose -f dev.front.docker-compose.yml ps
```

#### 4. Провести миграции БД

```shell
docker exec -it skadi_backend /bin/sh -c "/app/migrator up"
```

#### 5. Создать первого юзера

Эта команда запускает CLI-менеджер.

```shell
docker exec -it skadi_backend /bin/sh -c "/app/app manager"
```

После его запуска предложится список доступных действий.
Необходимо выбрать `create-user` для создания нового юзера.
Следуя инструкциям, создайте пользователя.

#### 6. Готово

Backend доступен по [адресу](http://127.0.0.1:8000/api/v1).
Swagger документация доступна по [адресу](http://127.0.0.1:8000/api/v1/docs).

> Чтобы опустить стенд, используйте:

```shell
docker compose -f dev.front.docker-compose.yml down
```

### Особенности работы программы

Время везде использует часовой пояс `UTC`. Это единый часовой пояс.
Предполагается перевод времени в локальный(ые) часовой(ые) пояс(а) на клиенте.
