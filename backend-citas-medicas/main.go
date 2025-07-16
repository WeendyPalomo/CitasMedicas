// file: main.go
package main

import (
	"backend-citas-medicas/config"
	"backend-citas-medicas/middleware"
	"backend-citas-medicas/routes"
	"log"
	"net/http"
)

func main() {
	config.ConectarDB()

	r := routes.SetupRoutes()

	// Habilitar CORS global
	handler := middleware.CORSMiddleware(r)

	log.Println("Servidor corriendo en http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
