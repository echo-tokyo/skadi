package server

import (
	"gorm.io/gorm"

	"skadi/backend/config"
	authhttpv1 "skadi/backend/internal/app/auth/controller/http/v1"
	authrepo "skadi/backend/internal/app/auth/repository"
	authuc "skadi/backend/internal/app/auth/usecase"
	examplehttpv1 "skadi/backend/internal/app/example/controller/http/v1"
	"skadi/backend/internal/app/service/server/middleware"
	userhttpv1 "skadi/backend/internal/app/user/controller/http/v1"
	userrepo "skadi/backend/internal/app/user/repository"
	useruc "skadi/backend/internal/app/user/usecase"
	"skadi/backend/internal/pkg/cache"
	"skadi/backend/internal/pkg/validator"
)

// registerEndpointsV1 register all endpoints for 1st version of API.
func (s *Server) registerEndpointsV1(cfg *config.Config, dbStorage *gorm.DB,
	cacheStorage cache.Storage, valid validator.Validator) {

	// create repos
	authRepoDB := authrepo.NewRepoDB(dbStorage)
	authRepoCache := authrepo.NewRepoCache(cfg, cacheStorage)
	userRepoDB := userrepo.NewRepoDB(dbStorage)
	// create usecases
	authUCClient := authuc.NewUCClient(cfg, authRepoDB, authRepoCache)
	authUCMiddleware := authuc.NewUCMiddleware(cfg, authRepoCache)
	userUCAdmin := useruc.NewUCAdmin(cfg, userRepoDB)
	// create controllers
	authController := authhttpv1.NewAuthController(cfg, authUCClient, valid)
	exampleController := examplehttpv1.NewExampleController()
	userController := userhttpv1.NewUserController(cfg, userUCAdmin, valid)

	// middlewares
	mwJWTRefresh := middleware.JWTRefresh(cfg, authUCMiddleware)
	mwJWTAccess := middleware.JWTAccess(cfg)
	mwAdmin := middleware.Admin()
	mwTeacher := middleware.Teacher()
	mwStudent := middleware.Student()

	// register endpoints
	apiV1 := s.fiberApp.Group("/api/v1")
	if s.Debug() { // register example endpoints if server is in debug mode
		examplehttpv1.RegisterEndpoints(apiV1, exampleController,
			mwJWTAccess, mwAdmin, mwTeacher, mwStudent)
	}
	authhttpv1.RegisterEndpoints(apiV1, authController, mwJWTRefresh)
	userhttpv1.RegisterEndpoints(apiV1, userController, mwJWTAccess, mwAdmin)
}
