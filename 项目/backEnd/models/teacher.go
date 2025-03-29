package models

import (
	"school1/config"
)

type Teacher struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	TeachedTime string `json:"teachedTime"`
	College     string `json:"college"`
	Department  string `json:"department"`
}

func GetAllTeachers() ([]Teacher, error) {
	rows, err := config.DB.Query("SELECT id, name, teachedTime, college, department FROM teacher")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teachers []Teacher
	for rows.Next() {
		var teacher Teacher
		if err := rows.Scan(&teacher.ID, &teacher.Name, &teacher.TeachedTime, &teacher.College, &teacher.Department); err != nil {
			return nil, err
		}
		teachers = append(teachers, teacher)
	}
	return teachers, nil
}

func CreateTeacher(teacher *Teacher) error {
	_, err := config.DB.Exec("INSERT INTO teacher (id, name, teachedTime, college, department) VALUES (?, ?, ?, ?, ?)",
		teacher.ID, teacher.Name, teacher.TeachedTime, teacher.College, teacher.Department)
	return err
}

func DeleteTeacher(id string) error {
	_, err := config.DB.Exec("DELETE FROM teacher WHERE id = ?", id)
	return err
}
