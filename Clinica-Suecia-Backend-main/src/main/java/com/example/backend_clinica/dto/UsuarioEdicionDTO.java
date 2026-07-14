package com.example.backend_clinica.dto;

import lombok.Data;

@Data
public class UsuarioEdicionDTO {
    // Datos de la cuenta de usuario
    private String username;
    private String password;
    private Integer rolId;
    private boolean activo;

    // Datos profesionales extras (Por si pasa a ser Médico)
    private String nombre;
    private String apellido;
    private String dni;
    private String cmp;
    private Integer especialidadId; // O especialidadId, según lo tengas en tu base de datos
}
