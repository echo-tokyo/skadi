package entity

import (
	"math"

	"gorm.io/gorm"
)

const (
	_defPage    = 1  // default page value for pagination
	_defPerPage = 10 // default per page value for pagination
)

// Pagination represents a pagination parameters for DB list data.
type Pagination struct {
	// current page
	Page int `json:"page" validate:"required" example:"1"`
	// per page objects
	PerPage int `json:"per_page" validate:"required" example:"5" default:"10"`
	// total objects amount
	Total int64 `json:"total" validate:"required" example:"32"`
	// total pages amount
	Pages int `json:"pages"  validate:"required" example:"7"`
}

// NewPagination returns a new instance of Pagination if the given page is not null (zero).
// If the given page is null (zero) it returns nil.
func NewPagination(page, perPage int) *Pagination {
	var pageParams *Pagination // init nil params
	if page == 0 && perPage == 0 {
		return nil
	}

	pageParams = &Pagination{
		Page:    page,
		PerPage: perPage,
	}
	if pageParams.PerPage == 0 {
		pageParams.PerPage = _defPerPage
	}
	if pageParams.Page == 0 {
		pageParams.Page = _defPage
	}
	return pageParams
}

// Query takes a DB tx and applies a limit and offset to it with pagination values.
func (p *Pagination) Query(tx *gorm.DB) *gorm.DB {
	return tx.Limit(p.PerPage).Offset((p.Page - 1) * p.PerPage)
}

// CountTotal counts total objects that will be received with
// the given query and counts total pages amount.
// Total value will not counts if the given tx has not Model()/Table() statement
func (p *Pagination) CountTotal(tx *gorm.DB) {
	tx.Count(&p.Total)
	// calc pages amount
	p.Pages = int(math.Ceil(float64(p.Total) / float64(p.PerPage)))
}
