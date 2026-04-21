package server

import (
	"gorm.io/gorm"

	"skadi/backend/config"
	authhttpv1 "skadi/backend/internal/app/auth/controller/http/v1"
	authrepo "skadi/backend/internal/app/auth/repository"
	authuc "skadi/backend/internal/app/auth/usecase"
	classhttpv1 "skadi/backend/internal/app/class/controller/http/v1"
	classrepo "skadi/backend/internal/app/class/repository"
	classuc "skadi/backend/internal/app/class/usecase"
	examplehttpv1 "skadi/backend/internal/app/example/controller/http/v1"
	filehttpv1 "skadi/backend/internal/app/file/controller/http/v1"
	filerepo "skadi/backend/internal/app/file/repository"
	fileuc "skadi/backend/internal/app/file/usecase"
	"skadi/backend/internal/app/service/server/middleware"
	solhttpv1 "skadi/backend/internal/app/solution/controller/http/v1"
	solrepo "skadi/backend/internal/app/solution/repository"
	soluc "skadi/backend/internal/app/solution/usecase"
	statusrepo "skadi/backend/internal/app/status/repository"
	taskhttpv1 "skadi/backend/internal/app/task/controller/http/v1"
	taskrepo "skadi/backend/internal/app/task/repository"
	taskuc "skadi/backend/internal/app/task/usecase"
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
	authRepoCache := authrepo.NewRepoCache(cfg, cacheStorage)
	userRepoDB := userrepo.NewRepoDB(dbStorage)
	classRepoDB := classrepo.NewRepoDB(dbStorage)
	taskRepoDB := taskrepo.NewRepoDB(dbStorage)
	solRepoDB := solrepo.NewRepoDB(dbStorage)
	statusRepoDB := statusrepo.NewRepoDB(dbStorage)
	fileRepoDB := filerepo.NewRepoDB(dbStorage)
	// create usecases
	authUCClient := authuc.NewUCClient(cfg, userRepoDB, authRepoCache)
	authUCMiddleware := authuc.NewUCMiddleware(cfg, authRepoCache)
	userUCAdminClient := useruc.NewUCAdminClient(cfg, userRepoDB, classRepoDB)
	classUCAdminClient := classuc.NewUCAdminClient(cfg, classRepoDB, userRepoDB)
	taskUCTeacher := taskuc.NewUCTeacher(cfg, taskRepoDB, userRepoDB)
	solUCClient := soluc.NewUCClient(cfg, solRepoDB, taskRepoDB)
	solUCStudent := soluc.NewUCStudent(cfg, solRepoDB, statusRepoDB)
	solUCTeacher := soluc.NewUCTeacher(cfg, solRepoDB, statusRepoDB)
	fileUCClient := fileuc.NewUCClient(cfg, fileRepoDB)
	// create controllers
	authController := authhttpv1.NewAuthController(cfg, authUCClient, valid)
	exampleController := examplehttpv1.NewExampleController()
	userControllerAdmin := userhttpv1.NewUserControllerAdmin(userUCAdminClient, valid)
	userController := userhttpv1.NewUserController(userUCAdminClient, valid)
	classControllerAdmin := classhttpv1.NewClassControllerAdmin(classUCAdminClient, valid)
	classController := classhttpv1.NewClassController(classUCAdminClient, valid)
	taskControllerTeacher := taskhttpv1.NewTaskControllerTeacher(cfg, taskUCTeacher, valid)
	solController := solhttpv1.NewSolController(solUCClient, valid)
	solControllerStudent := solhttpv1.NewSolControllerStudent(solUCStudent, valid)
	solControllerTeacher := solhttpv1.NewSolControllerTeacher(solUCTeacher, valid)
	fileController := filehttpv1.NewFileController(fileUCClient, valid)

	// middlewares
	mwJWTRefresh := middleware.JWTRefresh(cfg, authUCMiddleware)
	mwJWTAccess := middleware.JWTAccess(cfg)
	// register endpoints
	apiV1 := s.fiberApp.Group("/api/v1")
	if s.Debug() { // register example endpoints if server is in debug mode
		examplehttpv1.RegisterEndpoints(apiV1, exampleController,
			mwJWTAccess, middleware.Allow)
	}
	authhttpv1.RegisterEndpoints(apiV1, authController, mwJWTRefresh)
	userhttpv1.RegisterEndpoints(apiV1, userController, userControllerAdmin,
		mwJWTAccess, middleware.Allow)
	classhttpv1.RegisterEndpoints(apiV1, classController, classControllerAdmin,
		mwJWTAccess, middleware.Allow)
	taskhttpv1.RegisterEndpoints(apiV1, taskControllerTeacher, mwJWTAccess, middleware.Allow)
	solhttpv1.RegisterEndpoints(apiV1, solController, solControllerStudent, solControllerTeacher,
		mwJWTAccess, middleware.Allow)
	filehttpv1.RegisterEndpoints(apiV1, fileController, mwJWTAccess, middleware.Allow)
}
