package entity

import (
	"gorm.io/gorm"
)

const _defPerPage = 10 // default per page value for pagination

// Pagination represents a pagination parameters for DB list data.
type Pagination struct {
	Page    int `json:"page" validate:"omitempty" example:"1"`
	PerPage int `json:"per_page" validate:"omitempty" example:"5" default:"10"`
}

// NewPagination returns a new instance of Pagination if the given page is not null (zero).
// If the given page is null (zero) it returns nil.
func NewPagination(page, perPage int) *Pagination {
	var pageParams *Pagination // init nil params
	if page == 0 {
		return nil
	}

	pageParams = &Pagination{
		Page:    page,
		PerPage: perPage,
	}
	if pageParams.PerPage == 0 {
		pageParams.PerPage = _defPerPage
	}
	return pageParams
}

// Query takes a DB tx and applies a limit and offset to it with pagination values.
func (p *Pagination) Query(tx *gorm.DB) *gorm.DB {
	return tx.Limit(p.PerPage).Offset((p.Page - 1) * p.PerPage)
}
