// File: handlers/cita_handler.go
package handlers

import (
	"encoding/json"
	"log"
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

func CancelarCita(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	// Actualizar el estado de la cita a "cancelado"
	if err := config.DB.Model(&models.Cita{}).Where("id = ?", id).Update("estado", "cancelado").Error; err != nil {
		http.Error(w, "Error al cancelar cita", http.StatusInternalServerError)
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

	rows, err := config.DB.Raw(`
		SELECT 
			c.id, c.fecha, c.hora, c.estado,
			p.id AS paciente_id, p.nombre AS paciente_nombre,
			e.id AS especialidad_id, e.nombre AS especialidad_nombre
		FROM cita c
		JOIN usuarios p ON p.id = c.paciente_id
		JOIN especialidads e ON e.id = c.especialidad_id
		WHERE c.medico_id = ?
		ORDER BY c.fecha, c.hora
	`, medicoID).Rows()
	if err != nil {
		http.Error(w, "Error al obtener citas del médico", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var citas []map[string]interface{}
	for rows.Next() {
		var id int
		var fecha, hora, estado string
		var pacienteID int
		var pacienteNombre string
		var especialidadID int
		var especialidadNombre string

		err = rows.Scan(&id, &fecha, &hora, &estado, &pacienteID, &pacienteNombre, &especialidadID, &especialidadNombre)
		if err != nil {
			log.Println("❌ Error al escanear fila:", err)
			continue
		}

		log.Printf("✅ Cita ID: %d, Paciente: %s, Especialidad: %s", id, pacienteNombre, especialidadNombre)

		cita := map[string]interface{}{
			"id":     id,
			"fecha":  fecha,
			"hora":   hora,
			"estado": estado,
			"paciente": map[string]interface{}{
				"id":     pacienteID,
				"nombre": pacienteNombre,
			},
			"especialidad": map[string]interface{}{
				"id":     especialidadID,
				"nombre": especialidadNombre,
			},
		}

		citas = append(citas, cita)
	}

	w.Header().Set("Content-Type", "application/json")
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

func ObtenerCitasPorMedicoAgenda(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var citas []models.Cita
	err := config.DB.
		Preload("Paciente").
		Preload("Especialidad").
		Where("medico_id = ?", id).
		Where("estado = ?", "pendiente").
		Find(&citas).Error

	if err != nil {
		http.Error(w, "Error al obtener citas del médico", http.StatusInternalServerError)
		return
	}

	var resultado []map[string]interface{}
	for _, c := range citas {
		citaMap := map[string]interface{}{
			"id":     c.ID,
			"fecha":  c.Fecha,
			"hora":   c.Hora,
			"estado": c.Estado,
			"paciente": map[string]interface{}{
				"id":     c.Paciente.ID,
				"nombre": c.Paciente.Nombre,
			},
			"especialidad": map[string]interface{}{
				"id":     c.Especialidad.ID,
				"nombre": c.Especialidad.Nombre,
			},
		}
		resultado = append(resultado, citaMap)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resultado)
}
