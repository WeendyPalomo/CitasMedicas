package handlers

import (
	"backend-citas-medicas/config"
	"encoding/json"
	"net/http"
)

func ObtenerDatosReporte(w http.ResponseWriter, r *http.Request) {
	type DashboardData struct {
		UsuariosPorRol       map[string]int `json:"usuarios_por_rol"`
		CitasPorEstado       map[string]int `json:"citas_por_estado"`
		CitasPorEspecialidad []struct {
			Especialidad string `json:"especialidad"`
			Total        int    `json:"total"`
		} `json:"citas_por_especialidad"`
	}

	var data DashboardData

	// Conteo de usuarios por rol
	rows, err := config.DB.Raw(`SELECT rol, COUNT(*) FROM usuarios GROUP BY rol`).Rows()
	if err != nil {
		http.Error(w, "Error al obtener usuarios", http.StatusInternalServerError)
		return
	}
	data.UsuariosPorRol = make(map[string]int)
	for rows.Next() {
		var rol string
		var total int
		rows.Scan(&rol, &total)
		data.UsuariosPorRol[rol] = total
	}

	// Conteo de citas por estado
	rows2, err := config.DB.Raw(`SELECT estado, COUNT(*) FROM cita GROUP BY estado`).Rows()
	if err != nil {
		http.Error(w, "Error al obtener citas por estado", http.StatusInternalServerError)
		return
	}
	data.CitasPorEstado = make(map[string]int)
	for rows2.Next() {
		var estado string
		var total int
		rows2.Scan(&estado, &total)
		data.CitasPorEstado[estado] = total
	}

	// Especialidades más solicitadas
	rows3, err := config.DB.Raw(`
		SELECT e.nombre, COUNT(*) as total
		FROM cita c
		JOIN especialidads e ON c.especialidad_id = e.id
		GROUP BY e.nombre
		ORDER BY total DESC
	`).Rows()
	if err != nil {
		http.Error(w, "Error al obtener citas por especialidad", http.StatusInternalServerError)
		return
	}
	for rows3.Next() {
		var nombre string
		var total int
		rows3.Scan(&nombre, &total)
		data.CitasPorEspecialidad = append(data.CitasPorEspecialidad, struct {
			Especialidad string `json:"especialidad"`
			Total        int    `json:"total"`
		}{nombre, total})
	}

	json.NewEncoder(w).Encode(data)
}
