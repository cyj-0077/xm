package controllers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	database "school1/config"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UserController struct{}

func NewUserController() *UserController {
	return &UserController{}
}

// GetCounts 获取学生和教师的数量
func (uc *UserController) GetCounts(c *gin.Context) {
	var studentCount, teacherCount int

	// 查询学生数量
	err := database.DB.QueryRow("SELECT COUNT(*) FROM student").Scan(&studentCount)
	if err != nil {
		log.Printf("查询学生数量失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取学生数量失败"})
		return
	}

	// 查询教师数量
	err = database.DB.QueryRow("SELECT COUNT(*) FROM teacher").Scan(&teacherCount)
	if err != nil {
		log.Printf("查询教师数量失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取教师数量失败"})
		return
	}

	// 返回数量
	c.JSON(http.StatusOK, gin.H{
		"studentCount": studentCount,
		"teacherCount": teacherCount,
	})
}

// Register 用户注册
func (uc *UserController) Register(c *gin.Context) {
	var request struct {
		Name       string `json:"name"`
		Time       string `json:"time"` // 入学时间或执教时间
		College    string `json:"college"`
		Department string `json:"department"`
		UserType   string `json:"userType"` // 用户类型，直接用作表名
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}

	// 确定时间字段名
	var timeField string
	if request.UserType == "teacher" {
		timeField = "teachedTime"
	} else if request.UserType == "student" {
		timeField = "studiedTime"
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的用户类型"})
		return
	}

	// 插入用户数据
	query := fmt.Sprintf("INSERT INTO %s (name, %s, college, department) VALUES (?, ?, ?, ?)", request.UserType, timeField)
	result, err := database.DB.Exec(query, request.Name, request.Time, request.College, request.Department)
	if err != nil {
		log.Printf("插入用户数据失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "注册失败"})
		return
	}

	// 获取插入数据的 ID
	insertedID, err := result.LastInsertId()
	if err != nil {
		log.Printf("获取插入数据ID失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取插入数据ID失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "用户数据存储成功",
		"id":      insertedID,
	})
}

// GetStudents 获取学生信息
func (uc *UserController) GetStudents(c *gin.Context) {
	var students []struct {
		ID          int    `json:"id"`
		Name        string `json:"name"`
		StudiedTime string `json:"studiedTime"`
		College     string `json:"college"`
		Department  string `json:"department"`
	}

	rows, err := database.DB.Query("SELECT id, name, studiedTime, college, department FROM student")
	if err != nil {
		log.Printf("查询学生信息失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取学生信息失败"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var student struct {
			ID          int    `json:"id"`
			Name        string `json:"name"`
			StudiedTime string `json:"studiedTime"`
			College     string `json:"college"`
			Department  string `json:"department"`
		}
		if err := rows.Scan(&student.ID, &student.Name, &student.StudiedTime, &student.College, &student.Department); err != nil {
			log.Printf("扫描学生信息失败: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "获取学生信息失败"})
			return
		}
		students = append(students, student)
	}

	c.JSON(http.StatusOK, students)
}

// GetSingleUser 获取单个用户信息
func (uc *UserController) GetSingleUser(c *gin.Context) {
	var request struct {
		ID   int    `form:"id"`
		Role string `form:"role"`
	}

	if err := c.ShouldBindQuery(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}

	var query string
	var user struct {
		ID         int    `json:"id"`
		Name       string `json:"name"`
		Time       string `json:"time"`
		College    string `json:"college"`
		Department string `json:"department"`
	}

	// 根据角色选择查询语句
	if request.Role == "teacher" {
		query = "SELECT id, name, teachedTime AS time, college, department FROM teacher WHERE id = ?"
	} else if request.Role == "student" {
		query = "SELECT id, name, studiedTime AS time, college, department FROM student WHERE id = ?"
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的用户角色"})
		return
	}

	// 执行查询
	err := database.DB.QueryRow(query, request.ID).Scan(&user.ID, &user.Name, &user.Time, &user.College, &user.Department)
	if err != nil {
		log.Printf("查询用户信息失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取用户信息失败"})
		return
	}

	// 返回用户信息
	c.JSON(http.StatusOK, user)
}

// GetTeachers 获取教师信息
func (uc *UserController) GetTeachers(c *gin.Context) {
	var teachers []struct {
		ID          int    `json:"id"`
		Name        string `json:"name"`
		TeachedTime string `json:"teachedTime"`
		College     string `json:"college"`
		Department  string `json:"department"`
	}

	rows, err := database.DB.Query("SELECT id, name, teachedTime, college, department FROM teacher")
	if err != nil {
		log.Printf("查询教师信息失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取教师信息失败"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var teacher struct {
			ID          int    `json:"id"`
			Name        string `json:"name"`
			TeachedTime string `json:"teachedTime"`
			College     string `json:"college"`
			Department  string `json:"department"`
		}
		if err := rows.Scan(&teacher.ID, &teacher.Name, &teacher.TeachedTime, &teacher.College, &teacher.Department); err != nil {
			log.Printf("扫描教师信息失败: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "获取教师信息失败"})
			return
		}
		teachers = append(teachers, teacher)
	}

	c.JSON(http.StatusOK, teachers)
}

// 发送留言
func (uc *UserController) SendMessage(c *gin.Context) {
	var request struct {
		SenderName     string `json:"senderName"`
		MessageContent string `json:"messageContent"`
		ReceiverName   string `json:"receiverName"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}

	// 插入留言数据
	query := "INSERT INTO message (senderName, senderMessage, receiverName, isRead) VALUES (?, ?, ?, FALSE)"
	result, err := database.DB.Exec(query, request.SenderName, request.MessageContent, request.ReceiverName)
	if err != nil {
		log.Printf("插入留言数据失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "发送留言失败"})
		return
	}

	// 获取插入数据的 ID
	messageId, err := result.LastInsertId()
	if err != nil {
		log.Printf("获取插入数据ID失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取插入数据ID失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   true,
		"messageId": messageId,
	})
}

// GetMessageByMessageId 获取用户留言
func (uc *UserController) GetMessageByMessageId(c *gin.Context) {
	var request struct {
		MessageId string `form:"messageId"`
	}

	if err := c.ShouldBindQuery(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}
	messageId, err := strconv.Atoi(request.MessageId)
	if err != nil {
		log.Printf("转换messageId失败: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的messageId"})
		return
	}

	var message struct {
		SenderName     string `json:"senderName"`
		MessageContent string `json:"messageContent"`
		IsRead         bool   `json:"isRead"`
	}

	// 使用 QueryRow 处理单行结果
	err = database.DB.QueryRow("SELECT senderName, senderMessage, isRead FROM message WHERE messageId = ?", messageId).
		Scan(&message.SenderName, &message.MessageContent, &message.IsRead)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "未找到留言信息"})
		} else {
			log.Printf("查询留言信息失败: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "获取留言信息失败"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": message,
	})
}

// SetMessageRead 设置留言已读状态
func (uc *UserController) SetMessageRead(c *gin.Context) {
	var request struct {
		MessageId int  `json:"messageId"`
		IsRead    bool `json:"isRead"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}
	var tinyInt int
	if request.IsRead {
		tinyInt = 1
	} else {
		tinyInt = 0
	}

	_, err := database.DB.Exec("UPDATE message SET isRead = ? WHERE messageId = ?", tinyInt, request.MessageId)
	if err != nil {
		log.Printf("更新留言状态失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新留言状态失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "留言状态更新成功"})
}

// RegisterVisitor 游客注册
func (uc *UserController) RegisterVisitor(c *gin.Context) {
	var request struct {
		Identity string `json:"identity"`
		Name     string `json:"name"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}

	// 插入游客数据，预约时间设置为 NULL
	query := "INSERT INTO visitor (identity, name, reservationTime) VALUES (?, ?, NULL)"
	_, err := database.DB.Exec(query, request.Identity, request.Name)
	if err != nil {
		log.Printf("插入游客数据失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "注册失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "游客注册成功",
		"code":    200,
	})
}

// LoginVisitor 游客登录
func (uc *UserController) LoginVisitor(c *gin.Context) {
	var request struct {
		Identity string `json:"identity"`
		Name     string `json:"name"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}

	// 检查用户是否存在
	var existingVisitor struct {
		Identity string
		Name     string
	}
	err := database.DB.QueryRow("SELECT identity, name FROM visitor WHERE identity = ?", request.Identity).
		Scan(&existingVisitor.Identity, &existingVisitor.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		} else {
			log.Printf("查询游客信息失败: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "查询失败"})
		}
		return
	}

	// 验证姓名是否匹配
	if existingVisitor.Name != request.Name {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "身份证明与姓名不匹配"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "登录成功",
		"code":    200,
	})
}

// ReserveVisitor 游客预约
func (uc *UserController) ReserveVisitor(c *gin.Context) {
	var request struct {
		Identity        string `json:"identity"`
		ReservationTime string `json:"reservationTime"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}

	// 更新预约时间
	query := "UPDATE visitor SET reservationTime = ? WHERE identity = ?"
	_, err := database.DB.Exec(query, request.ReservationTime, request.Identity)
	if err != nil {
		log.Printf("更新预约时间失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "预约失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "预约成功",
		"code":    200,
	})
}
