// App binary starts full application.
package main

import (
	"log/slog"
	"os"

	"skadi/backend/internal/app"
)

func main() {
	application, err := app.New()
	if err != nil {
		fatal(err)
	}
	if err := application.Run(); err != nil {
		fatal(err)
	}
}

// fatal logs error and exit with code 1.
func fatal(err error) {
	slog.Error(err.Error())
	os.Exit(1)
}
