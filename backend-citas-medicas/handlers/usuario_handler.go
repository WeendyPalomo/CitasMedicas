// File: handlers/usuario_handler.go
package handlers

import (
	"encoding/json"
	"net/http"

	"backend-citas-medicas/config"
	"backend-citas-medicas/models"
)

func Registro(w http.ResponseWriter, r *http.Request) {
	var usuario models.Usuario
	if err := json.NewDecoder(r.Body).Decode(&usuario); err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	if err := config.DB.Create(&usuario).Error; err != nil {
		http.Error(w, "Error al registrar usuario", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(usuario)
}

/*func Login(w http.ResponseWriter, r *http.Request) {
	var cred struct {
		Correo     string `json:"correo"`
		Contrasena string `json:"contrasena"`
	}
	json.NewDecoder(r.Body).Decode(&cred)

	var usuario models.Usuario
	if err := config.DB.Where("correo = ? AND contrasena = ?", cred.Correo, cred.Contrasena).First(&usuario).Error; err != nil {
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
*/
