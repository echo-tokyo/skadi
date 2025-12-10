go_exec="./cmd/app/main.go"
server_runner_path="./internal/app/service/server/server.go"
go_migrator_path="./cmd/migrator/main.go"

# title of migration
title = "migration"
version = 1

# --- #
# DEV #
# --- #

dev-runserver:
	go run $(go_exec) runserver

dev-manager:
	go run $(go_exec) manager

lint:
	golangci-lint run

# ------- #
# SWAGGER #
# ------- #

swagger-update:
	@swag init -g $(server_runner_path)

swagger-fmt:
	@swag fmt -g $(server_runner_path)

swagger: swagger-fmt swagger-update

# ---------- #
# MIGRATIONS #
# ---------- #

# use "title" var for name the migration
.PHONY: migrations
migrations:
	migrate create -digits 2 -dir migrations -ext sql -seq "$(title)"

# use "version" var for specify the version of the migration to force
migrate-force:
	@go run $(go_migrator_path) force $(version)

migrate-status:
	@go run $(go_migrator_path) status

migrate-up:
	@go run $(go_migrator_path) up -n 1

migrate-down:
	@go run $(go_migrator_path) down -n 1

# ---- #
# PROD #
# ---- #

up:
	docker compose up --build -d

migrate:
	docker exec -it skadi_backend /bin/sh -c "/app/migrator up"

manager:
	docker exec -it skadi_backend /bin/sh -c "/app/app manager"
