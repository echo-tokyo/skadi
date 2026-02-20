package slices

import (
	"cmp"
	"slices"
)

// DelDupls deletes duplicates from the given slice and returns updated slice.
func DelDupls[S ~[]E, E cmp.Ordered](s S) S {
	slices.Sort(s)
	return slices.Compact(s)
}
