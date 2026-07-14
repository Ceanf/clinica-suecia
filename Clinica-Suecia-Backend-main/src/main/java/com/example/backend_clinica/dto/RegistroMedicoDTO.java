package com.example.backend_clinica.dto;

import lombok.Data;

@Data
public class RegistroMedicoDTO {
    // Datos para la cuenta (Tabla usuarios)
    private String email;
    private String username;
    private String password;
    
    // Datos profesionales (Tabla medicos)
    private String nombre;
    private String apellido;
    private String dni;
    private String cmp;
    private Integer especialidadId;
}