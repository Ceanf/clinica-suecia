package com.example.backend_clinica.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RegistroCitaDTO {
    private Long pacienteId;
    private Long medicoId;
    private Integer consultorioId;
    private LocalDateTime fechaHora; // Angular debe mandarlo en formato: "2026-05-24T10:00:00"
    private String motivoConsulta;
}
