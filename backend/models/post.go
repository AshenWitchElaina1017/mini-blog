package models

import (
	"time"
)

type Post struct {
	ID          int       `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title"`
	Description *string   `json:"description"`
	Content     string    `json:"content"`
	UserID      uint      `json:"userId"`
	Author      string    `json:"author"`
	Image       *string   `json:"image,omitempty"`
	Weight      int       `json:"weight" gorm:"default:0"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Tags        []*Tag    `json:"tags" gorm:"many2many:post_tags;"`
}
