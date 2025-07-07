package handlers

import (
	"encoding/json"
	"net/http"

	"backend-citas-medicas/config"
	"backend-citas-medicas/models"

	"github.com/gorilla/mux"
)

func CrearHistorial(w http.ResponseWriter, r *http.Request) {
	var historial models.Historial
	if err := json.NewDecoder(r.Body).Decode(&historial); err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}
	if err := config.DB.Create(&historial).Error; err != nil {
		http.Error(w, "Error al guardar historial", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(historial)
}

func ObtenerHistorial(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var historial models.Historial
	if err := config.DB.Where("cita_id = ?", id).First(&historial).Error; err != nil {
		http.Error(w, "No encontrado", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(historial)
}
