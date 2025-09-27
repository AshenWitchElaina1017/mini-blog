package handlers
import (
	"backend/db"
	"backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// 定义一个私有的密钥，用于JWT签名。在生产环境中应从环境变量获取！
var jwtKey = []byte("your_secret_key")
func GetJwtKey() []byte {
	return jwtKey
}

// Claims 定义了 JWT 的载荷结构
// @property {uint} UserID - 用户的唯一标识符
// @property {jwt.RegisteredClaims} - 包含了标准的 JWT 声明（如过期时间）
type Claims struct {
	UserID uint `json:"userId"`
	jwt.RegisteredClaims
}

func Register(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	// 绑定并校验 JSON 输入
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 使用 bcrypt 对密码进行哈希处理
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	// 创建用户模型
	user := models.User{Username: input.Username, Password: string(hashedPassword)}
	result := db.DB.Create(&user)
	// 如果创建失败（例如，用户名已存在），则返回错误
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	// 返回成功消息
	c.JSON(http.StatusOK, gin.H{"message": "Registration successful"})
}
// Login 处理用户登录请求
// @param {*gin.Context} c - Gin 的上下文对象
// 该函数会验证用户的用户名和密码。
// 如果验证成功，会生成一个包含用户 ID 和过期时间的 JWT 并返回给客户端。
func Login(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	// 绑定并校验 JSON 输入
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	var user models.User
	// 根据用户名在数据库中查找用户
	if err := db.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	// 使用 bcrypt 校验哈希后的密码是否与用户输入的密码匹配
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	// 创建 JWT
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	//对 Token 进行签名，生成最终的 Token 字符串
	tokenString, err := token.SignedString(GetJwtKey())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}
