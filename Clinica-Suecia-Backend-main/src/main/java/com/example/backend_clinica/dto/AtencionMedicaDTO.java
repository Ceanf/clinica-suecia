package com.example.backend_clinica.dto;

import lombok.Data;
import java.util.List;

@Data
public class AtencionMedicaDTO {
    private String diagnostico;
    private String observaciones;
    
    // 🚨 NUEVO: Lista de medicamentos estructurados
    private List<RecetaItemDTO> recetas;

    // Sub-clase para recibir los datos de cada medicina
    @Data
    public static class RecetaItemDTO {
        private String medicamento;
        private String dosis;
        private String instrucciones;
    }
}
