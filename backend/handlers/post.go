package handlers

import (
	"backend/db"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func handleTags(tagNames []string) []*models.Tag {
	var tags []*models.Tag
	for _, name := range tagNames {
		var tag models.Tag
		db.DB.FirstOrCreate(&tag, models.Tag{Name: name})
		tags = append(tags, &tag)
	}
	return tags
}

func GetPosts(c *gin.Context) {
	var posts []models.Post
	db.DB.Order("weight desc, created_at desc").Preload("Tags").Find(&posts)
	c.JSON(http.StatusOK, posts)
}

func CreatePost(c *gin.Context) {
	var input struct {
		models.Post
		Tags []string `json:"tags"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(uint)
	username := c.MustGet("username").(string)
	userRole := c.MustGet("userRole").(string)

	post := input.Post
	post.UserID = userID
	post.Author = username

	if userRole != "admin" {
		post.Weight = 0
	}

	post.Tags = handleTags(input.Tags)

	db.DB.Create(&post)
	c.JSON(http.StatusOK, post)
}

func GetPost(c *gin.Context) {
	id := c.Param("id")
	var post models.Post
	if err := db.DB.Preload("Tags").First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}
	c.JSON(http.StatusOK, post)
}

func UpdatePost(c *gin.Context) {
	id := c.Param("id")
	var post models.Post
	if err := db.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	requestingUserID := c.MustGet("userID").(uint)
	requestingUserRole := c.MustGet("userRole").(string)

	if requestingUserRole != "admin" && post.UserID != requestingUserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "您没有权限修改这篇文章"})
		return
	}

	var input struct {
		Title       string   `json:"title"`
		Description *string  `json:"description"`
		Content     string   `json:"content"`
		Author      string   `json:"author"`
		Image       *string  `json:"image"`
		Weight      int      `json:"weight"`
		Tags        []string `json:"tags"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	post.Title = input.Title
	post.Description = input.Description
	post.Content = input.Content
	post.Image = input.Image

	if requestingUserRole == "admin" {
		post.Author = input.Author
		post.Weight = input.Weight
	}

	newTags := handleTags(input.Tags)
	db.DB.Model(&post).Association("Tags").Replace(newTags)

	db.DB.Save(&post)
	db.DB.Preload("Tags").First(&post, id)
	c.JSON(http.StatusOK, post)
}

func DeletePost(c *gin.Context) {
	id := c.Param("id")
	var post models.Post
	if err := db.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	requestingUserID := c.MustGet("userID").(uint)
	requestingUserRole := c.MustGet("userRole").(string)

	if requestingUserRole != "admin" && post.UserID != requestingUserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "您没有权限删除这篇文章"})
		return
	}

	db.DB.Model(&post).Association("Tags").Clear()
	db.DB.Delete(&post)
	c.JSON(http.StatusOK, gin.H{"message": "Post deleted"})
}

func GetTags(c *gin.Context) {
	var tags []models.Tag
	db.DB.Find(&tags)
	c.JSON(http.StatusOK, tags)
}

func GetPostsByTag(c *gin.Context) {
	tagName := c.Param("name")
	var tag models.Tag
	if err := db.DB.Where("name = ?", tagName).Preload("Posts.Tags").First(&tag).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tag not found"})
		return
	}
	c.JSON(http.StatusOK, tag.Posts)
}
