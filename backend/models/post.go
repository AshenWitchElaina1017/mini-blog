package models

import (
	"time"
)

type Post struct {
	// gorm.Model
	ID        int       `json:"id" gorm:"primaryKey"` // 帖子的唯一标识符
	Title     string    `json:"title"`                // 帖子的标题
	Description *string    `json:"description"`          // 帖子的描述
	Content   string    `json:"content"`              // 帖子的内容
	Author    *string   `json:"author,omitempty"`     // 作者的ID
	Image     *string   `json:"image,omitempty"`      // 帖子的图片链接（可选）
	CreatedAt time.Time `json:"createdAt"`            // 记录创建时间
	UpdatedAt time.Time `json:"updatedAt"`            // 记录最后更新时间
}
