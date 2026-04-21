package entity

import (
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

// File represents a metadata for the file.
type File struct {
	// file ID
	ID int `json:"id"`
	// filename
	Name string `json:"name"`
	// file MIME-type
	MimeType string `json:"mime_type"`
	// file size in bytes
	Size int64 `json:"size"`
	// filepath
	Path string `json:"-"`
	// prefix for filepath
	pathPrefix string `json:"-"`
}

// TableName determines DB table name for the file object.
func (*File) TableName() string {
	return "file"
}

type FileOption func(*File)

// NewFile returns a new instance of File.
func NewFile(name, mimeType string, size int64, options ...FileOption) *File {
	file := &File{
		Name:     name,
		MimeType: mimeType,
		Size:     size,
	}
	// apply options
	for _, option := range options {
		option(file)
	}
	// generate a new filename
	file.Path = filepath.Join(file.pathPrefix, uuid.NewString())
	return file
}

// FileWithPathPrefix sets custom prefix for file path.
func FileWithPathPrefix(s string) FileOption {
	return func(f *File) {
		f.pathPrefix = s
	}
}

// Remove removes the saved file from the file system.
func (f *File) Remove() {
	os.Remove(f.Path) // nolint:errcheck // doesn't need to be handled for the client
}

// Files represents a slice of File objects.
type Files []*File

// Cleanup removes all files.
func (f Files) Cleanup() {
	for idx := range f {
		f[idx].Remove()
	}
}
