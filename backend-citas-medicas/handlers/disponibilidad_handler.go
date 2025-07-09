package handlers

import (
	"backend-citas-medicas/config"
	"backend-citas-medicas/models"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

func DisponibilidadesMedico(w http.ResponseWriter, r *http.Request) {
	medicoID, _ := strconv.Atoi(mux.Vars(r)["id"])
	var disponibles []models.Disponibilidad

	if err := config.DB.Where("medico_id = ?", medicoID).Find(&disponibles).Error; err != nil {
		http.Error(w, "Error al obtener disponibilidad", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(disponibles)
}

func CrearDisponibilidad(w http.ResponseWriter, r *http.Request) {
	medicoID, _ := strconv.Atoi(mux.Vars(r)["id"])
	var disponibilidad models.Disponibilidad

	if err := json.NewDecoder(r.Body).Decode(&disponibilidad); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Datos inválidos"})
		return
	}

	// Validar formato y lógica de hora
	horaInicio, err1 := time.Parse("15:04", disponibilidad.HoraInicio)
	horaFin, err2 := time.Parse("15:04", disponibilidad.HoraFin)

	if err1 != nil || err2 != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Formato de hora inválido. Use HH:MM"})
		return
	}

	if !horaFin.After(horaInicio) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "La hora de fin debe ser mayor que la de inicio"})
		return
	}

	disponibilidad.MedicoID = uint(medicoID)
	if err := config.DB.Create(&disponibilidad).Error; err != nil {
		http.Error(w, "Error al crear disponibilidad", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(disponibilidad)
}

func EliminarDisponibilidad(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := config.DB.Delete(&models.Disponibilidad{}, id).Error; err != nil {
		http.Error(w, "Error al eliminar disponibilidad", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
