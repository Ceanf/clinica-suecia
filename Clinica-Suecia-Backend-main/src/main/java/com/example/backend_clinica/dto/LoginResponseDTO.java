package com.example.backend_clinica.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String token;
    private String username;
    private Long rolId;

    // Constructor para llenar los datos rápido
    public LoginResponseDTO(String token, String username, Long rolId) {
        this.token = token;
        this.username = username;
        this.rolId = rolId;
    }
}