package com.example.backend_clinica.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegistroPacienteDTO {
    // Datos para la cuenta (tabla usuarios)
    private String email;
    private String username;
    private String password;

    // Datos personales (tabla pacientes)
    private String nombre;
    private String apellido;
    private String dni;
    private String telefono;
    private LocalDate fechaNacimiento;
}