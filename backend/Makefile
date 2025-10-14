go_exec="./cmd/app/main.go"

# --- #
# DEV #
# --- #

dev:
	go run $(go_exec)

lint:
	golangci-lint run

# ---- #
# PROD #
# ---- #

up:
	CGO_ENABLED=0 go build -o ./bin/app $(go_exec)

migrate:
	echo "migrate rule has not set yet"
