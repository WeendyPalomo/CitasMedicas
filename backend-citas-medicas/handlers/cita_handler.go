// File: handlers/cita_handler.go
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"backend-citas-medicas/config"
	"backend-citas-medicas/models"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func CrearCita(w http.ResponseWriter, r *http.Request) {
	var cita models.Cita
	if err := json.NewDecoder(r.Body).Decode(&cita); err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	// Validar cita duplicada
	var existente models.Cita
	err := config.DB.Where("medico_id = ? AND fecha = ? AND hora = ?", cita.MedicoID, cita.Fecha, cita.Hora).First(&existente).Error
	if err == nil {
		http.Error(w, "Ya existe una cita para ese médico en esa fecha y hora", http.StatusBadRequest)
		return
	}
	if err != gorm.ErrRecordNotFound {
		http.Error(w, "Error al validar cita", http.StatusInternalServerError)
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

	rows, err := config.DB.Raw(`
		SELECT c.id, c.fecha, c.hora, c.estado, u.nombre AS medico, e.nombre AS especialidad
		FROM cita c
		JOIN usuarios u ON u.id = c.medico_id
		LEFT JOIN especialidads e ON e.id = c.especialidad_id
		WHERE c.paciente_id = ?
		ORDER BY c.fecha, c.hora
	`, id).Rows()
	if err != nil {
		http.Error(w, "Error al obtener citas del paciente", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var citas []map[string]interface{}
	for rows.Next() {
		var id int
		var fecha, hora, estado, medico, especialidad string
		rows.Scan(&id, &fecha, &hora, &estado, &medico, &especialidad)
		cita := map[string]interface{}{
			"id":           id,
			"fecha":        fecha,
			"hora":         hora,
			"estado":       estado,
			"medico":       medico,
			"especialidad": especialidad,
		}
		citas = append(citas, cita)
	}
	json.NewEncoder(w).Encode(citas)
}

func EliminarCita(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	if err := config.DB.Delete(&models.Cita{}, id).Error; err != nil {
		http.Error(w, "Error al eliminar cita", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
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

	// Traer citas con nombre del paciente
	rows, err := config.DB.Raw(`
		SELECT c.id, u.nombre AS paciente_nombre, c.fecha, c.hora
		FROM cita c
		JOIN usuarios u ON c.paciente_id = u.id
		WHERE c.medico_id = ?
		ORDER BY c.fecha, c.hora
	`, medicoID).Rows()
	if err != nil {
		http.Error(w, "Error al obtener citas", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var citas []map[string]interface{}
	for rows.Next() {
		var id int
		var pacienteNombre, fecha, hora string
		if err := rows.Scan(&id, &pacienteNombre, &fecha, &hora); err != nil {
			continue
		}

		// Obtener especialidades del médico para cada cita
		var especialidades []string
		especialidadRows, err := config.DB.Raw(`
			SELECT e.nombre
			FROM medicos_especialidades me
			JOIN especialidad e ON me.especialidad_id = e.id
			WHERE me.medico_id = ?
		`, medicoID).Rows()
		if err == nil {
			for especialidadRows.Next() {
				var nombre string
				especialidadRows.Scan(&nombre)
				especialidades = append(especialidades, nombre)
			}
			especialidadRows.Close()
		}

		cita := map[string]interface{}{
			"id":              id,
			"nombre_paciente": pacienteNombre,
			"fecha":           fecha,
			"hora":            hora,
			"especialidades":  especialidades,
		}
		citas = append(citas, cita)
	}

	json.NewEncoder(w).Encode(citas)
}

func ObtenerMedicosPorEspecialidad(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	var medicos []models.Usuario

	err := config.DB.Raw(`
        SELECT u.id, u.nombre, u.correo, u.rol
        FROM usuarios u
        JOIN medico_especialidads me ON u.id = me.medico_id
        WHERE me.especialidad_id = ? AND u.rol = 'medico'
    `, idStr).Scan(&medicos).Error

	if err != nil {
		http.Error(w, "Error al obtener médicos por especialidad", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(medicos)
}

func GetMedicosConEspecialidades(w http.ResponseWriter, r *http.Request) {
	var resultados []struct {
		Medico       string `json:"medico"`
		Especialidad string `json:"especialidad"`
	}

	config.DB.Raw(`
		SELECT B.nombre as medico, C.nombre as especialidad
		FROM medico_especialidads A
		INNER JOIN usuarios B ON A.medico_id = B.id
		INNER JOIN especialidads C ON A.especialidad_id = C.id
		ORDER BY A.id desc
	`).Scan(&resultados)

	json.NewEncoder(w).Encode(resultados)
}

func ObtenerCitasPorMedicoYFecha(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	medicoID, _ := strconv.Atoi(vars["id"])
	fecha := vars["fecha"]

	var citas []models.Cita
	if err := config.DB.Where("medico_id = ? AND fecha = ?", medicoID, fecha).Find(&citas).Error; err != nil {
		http.Error(w, "Error al obtener citas", http.StatusInternalServerError)
		return
	}

	horas := []string{}
	for _, c := range citas {
		horas = append(horas, c.Hora)
	}

	json.NewEncoder(w).Encode(horas)
}
