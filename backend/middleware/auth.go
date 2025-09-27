package middleware
import (
	"backend/handlers" 
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware 创建一个 Gin 中间件，用于 JWT 认证
// 功能：
// 1. 从请求头 "Authorization" 中提取 Bearer Token。
// 2. 校验 Token 的有效性（签名、是否过期等）。
// 3. 如果 Token 无效或缺失，则中止请求并返回 401 Unauthorized。
// 4. 如果 Token 有效，则允许请求继续处理。
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "请求未包含授权 Token"})
			c.Abort()
			return
		}
		// 按空格分割 "Bearer <token>" 格式的字符串
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "授权 Token 格式不正确"})
			c.Abort()
			return
		}
		// 提取 Token 字符串
		tokenString := parts[1]
		// 解析并验证 Token
		claims := &handlers.Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return handlers.GetJwtKey(), nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的授权 Token"})
			c.Abort()
			return
		}
		// 验证通过，可以将用户信息（例如 claims.UserID）存储在 Gin 的上下文中，
		c.Set("userID", claims.UserID)
		c.Next()
	}
}
