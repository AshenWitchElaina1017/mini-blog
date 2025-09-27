package main

import (
	"backend/db"
	"backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.Connect()
	router := gin.Default()
	// 配置 CORS
	config := cors.DefaultConfig()
	// 允许你的 React 应用源
	config.AllowOrigins = []string{"http://localhost:5173"}
	router.Use(cors.New(config))

	api := router.Group("/api")
	{
		api.GET("/posts", handlers.GetPosts)
		api.POST("/posts", handlers.CreatePost)
		api.GET("/posts/:id", handlers.GetPost)
		api.PUT("/posts/:id", handlers.UpdatePost)
		api.DELETE("/posts/:id", handlers.DeletePost)
	}
	router.Run()
}
