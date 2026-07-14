package com.example.backend_clinica.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PacienteEdicionDTO {
    private Long usuarioId;
    private String username;
    private String password;
    private boolean activo;
    private Integer rolId;

    // Datos específicos del perfil del paciente
    private String nombre;
    private String apellido;
    private String dni;
    private String telefono;
    private LocalDate fechaNacimiento; // Mapea directo con el date de Supabase
}
