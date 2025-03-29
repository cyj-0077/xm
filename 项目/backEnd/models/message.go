package models

import (
	"school1/config"
)

type Message struct {
	MessageId     int    `json:"messageId"`
	SenderName    string `json:"senderName"`
	SenderMessage string `json:"senderMessage"`
	ReceiverName  string `json:"receiverName"`
	IsRead        bool   `json:"isRead"`
}

func GetAllMessages() ([]Message, error) {
	rows, err := config.DB.Query("SELECT messageId, senderName, senderMessage, receiverName, isRead FROM message")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var message Message
		if err := rows.Scan(&message.MessageId, &message.SenderName, &message.SenderMessage, &message.ReceiverName, &message.IsRead); err != nil {
			return nil, err
		}
		messages = append(messages, message)
	}
	return messages, nil
}

func CreateMessage(message *Message) error {
	_, err := config.DB.Exec("INSERT INTO message (senderName, senderMessage, receiverName, isRead) VALUES (?, ?, ?, ?)",
		message.SenderName, message.SenderMessage, message.ReceiverName, message.IsRead)
	return err
}

func DeleteMessage(messageId int) error {
	_, err := config.DB.Exec("DELETE FROM message WHERE messageId = ?", messageId)
	return err
}
