// File: handlers/usuario_handler.go
package handlers

import (
	"encoding/json"
	"net/http"

	"backend-citas-medicas/config"
	"backend-citas-medicas/models"
)

func Registro(w http.ResponseWriter, r *http.Request) {
	var datos struct {
		Nombre         string `json:"nombre"`
		Correo         string `json:"correo"`
		Contrasena     string `json:"contrasena"`
		Rol            string `json:"rol"`
		Especialidades []uint `json:"especialidades"` // solo si es médico
	}
	if err := json.NewDecoder(r.Body).Decode(&datos); err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	usuario := models.Usuario{
		Nombre:     datos.Nombre,
		Correo:     datos.Correo,
		Contrasena: datos.Contrasena,
		Rol:        datos.Rol,
	}

	if err := config.DB.Create(&usuario).Error; err != nil {
		http.Error(w, "Error al registrar usuario", http.StatusInternalServerError)
		return
	}

	// Asociar especialidades si es médico
	if datos.Rol == "medico" && len(datos.Especialidades) > 0 {
		var especialidades []models.Especialidad
		if err := config.DB.Where("id IN ?", datos.Especialidades).Find(&especialidades).Error; err == nil {
			config.DB.Model(&usuario).Association("Especialidades").Append(especialidades)
		}
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(usuario)
}

// handlers/usuario_handler.go
func ListarMedicos(w http.ResponseWriter, r *http.Request) {
	var medicos []models.Usuario
	if err := config.DB.Where("rol = ?", "medico").Find(&medicos).Error; err != nil {
		http.Error(w, "Error al obtener médicos", http.StatusInternalServerError)
		return
	}
	for i := range medicos {
		medicos[i].Contrasena = ""
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(medicos)
}

func ListarMedicosConEspecialidades(w http.ResponseWriter, r *http.Request) {
	var medicos []models.Usuario
	if err := config.DB.Preload("Especialidades").Where("rol = ?", "medico").Find(&medicos).Error; err != nil {
		http.Error(w, "Error al obtener médicos", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(medicos)
}
