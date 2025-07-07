// File: handlers/usuario_handler.go
package handlers

import (
	"encoding/json"
	"net/http"

	"backend-citas-medicas/config"
	"backend-citas-medicas/models"
)

func Registro(w http.ResponseWriter, r *http.Request) {
	var usuario models.Usuario
	if err := json.NewDecoder(r.Body).Decode(&usuario); err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	if err := config.DB.Create(&usuario).Error; err != nil {
		http.Error(w, "Error al registrar usuario", http.StatusInternalServerError)
		return
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
