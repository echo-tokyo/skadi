// Package usecase contains class.UsecaseAdmin and class.UsecaseClient implementations.
package usecase

import (
	"skadi/backend/config"
	"skadi/backend/internal/app/class"
)

// Ensure UCAdmin implements interfaces.
var _ class.UsecaseAdmin = (*UCAdminClient)(nil)
var _ class.UsecaseClient = (*UCAdminClient)(nil)

// UCAdminClient represents a class usecase for admin and client.
// It implements the class.UsecaseAdmin and the class.UsecaseClient interfaces.
type UCAdminClient struct {
	cfg         *config.Config
	classRepoDB class.RepositoryDB
}

// NewUCAdminClient returns a new instance of UCAdminClient.
func NewUCAdminClient(cfg *config.Config, classRepoDB class.RepositoryDB) *UCAdminClient {
	return &UCAdminClient{
		cfg:         cfg,
		classRepoDB: classRepoDB,
	}
}
