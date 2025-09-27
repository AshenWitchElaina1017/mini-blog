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

	// --- 修改 CORS 配置 ---
	config := cors.DefaultConfig()
	// 允许你的 React 应用源
	config.AllowOrigins = []string{"http://localhost:5173"}
	// 允许的请求方法，必须包含 "OPTIONS" 用于处理预检请求
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	// 允许的请求头，必须包含 "Authorization" 和 "Content-Type"
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}

	router.Use(cors.New(config))

	api := router.Group("/api")
	{
		// 认证相关路由
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)

		// 文章相关路由
		api.GET("/posts", handlers.GetPosts)
		// 注意：需要认证的路由应该放在一个中间件保护的组里（这是下一步的优化）
		api.POST("/posts", handlers.CreatePost)
		api.GET("/posts/:id", handlers.GetPost)
		api.PUT("/posts/:id", handlers.UpdatePost)
		api.DELETE("/posts/:id", handlers.DeletePost)
	}

	router.Run()
}
