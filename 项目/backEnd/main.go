package main

import (
	"log"
	"net/http"

	"school1/config"
	"school1/controllers"

	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化数据库
	config.CreateDatabaseAndTable() //生成数据库
	config.InitDB()                 //连接数据库
	defer config.DB.Close()         //关闭数据库

	// 创建Gin引擎
	router := gin.New()

	// 自定义日志中间件，过滤掉OPTIONS请求
	router.Use(func(c *gin.Context) {
		if c.Request.Method != "OPTIONS" {
			gin.Logger()(c)
		}
		c.Next()
	})

	// 启用CORS中间件
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// 设置路由
	api := router.Group("/api")
	{
		api.GET("getCounts", controllers.NewUserController().GetCounts)                          //仪表盘
		api.POST("register", controllers.NewUserController().Register)                           //管理员注册校内用户
		api.GET("getStudents", controllers.NewUserController().GetStudents)                      //获取学生信息
		api.GET("getTeachers", controllers.NewUserController().GetTeachers)                      //获取教师信息
		api.GET("getSingleUser", controllers.NewUserController().GetSingleUser)                  //获取单个用户信息
		api.POST("sendMessage", controllers.NewUserController().SendMessage)                     //发送留言
		api.GET("getMessagesByMessageId", controllers.NewUserController().GetMessageByMessageId) //根据messageId获取留言信息
		api.POST("setMessageRead", controllers.NewUserController().SetMessageRead)               //设置留言已读
		api.POST("registerVisitor", controllers.NewUserController().RegisterVisitor)             //注册游客
		api.POST("loginVisitor", controllers.NewUserController().LoginVisitor)                   //游客登录
		api.POST("reserveVisitor", controllers.NewUserController().ReserveVisitor)               //预约游客

	}

	// 启动服务器
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
