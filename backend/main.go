package main

import (
	"backend/db"
	"backend/handlers"
	"backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.Connect()
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}

	router.Use(cors.New(config))
	api := router.Group("/api")
	{
		// --- 公开路由 (Public Routes) ---
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)
		api.GET("/posts", handlers.GetPosts)
		api.GET("/posts/:id", handlers.GetPost)
		// --- 受保护的路由 (Protected Routes) ---
		authorized := api.Group("/")
		authorized.Use(middleware.AuthMiddleware())
		{
			authorized.POST("/posts", handlers.CreatePost)
			authorized.PUT("/posts/:id", handlers.UpdatePost)
			authorized.DELETE("/posts/:id", handlers.DeletePost)
		}
	}
	router.Run()
}
