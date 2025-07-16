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

	Paciente     Usuario      `gorm:"foreignKey:PacienteID;references:ID" json:"paciente"`
	Medico       Usuario      `gorm:"foreignKey:MedicoID;references:ID" json:"medico"`
	Especialidad Especialidad `gorm:"foreignKey:EspecialidadID;references:ID" json:"especialidad"`
}

func (Cita) TableName() string {
	return "cita"
}
