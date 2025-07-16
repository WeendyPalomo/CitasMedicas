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

	// Página base
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API de Citas Médicas activa"))
	})

	// Autenticación
	api.HandleFunc("/login", handlers.Login).Methods("POST")
	api.HandleFunc("/registro", handlers.Registro).Methods("POST")

	// Citas - General
	r.HandleFunc("/api/v1/citas", handlers.CrearCita).Methods("POST")
	r.HandleFunc("/api/v1/citas/{id}/estado", handlers.CambiarEstadoCita).Methods("PUT")
	api.Handle("/citas", middleware.JWTMiddleware(http.HandlerFunc(handlers.CrearCita))).Methods("POST")
	api.HandleFunc("/citas/{id}/cancelar", handlers.CancelarCita).Methods("PUT")

	// Citas - Por paciente
	r.HandleFunc("/api/v1/pacientes/{id}/citas", handlers.CitasPaciente).Methods("GET")
	r.HandleFunc("/api/v1/citas/paciente/{id}", handlers.CitasPaciente).Methods("GET")
	api.Handle("/pacientes/{id}/citas", middleware.JWTMiddleware(http.HandlerFunc(handlers.CitasPaciente))).Methods("GET")

	// Citas - Por médico
	r.HandleFunc("/api/v1/medicos/{id}/citas", handlers.CitasMedico).Methods("GET")
	r.HandleFunc("/api/v1/medicos/{id}/citas/{fecha}", handlers.ObtenerCitasPorMedicoYFecha).Methods("GET")
	r.HandleFunc("/api/v1/medicos/{id}/citas", handlers.ObtenerCitasPorMedicoAgenda).Methods("GET")
	api.HandleFunc("/medicos/{id}/citas", handlers.ObtenerCitasPorMedico).Methods("GET")

	// Disponibilidad de médicos
	r.HandleFunc("/api/v1/medicos/{id}/disponibilidad", handlers.ObtenerDisponibilidadDeMedico).Methods("GET")
	r.HandleFunc("/api/v1/medicos/{id}/disponibilidades", handlers.CrearDisponibilidad).Methods("POST")
	r.HandleFunc("/api/v1/disponibilidades/{id}", handlers.EliminarDisponibilidad).Methods("DELETE")

	// Especialidades
	r.HandleFunc("/especialidades", handlers.ListarEspecialidades).Methods("GET")
	r.HandleFunc("/especialidades", handlers.CrearEspecialidad).Methods("POST")
	api.HandleFunc("/especialidades", handlers.CrearEspecialidad).Methods("POST")
	api.HandleFunc("/especialidades", handlers.ListarEspecialidades).Methods("GET")
	r.HandleFunc("/api/v1/especialidades/{id}/medicos", handlers.ObtenerMedicosPorEspecialidad).Methods("GET")
	r.HandleFunc("/api/v1/especialidades/{id}", handlers.EliminarEspecialidad).Methods("DELETE")
	r.Handle("/api/v1/especialidades/{id}", middleware.JWTMiddleware(http.HandlerFunc(handlers.EliminarEspecialidad))).Methods("DELETE")
	r.HandleFunc("/api/v1/medicos-con-especialidades", handlers.ListarMedicosConEspecialidades).Methods("GET")
	r.HandleFunc("/api/v1/especialidades/{id}/medicos", handlers.ListarMedicosPorEspecialidad).Methods("GET")

	// Relación Médico - Especialidad
	r.HandleFunc("/medicos/{id}/especialidades", handlers.AsignarEspecialidad).Methods("POST")
	r.HandleFunc("/api/v1/medicos/{id}/especialidades", handlers.AsignarEspecialidad).Methods("POST")
	r.HandleFunc("/api/v1/medicos/{id}/especialidades/{id}", handlers.EliminarMedicoEspecialidad).Methods("DELETE")
	api.Handle("/medicos/{id}/especialidades/{especialidadId}", middleware.JWTMiddleware(http.HandlerFunc(handlers.EliminarMedicoEspecialidad))).Methods("DELETE")

	// Médicos
	r.HandleFunc("/api/v1/medicos", handlers.ListarMedicosConEspecialidades).Methods("GET")
	api.Handle("/medicos", middleware.JWTMiddleware(http.HandlerFunc(handlers.ListarMedicos))).Methods("GET")

	// Historial clínico
	r.HandleFunc("/api/v1/historial", handlers.CrearHistorial).Methods("POST")
	r.HandleFunc("/api/v1/historiales", handlers.CrearHistorial).Methods("POST")
	api.Handle("/historiales", middleware.JWTMiddleware(http.HandlerFunc(handlers.CrearHistorial))).Methods("POST")
	api.Handle("/historiales/{id}", middleware.JWTMiddleware(http.HandlerFunc(handlers.ObtenerHistorial))).Methods("GET")

	// Reportes para Admin
	r.HandleFunc("/api/v1/admin/reportes", handlers.ObtenerDatosReporte).Methods("GET")

	return r
}
