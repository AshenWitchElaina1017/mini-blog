package db

import (
	"backend/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	var err error
	DB, err = gorm.Open(sqlite.Open("mini-blog.db"), &gorm.Config{})
	// DB, err := gorm.Open(sqlite.Open("mini-blog.db"), &gorm.Config{}) 错误用法，err为局部变量，会导致DB降级为局部变量
	if err != nil {
		panic("failed to connect database")
	}
	DB.AutoMigrate(&models.Post{}, &models.User{})
}
