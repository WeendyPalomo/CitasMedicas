// File: models/usuario.go
package models

import "time"

type Usuario struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Nombre        string    `json:"nombre"`
	Correo        string    `gorm:"unique" json:"correo"`
	Contrasena    string    `json:"contrasena"`
	Rol           string    `gorm:"type:varchar(20)" json:"rol"`
	FechaRegistro time.Time `gorm:"autoCreateTime" json:"fecha_registro"`
}
