package com.example.backend_clinica.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 🚨 1. Inyectamos a nuestro "Lector de Gafetes" (El filtro que acabas de
    // crear)
    @Autowired
    private com.example.backend_clinica.security.JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Activamos CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Desactivamos CSRF (Obligatorio para APIs REST)
                .csrf(csrf -> csrf.disable())

                // REGLAS DE AUTORIZACIÓN (Coinciden con Angular)
                .authorizeHttpRequests(auth -> auth

                        // 🚨 2. NUEVO: Dejar pasar las consultas de "Pre-vuelo" (OPTIONS) que hace el
                        // navegador Chrome/Edge
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
.requestMatchers("/api/catalogo/**").permitAll()
.requestMatchers("/api/especialidades/**").permitAll()
.requestMatchers("/api/medicos/**").permitAll()
                        // PÚBLICO: Login (Uso comodín por si tu ruta es /api/usuario/login o
                        // /api/usuarios/login)
                        // Dejamos pasar el Login y la ruta de Errores nativa de Spring Boot
                        .requestMatchers(
                                "/api/login",
                                "/api/registrar-paciente",
                                "/error")
                        .permitAll()
                        // ADMINISTRADOR (Rol 1): Acceso total a catálogos y dashboard
                        .requestMatchers("/api/dashboard/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/consultorios/**").hasAnyAuthority("ADMIN", "MEDICO", "PACIENTE")
                        .requestMatchers("/api/usuarios/**").hasAnyAuthority("ADMIN", "MEDICO", "PACIENTE")

                        // MÉDICO (Rol 2): Acceso a su agenda
                        .requestMatchers("/api/citas/medico/**").hasAnyAuthority("MEDICO", "ADMIN", "PACIENTE")

                        // PACIENTE (Rol 3): Acceso a su historial propio
                        .requestMatchers("/api/historial/paciente/**")
.hasAnyAuthority("PACIENTE", "MEDICO", "ADMIN")

                        // COMPARTIDO (ADMIN y PACIENTE): Registro y lectura de pacientes
                        .requestMatchers("/api/pacientes/**").hasAnyAuthority("ADMIN", "PACIENTE", "MEDICO")

                        // COMPARTIDO (ADMIN, MÉDICO y PACIENTE): Reservas de citas y doctores
                        .requestMatchers("/api/citas/**").hasAnyAuthority("ADMIN", "MEDICO", "PACIENTE")
                        .requestMatchers("/api/medicos/**").hasAnyAuthority("ADMIN", "MEDICO", "PACIENTE")
                        .requestMatchers("/api/especialidades/**").hasAnyAuthority("ADMIN", "MEDICO", "PACIENTE")

                        // CUALQUIER OTRA PETICIÓN NO DECLARADA DEBE EXIGIR INICIO DE SESIÓN
                        .anyRequest().authenticated());

        // 🚨 3. NUEVO: Ponemos nuestro filtro personalizado en la puerta, antes del
        // filtro por defecto de Spring
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}