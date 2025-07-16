// models/cita.go
package models

type Cita struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	PacienteID     uint   `json:"paciente_id"`
	MedicoID       uint   `json:"medico_id"`
	EspecialidadID uint   `json:"especialidad_id"`
	Fecha          string `json:"fecha"`
	Hora           string `json:"hora"`
	Estado         string `gorm:"type:varchar(20);default:'pendiente'" json:"estado"`

	Paciente     Usuario      `gorm:"foreignKey:PacienteID" json:"paciente"`         // <- CAMBIO: quitar "-"
	Medico       Usuario      `gorm:"foreignKey:MedicoID" json:"medico"`             // opcional
	Historial    *Historial   `gorm:"foreignKey:CitaID" json:"historial,omitempty"`  // opcional
	Especialidad Especialidad `gorm:"foreignKey:EspecialidadID" json:"especialidad"` // <- CAMBIO: quitar "-"
}
