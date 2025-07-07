// models/disponibilidad.go
package models

type Disponibilidad struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	MedicoID   uint   `json:"medico_id"`
	DiaSemana  string `json:"dia_semana"`
	HoraInicio string `json:"hora_inicio"` // antes time.Time
	HoraFin    string `json:"hora_fin"`    // antes time.Time

	Medico Usuario `gorm:"foreignKey:MedicoID" json:"-"`
}
