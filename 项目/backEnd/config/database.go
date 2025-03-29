package config

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

const (
	dbDriver   = "mysql"          // 数据库类型
	dbUser     = "root"           // 数据库用户
	dbPassword = "060408"           //数据库密码
	dbHost     = "127.0.0.1:3306" //数据库IP地址
	dbName     = "school1"        //数据库名字
)

func InitDB() {
	connStr := fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci",
		dbUser, dbPassword, dbHost, dbName)

	var err error
	DB, err = sql.Open(dbDriver, connStr)
	if err != nil {
		log.Fatalf("数据库连接失败: %v", err)
	}

	// 连接池配置
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(5 * time.Minute)

	if err = DB.Ping(); err != nil {
		log.Fatalf("数据库连通性测试失败: %v", err)
	}
	log.Println("成功连接 school1 主数据库")
}
