package handlers

import (
	"encoding/json"
	"net/http"

	"backend-citas-medicas/config"
	"backend-citas-medicas/models"
)

func CrearEspecialidad(w http.ResponseWriter, r *http.Request) {
	var esp models.Especialidad
	json.NewDecoder(r.Body).Decode(&esp)
	if err := config.DB.Create(&esp).Error; err != nil {
		http.Error(w, "Error al guardar", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(esp)
}

func ListarEspecialidades(w http.ResponseWriter, r *http.Request) {
	var especialidades []models.Especialidad
	config.DB.Find(&especialidades)
	json.NewEncoder(w).Encode(especialidades)
}
