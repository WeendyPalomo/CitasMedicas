package routes

import (
	"backend-citas-medicas/handlers"
	"backend-citas-medicas/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()
	api := r.PathPrefix("/api/v1").Subrouter()

	r.HandleFunc("/api/v1/citas", handlers.CrearCita).Methods("POST")
	r.HandleFunc("/api/v1/pacientes/{id}/citas", handlers.CitasPaciente).Methods("GET")
	r.HandleFunc("/api/v1/medicos/{id}/citas", handlers.CitasMedico).Methods("GET")

	r.HandleFunc("/api/v1/medicos/{id}/disponibilidades", handlers.DisponibilidadesMedico).Methods("GET")
	r.HandleFunc("/api/v1/medicos/{id}/disponibilidades", handlers.CrearDisponibilidad).Methods("POST")

	r.HandleFunc("/api/v1/medicos/{id}/citas", handlers.ObtenerCitasPorMedico).Methods("GET")

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API de Citas Médicas activa"))
	})

	// Rutas públicas
	api.HandleFunc("/login", handlers.Login).Methods("POST")
	api.HandleFunc("/registro", handlers.Registro).Methods("POST")

	// Rutas protegidas
	api.Handle("/citas", middleware.JWTMiddleware(http.HandlerFunc(handlers.CrearCita))).Methods("POST")
	api.Handle("/pacientes/{id}/citas", middleware.JWTMiddleware(http.HandlerFunc(handlers.CitasPaciente))).Methods("GET")

	api.Handle("/historiales", middleware.JWTMiddleware(http.HandlerFunc(handlers.CrearHistorial))).Methods("POST")
	api.Handle("/historiales/{id}", middleware.JWTMiddleware(http.HandlerFunc(handlers.ObtenerHistorial))).Methods("GET")

	api.HandleFunc("/especialidades", handlers.CrearEspecialidad).Methods("POST")
	api.HandleFunc("/especialidades", handlers.ListarEspecialidades).Methods("GET")

	return r
}
