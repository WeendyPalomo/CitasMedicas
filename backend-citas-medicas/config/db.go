// File: config/db.go
package config

import (
	"backend-citas-medicas/models"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConectarDB() {
	dsn := "host=localhost user=postgres password=123123 dbname=citasmedicas port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error al conectar a la base de datos:", err)
	}
	log.Println("✅ Conectado a la base de datos")

	// Migraciones automáticas
	DB.AutoMigrate(
		&models.Usuario{},
		&models.Especialidad{},
		&models.MedicoEspecialidad{},
		&models.Disponibilidad{},
		&models.Cita{},
		&models.Historial{},
	)
}
