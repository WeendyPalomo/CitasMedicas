// File: handlers/auth_handler.go
package handlers

import (
	"encoding/json"
	"net/http"

	"backend-citas-medicas/config"
	"backend-citas-medicas/middleware"
	"backend-citas-medicas/models"
)

func Login(w http.ResponseWriter, r *http.Request) {
	var credenciales struct {
		Correo     string `json:"correo"`
		Contrasena string `json:"contrasena"`
	}
	json.NewDecoder(r.Body).Decode(&credenciales)

	var usuario models.Usuario
	if err := config.DB.Preload("Especialidades").Where("correo = ? AND contrasena = ?", credenciales.Correo, credenciales.Contrasena).First(&usuario).Error; err != nil {
		http.Error(w, "Credenciales inválidas", http.StatusUnauthorized)
		return
	}

	token, err := middleware.GenerarJWT(usuario.ID, usuario.Rol)
	if err != nil {
		http.Error(w, "Error al generar token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user":  usuario,
	})
}
