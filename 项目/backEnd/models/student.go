package models

import (
	"school1/config"
)

type Student struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	StudiedTime string `json:"studiedTime"`
	College     string `json:"college"`
	Department  string `json:"department"`
}

func GetAllStudents() ([]Student, error) {
	rows, err := config.DB.Query("SELECT id, name, studiedTime, college, department FROM student")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var students []Student
	for rows.Next() {
		var student Student
		if err := rows.Scan(&student.ID, &student.Name, &student.StudiedTime, &student.College, &student.Department); err != nil {
			return nil, err
		}
		students = append(students, student)
	}
	return students, nil
}

func CreateStudent(student *Student) error {
	_, err := config.DB.Exec("INSERT INTO student (id, name, studiedTime, college, department) VALUES (?, ?, ?, ?, ?)",
		student.ID, student.Name, student.StudiedTime, student.College, student.Department)
	return err
}

func DeleteStudent(id string) error {
	_, err := config.DB.Exec("DELETE FROM student WHERE id = ?", id)
	return err
}
