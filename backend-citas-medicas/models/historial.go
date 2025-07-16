// models/historial.go
package models

import "time"

type Historial struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	CitaID        uint      `gorm:"unique" json:"cita_id"`
	Diagnostico   string    `json:"diagnostico"`
	Tratamiento   string    `json:"tratamiento"`
	Notas         string    `json:"notas"`
	FechaCreacion time.Time `gorm:"autoCreateTime" json:"fecha_creacion"`

	Cita Cita `gorm:"foreignKey:CitaID" json:"-"`
}

func (Historial) TableName() string {
	return "historials"
}
