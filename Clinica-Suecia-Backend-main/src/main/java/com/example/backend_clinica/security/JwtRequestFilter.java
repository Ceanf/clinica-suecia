package com.example.backend_clinica.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // 1. Buscamos el token en la cabecera "Authorization"
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // 2. Si trae la palabra "Bearer ", lo extraemos
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.obtenerUsername(jwt);
            } catch (Exception e) {
                System.out.println("Error al leer el token JWT");
            }
        }

        // 3. Si encontramos un usuario y aún no está autenticado en Spring Security...
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Validamos que el token no haya expirado
            if (jwtUtil.validarToken(jwt, username)) {

                // 🚨 OJO AQUÍ: Extraemos el ID del Rol para convertirlo en Autoridad (ADMIN, MEDICO, PACIENTE)
                // (Asumiendo que 1=ADMIN, 2=MEDICO, 3=PACIENTE según tu base de datos)
                Integer rolId = (Integer) jwtUtil.extraerTodosLosDatos(jwt).get("rol");
                String nombreRol = mapearRol(rolId);

                // Le decimos a Spring Security quién es y qué rol tiene
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, Collections.singletonList(new SimpleGrantedAuthority(nombreRol))
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // ¡Le damos acceso oficial!
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Continuamos con el viaje de la petición
        chain.doFilter(request, response);
    }

    // Método auxiliar para traducir el número del rol a texto
    private String mapearRol(Integer rolId) {
        if (rolId == 1) return "ADMIN";
        if (rolId == 2) return "MEDICO";
        if (rolId == 3) return "PACIENTE";
        return "USER";
    }
}
