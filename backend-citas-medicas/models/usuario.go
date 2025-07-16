// File: models/usuario.go
package models

import "time"

type Usuario struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Nombre        string    `json:"nombre"`
	Correo        string    `gorm:"unique" json:"correo"`
	Contrasena    string    `json:"contrasena"`
	Rol           string    `gorm:"type:varchar(20)" json:"rol"` // paciente, medico, admin
	FechaRegistro time.Time `gorm:"autoCreateTime" json:"fecha_registro"`

	Especialidades []Especialidad `gorm:"many2many:medico_especialidads;joinForeignKey:MedicoID;joinReferences:EspecialidadID" json:"especialidades,omitempty"`
}

// Agrega este método si no lo tienes ya:
func (Usuario) TableName() string {
	return "usuarios"
}
