package config

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

// CreateDatabaseAndTable 创建数据库和表
func CreateDatabaseAndTable() error {
	// 连接MySQL服务器（不指定数据库）
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(127.0.0.1:3306)/", dbUser, dbPassword))
	if err != nil {
		return fmt.Errorf("连接数据库失败: %v", err)
	}
	defer db.Close()

	// 创建数据库
	_, err = db.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s", dbName))
	if err != nil {
		return fmt.Errorf("创建数据库失败: %v", err)
	}

	// 使用新创建的数据库
	_, err = db.Exec(fmt.Sprintf("USE %s", dbName))
	if err != nil {
		return fmt.Errorf("切换数据库失败: %v", err)
	}

	// 创建student表
	createStudentSQL := `CREATE TABLE IF NOT EXISTS student (
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		studiedTime DATE NOT NULL,
		college VARCHAR(255) NOT NULL,
		department VARCHAR(255) NOT NULL
	)`
	if _, err = db.Exec(createStudentSQL); err != nil {
		return fmt.Errorf("创建student表失败: %v", err)
	}

	// 创建teacher表
	createTeacherSQL := `CREATE TABLE IF NOT EXISTS teacher (
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		teachedTime DATE NOT NULL,
		college VARCHAR(255) NOT NULL,
		department VARCHAR(255) NOT NULL
	)`
	if _, err = db.Exec(createTeacherSQL); err != nil {
		return fmt.Errorf("创建teacher表失败: %v", err)
	}

	// 创建visitor表
	createVisitorSQL := `CREATE TABLE IF NOT EXISTS visitor (
		identity VARCHAR(99) NOT NULL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		reservationTime DATE
	)`
	if _, err = db.Exec(createVisitorSQL); err != nil {
		return fmt.Errorf("创建visitor表失败: %v", err)
	}

	// 创建message表
	createMessageSQL := `CREATE TABLE IF NOT EXISTS message (
		messageId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		senderName VARCHAR(255) NOT NULL,
		senderMessage TEXT NOT NULL,
		receiverName VARCHAR(255) NOT NULL,
		isRead BOOLEAN NOT NULL DEFAULT FALSE
	)`
	if _, err = db.Exec(createMessageSQL); err != nil {
		return fmt.Errorf("创建message表失败: %v", err)
	}

	fmt.Println("数据库和表创建成功")
	return nil
}
