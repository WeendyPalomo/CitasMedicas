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
	r.HandleFunc("/api/v1/citas/paciente/{id}", handlers.CitasPaciente).Methods("GET")
	r.HandleFunc("/api/v1/citas/{id}/estado", handlers.CambiarEstadoCita).Methods("PUT")

	r.HandleFunc("/api/v1/medicos/{id}/citas", handlers.CitasMedico).Methods("GET")

	// r.HandleFunc("/api/v1/medicos/{id}/disponibilidad", handlers.ListarMedicosConEspecialidades).Methods("GET")
	r.HandleFunc("/api/v1/medicos/{id}/disponibilidad", handlers.ObtenerDisponibilidadDeMedico).Methods("GET")
	r.HandleFunc("/api/v1/medicos/{id}/citas/{fecha}", handlers.ObtenerCitasPorMedicoYFecha).Methods("GET")
	r.HandleFunc("/api/v1/medicos/{id}/disponibilidades", handlers.CrearDisponibilidad).Methods("POST")
	r.HandleFunc("/api/v1/disponibilidades/{id}", handlers.EliminarDisponibilidad).Methods("DELETE")

	r.HandleFunc("/api/v1/medicos/{id}/citas", handlers.ObtenerCitasPorMedicoAgenda).Methods("GET")

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("API de Citas Médicas activa")) })

	r.HandleFunc("/especialidades", handlers.ListarEspecialidades).Methods("GET")
	r.HandleFunc("/especialidades", handlers.CrearEspecialidad).Methods("POST")

	r.HandleFunc("/api/v1/historiales", handlers.CrearHistorial).Methods("POST")

	r.HandleFunc("/medicos/{id}/especialidades", handlers.AsignarEspecialidad).Methods("POST")

	r.HandleFunc("/api/v1/historial", handlers.CrearHistorial).Methods("POST")

	r.HandleFunc("/api/v1/especialidades/{id}/medicos", handlers.ObtenerMedicosPorEspecialidad).Methods("GET")
	r.Handle("/api/v1/especialidades/{id}", middleware.JWTMiddleware(http.HandlerFunc(handlers.EliminarEspecialidad))).Methods("DELETE")
	r.HandleFunc("/api/v1/especialidades/{id}", handlers.EliminarEspecialidad).Methods("DELETE")

	r.HandleFunc("/api/v1/medicos", handlers.ListarMedicosConEspecialidades).Methods("GET")

	r.HandleFunc("/api/v1/medicos-con-especialidades", handlers.ListarMedicosConEspecialidades).Methods("GET")
	r.HandleFunc("/api/v1/especialidades/{id}/medicos", handlers.ListarMedicosPorEspecialidad).Methods("GET")

	// Ruta para asignar especialidad a un médico
	r.HandleFunc("/api/v1/medicos/{id}/especialidades", handlers.AsignarEspecialidad).Methods("POST")
	r.HandleFunc("/api/v1/medicos/{id}/especialidades/{id}", handlers.EliminarMedicoEspecialidad).Methods("DELETE")
	r.HandleFunc("/api/v1/admin/reportes", handlers.ObtenerDatosReporte).Methods("GET")

	api.HandleFunc("/medicos/{id}/citas", handlers.ObtenerCitasPorMedico).Methods("GET")
	api.HandleFunc("/citas/{id}/cancelar", handlers.CancelarCita).Methods("PUT")

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

	api.Handle("/medicos", middleware.JWTMiddleware(http.HandlerFunc(handlers.ListarMedicos))).Methods("GET")
	api.Handle("/medicos/{id}/especialidades/{especialidadId}", middleware.JWTMiddleware(http.HandlerFunc(handlers.EliminarMedicoEspecialidad))).Methods("DELETE")

	return r
}
