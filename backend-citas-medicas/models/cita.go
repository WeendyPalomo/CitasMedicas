// models/cita.go
package models

type Cita struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	PacienteID uint   `json:"paciente_id"`
	MedicoID   uint   `json:"medico_id"`
	Fecha      string `json:"fecha"` // antes time.Time
	Hora       string `json:"hora"`  // antes time.Time
	Estado     string `gorm:"type:varchar(20);default:'pendiente'" json:"estado"`

	Paciente  Usuario    `gorm:"foreignKey:PacienteID" json:"-"`
	Medico    Usuario    `gorm:"foreignKey:MedicoID" json:"-"`
	Historial *Historial `gorm:"foreignKey:CitaID" json:"historial,omitempty"`
}
