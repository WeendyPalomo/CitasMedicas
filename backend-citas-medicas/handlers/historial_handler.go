// file: handlers/historial_handler.go
package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"backend-citas-medicas/config"
	"backend-citas-medicas/models"

	"github.com/gorilla/mux"
)

func CrearHistorial(w http.ResponseWriter, r *http.Request) {
	var h models.Historial

	if err := json.NewDecoder(r.Body).Decode(&h); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Error al decodificar JSON",
		})

		return
	}

	if h.FechaCreacion.IsZero() {
		h.FechaCreacion = time.Now()
	}

	fmt.Printf("Historial recibido: %+v\n", h)

	if err := config.DB.Create(&h).Error; err != nil {
		http.Error(w, "Error al crear historial", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Historial creado correctamente",
	})
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

// PUT /citas/{id}/estado
func CambiarEstadoCita(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var payload struct {
		Estado string `json:"estado"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Error en datos de entrada", http.StatusBadRequest)
		return
	}

	if err := config.DB.Model(&models.Cita{}).Where("id = ?", id).Update("estado", payload.Estado).Error; err != nil {
		http.Error(w, "Error al actualizar cita", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
