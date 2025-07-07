// models/cita.go
package models

import "time"

type Cita struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	PacienteID uint      `json:"paciente_id"`
	MedicoID   uint      `json:"medico_id"`
	Fecha      time.Time `json:"fecha"`
	Hora       time.Time `json:"hora"`
	Estado     string    `gorm:"type:varchar(20);default:'pendiente'" json:"estado"`

	Paciente  Usuario    `gorm:"foreignKey:PacienteID" json:"-"`
	Medico    Usuario    `gorm:"foreignKey:MedicoID" json:"-"`
	Historial *Historial `gorm:"foreignKey:CitaID" json:"historial,omitempty"`
}
