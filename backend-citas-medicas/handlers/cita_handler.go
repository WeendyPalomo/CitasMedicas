// File: handlers/cita_handler.go
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"backend-citas-medicas/config"
	"backend-citas-medicas/models"

	"github.com/gorilla/mux"
)

func CrearCita(w http.ResponseWriter, r *http.Request) {
	var cita models.Cita
	if err := json.NewDecoder(r.Body).Decode(&cita); err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}
	if err := config.DB.Create(&cita).Error; err != nil {
		http.Error(w, "Error al crear la cita", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(cita)
}

func CitasPaciente(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, _ := strconv.Atoi(idStr)

	var citas []models.Cita
	if err := config.DB.Where("paciente_id = ?", id).Find(&citas).Error; err != nil {
		http.Error(w, "Error al obtener citas", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(citas)
}

func CitasMedico(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, _ := strconv.Atoi(idStr)

	var citas []models.Cita
	if err := config.DB.Where("medico_id = ?", id).Find(&citas).Error; err != nil {
		http.Error(w, "Error al obtener citas", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(citas)
}

func ObtenerCitasPorMedico(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	medicoIDStr := vars["id"]
	medicoID, err := strconv.Atoi(medicoIDStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	rows, err := config.DB.Raw(`
		SELECT c.id, u.nombre, c.fecha, c.hora
		FROM cita c
		JOIN usuario u ON c.paciente_id = u.id
		WHERE c.medico_id = $1
		ORDER BY c.fecha, c.hora`, medicoID).Rows()
	if err != nil {
		http.Error(w, "Error al obtener citas", http.StatusInternalServerError)
		return
	}

	var citas []map[string]interface{}
	for rows.Next() {
		var cita map[string]interface{}
		var nombrePaciente string
		var fecha string
		var hora string
		var id int
		rows.Scan(&id, &nombrePaciente, &fecha, &hora)
		cita = map[string]interface{}{
			"id":              id,
			"paciente_nombre": nombrePaciente,
			"fecha":           fecha,
			"hora":            hora,
		}
		citas = append(citas, cita)
	}

	json.NewEncoder(w).Encode(citas)
}
