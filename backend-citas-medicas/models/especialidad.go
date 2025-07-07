// models/especialidad.go
package models

type Especialidad struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Nombre string `gorm:"unique" json:"nombre"`

	Medicos []Usuario `gorm:"many2many:medicos_especialidades;" json:"medicos,omitempty"`
}
