// file: models/medicoespecialidad.go
package models

type MedicoEspecialidad struct {
	ID             uint `gorm:"primaryKey"`
	MedicoID       uint
	EspecialidadID uint
}
