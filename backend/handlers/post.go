package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)
func GetPosts(c *gin.Context) {
	var posts []models.Post
	db.DB.Find(&posts)
	c.JSON(http.StatusOK, posts)
}
func CreatePost(c *gin.Context) {
	var post models.Post
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&post)
	c.JSON(http.StatusOK, post)
}
func GetPost(c *gin.Context) {
    id := c.Param("id")
    var Post models.Post
    if err := db.DB.First(&Post, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }
    c.JSON(http.StatusOK, Post)
}
func UpdatePost(c *gin.Context) {
    id := c.Param("id")
    var Post models.Post
    if err := db.DB.First(&Post, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }
    var input models.Post
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    db.DB.Model(&Post).Updates(input)
    c.JSON(http.StatusOK, Post)
}
func DeletePost(c *gin.Context) {
    id := c.Param("id")
    var Post models.Post
    if err := db.DB.First(&Post, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }
    db.DB.Delete(&Post)
    c.JSON(http.StatusOK, gin.H{"message": "Post deleted"})
}