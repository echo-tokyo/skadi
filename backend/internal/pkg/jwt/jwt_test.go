package jwt

import (
	"os"
	"testing"
	"time"
)

var (
	_testJWTSecret = []byte("example-secret")
	_testClaims    = &TokenClaims{
		Exp: time.Now().UTC().Unix(),
		ExtraClaims: map[string]string{
			"user_id": "1",
		},
	}

	_testBuilder *Builder
)

func TestMain(m *testing.M) {
	// init builder
	_testBuilder = NewBuilder(_testJWTSecret)
	// run tests
	os.Exit(m.Run())
}

func BenchmarkObtainRefresh(b *testing.B) {
	for b.Loop() {
		_testBuilder.ObtainRefresh(_testClaims)
	}
}

func BenchmarkObtainAccess(b *testing.B) {
	for b.Loop() {
		_testBuilder.ObtainAccess(_testClaims)
	}
}
