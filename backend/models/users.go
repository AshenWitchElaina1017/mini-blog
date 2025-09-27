// mini-blog/backend/models/user.go
package models

import "time"

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"unique;not null"` // 用户名，唯一且不能为空
	Password  string    `json:"-"`                               // 密码，在JSON响应中忽略
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
