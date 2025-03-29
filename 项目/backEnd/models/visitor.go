package models

import (
	"school1/config"
)

type Visitor struct {
	Identity        string `json:"identity"`
	Name            string `json:"name"`
	ReservationTime string `json:"reservationTime"`
}

func GetAllVisitors() ([]Visitor, error) {
	rows, err := config.DB.Query("SELECT identity, name, reservationTime FROM visitor")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var visitors []Visitor
	for rows.Next() {
		var visitor Visitor
		if err := rows.Scan(&visitor.Identity, &visitor.Name, &visitor.ReservationTime); err != nil {
			return nil, err
		}
		visitors = append(visitors, visitor)
	}
	return visitors, nil
}

func CreateVisitor(visitor *Visitor) error {
	_, err := config.DB.Exec("INSERT INTO visitor (identity, name, reservationTime) VALUES (?, ?, ?)",
		visitor.Identity, visitor.Name, visitor.ReservationTime)
	return err
}

func DeleteVisitor(identity string) error {
	_, err := config.DB.Exec("DELETE FROM visitor WHERE identity = ?", identity)
	return err
}
