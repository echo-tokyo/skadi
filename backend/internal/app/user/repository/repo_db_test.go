package repository

import (
	"log"
	"os"
	"testing"

	"skadi/backend/internal/pkg/db"
)

var _testRepoDB *RepoDB // db repo instance

// Use env-variable TEST_DSN to set data source for db connection.
func TestMain(m *testing.M) {
	dbStorage, err := db.New(os.Getenv("TEST_DSN"),
		db.WithDebugLogLevel(),
		db.WithDisableColorful(),
		db.WithTranslateError(),
		db.WithIgnoreNotFound())
	if err != nil {
		log.Fatalf("connect to db: %v", err)
	}

	_testRepoDB = NewRepoDB(dbStorage)
	os.Exit(m.Run())
}

func TestCreateUserWithProfile(t *testing.T) {
	user_id := 1

	userObj, err := _testRepoDB.GetByIDWithProfile(user_id)
	if err != nil {
		log.Fatalf("get by id: %v", err)
	}
	t.Logf("Gotten user with profile: %+v", userObj)
}
