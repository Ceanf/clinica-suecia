package com.example.backend_clinica.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component // Le dice a Spring Boot que esta clase es un componente reutilizable
public class JwtUtil {

    // 1. LA CLAVE SECRETA: Es la firma digital de tu clínica. 
    // Generamos una clave segura de manera automática para encriptar el token.
    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 2. TIEMPO DE EXPIRACIÓN: ¿Cuánto dura el brazalete antes de vencer?
    // 86400000 milisegundos equivalen exactamente a 24 Horas.
    private final long EXPIRATION_TIME = 86400000;

    /**
     * MÉTODOS DE LA MÁQUINA:
     */

    // FUNCIÓN A: CREAR EL TOKEN (Se usa en el Login)
    public String generarToken(String username, Long rolId) {
        // Los "Claims" son las cosas que guardamos dentro del sobre (el token)
        Map<String, Object> datosExtra = new HashMap<>();
        datosExtra.put("rol", rolId); // Guardamos el Rol para que Angular lo lea fácilmente

        return Jwts.builder()
                .setClaims(datosExtra) // Metemos el rol
                .setSubject(username) // El dueño del token (el correo del usuario)
                .setIssuedAt(new Date(System.currentTimeMillis())) // Fecha de creación (Ahora)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Fecha de vencimiento
                .signWith(SECRET_KEY) // Firmamos el token con nuestra clave ultra secreta
                .compact(); // Lo empaqueta todo en ese String largo de tres partes
    }

    // FUNCIÓN B: OBTENER EL USUARIO DESDE EL TOKEN (Se usa para saber quién está llamando)
    public String obtenerUsername(String token) {
        return extraerTodosLosDatos(token).getSubject();
    }

    // FUNCIÓN C: VALIDAR SI EL TOKEN ES REAL Y NO HA EXPIRADO
    public boolean validarToken(String token, String usernameAsociado) {
        final String usernameDelToken = obtenerUsername(token);
        // El token es válido si pertenece al usuario y además no ha caducado
        return (usernameDelToken.equals(usernameAsociado) && !estaExpirado(token));
    }

    // Herramienta interna para verificar la fecha de vencimiento
    private boolean estaExpirado(String token) {
        return extraerTodosLosDatos(token).getExpiration().before(new Date());
    }

    // 🚨 MODIFICADO A PUBLIC: Ahora nuestro JwtRequestFilter puede usar esta herramienta
    // para leer el rol del usuario directamente del token.
    public Claims extraerTodosLosDatos(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY) // Ponemos la llave para abrir el candado
                .build()
                .parseClaimsJws(token)
                .getBody(); // Saca los datos de adentro
    }
}