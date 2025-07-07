package utils

import (
	"regexp"
	"strings"
)

// Valida si un correo tiene formato válido
func EsCorreoValido(correo string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`)
	return re.MatchString(correo)
}

// Capitaliza la primera letra de una cadena
func Capitalizar(str string) string {
	if len(str) == 0 {
		return ""
	}
	return strings.ToUpper(string(str[0])) + strings.ToLower(str[1:])
}

// Limpia espacios extra
func LimpiarEspacios(str string) string {
	return strings.TrimSpace(str)
}
