package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("your_secret_key")

func GetJwtKey() []byte {
	return jwtKey
}

type Claims struct {
	UserID   uint   `json:"userId"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func Register(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	var userCount int64
	db.DB.Model(&models.User{}).Count(&userCount)

	userRole := "user"
	if userCount == 0 {
		userRole = "admin"
	}

	user := models.User{Username: input.Username, Password: string(hashedPassword), Role: userRole}
	result := db.DB.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Registration successful"})
}

func Login(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.User
	if err := db.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID:   user.ID,
		Username: user.Username,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(GetJwtKey())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"role":     user.Role,
		},
	})
}

func GetUsers(c *gin.Context) {
	var users []models.User
	db.DB.Find(&users)
	c.JSON(http.StatusOK, users)
}

func PromoteUser(c *gin.Context) {
	var user models.User
	id := c.Param("id")

	if err := db.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Role = "admin"
	db.DB.Save(&user)

	c.JSON(http.StatusOK, user)
}

// DemoteUser 将指定用户降级为普通用户
// @Summary 降级用户
// @Description 只有超级管理员 (ID=1) 才能将其他管理员降级为普通用户
// @Accept  json
// @Produce  json
// @Param id path int true "用户 ID"
// @Success 200 {object} models.User
// @Failure 400 {object} gin.H "请求错误"
// @Failure 401 {object} gin.H "认证失败"
// @Failure 403 {object} gin.H "权限不足"
// @Failure 404 {object} gin.H "用户未找到"
// @Router /admin/users/{id}/demote [post]
func DemoteUser(c *gin.Context) {
	// 从中间件获取当前操作者的用户ID
	requestingUserID := c.MustGet("userID").(uint)

	// 检查操作者是否是超级管理员 (ID=1)
	if requestingUserID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "无权操作，仅超级管理员可执行此操作"})
		c.Abort()
		return
	}

	// 获取要降级的用户的ID
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的用户ID"})
		return
	}

	// 检查是否试图降级超级管理员自己
	if uint(id) == requestingUserID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "不能降级超级管理员"})
		return
	}

	// 查找目标用户
	var user models.User
	if err := db.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// 执行降级操作
	user.Role = "user"
	db.DB.Save(&user)

	// 返回更新后的用户信息
	c.JSON(http.StatusOK, user)
}
