// / file: handlers/especialidad_handler.go
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"backend-citas-medicas/config"
	"backend-citas-medicas/models"

	"github.com/gorilla/mux"
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

func AsignarEspecialidad(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	medicoID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var body struct {
		EspecialidadID uint `json:"especialidad_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	relacion := models.MedicoEspecialidad{
		MedicoID:       uint(medicoID),
		EspecialidadID: body.EspecialidadID,
	}

	if err := config.DB.Create(&relacion).Error; err != nil {
		http.Error(w, "Error al asignar especialidad", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(relacion)
}

func QuitarEspecialidad(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	medicoID, _ := strconv.Atoi(vars["id"])
	especialidadID, _ := strconv.Atoi(vars["especialidadId"])

	if err := config.DB.Where("medico_id = ? AND especialidad_id = ?", medicoID, especialidadID).
		Delete(&models.MedicoEspecialidad{}).Error; err != nil {
		http.Error(w, "Error al quitar especialidad", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
