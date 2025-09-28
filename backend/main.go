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
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)
		api.GET("/posts", handlers.GetPosts)
		api.GET("/posts/:id", handlers.GetPost)
		api.GET("/tags", handlers.GetTags)
		api.GET("/posts/tag/:name", handlers.GetPostsByTag)

		authorized := api.Group("/")
		authorized.Use(middleware.AuthMiddleware())
		{
			authorized.POST("/posts", handlers.CreatePost)
			authorized.PUT("/posts/:id", handlers.UpdatePost)
			authorized.DELETE("/posts/:id", handlers.DeletePost)
		}

		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
		{
			admin.GET("/users", handlers.GetUsers)
			admin.POST("/users/:id/promote", handlers.PromoteUser)
		}
	}

	router.Run()
}
