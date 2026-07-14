package com.example.backend_clinica.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class DashboardDTO {
    // 1. Tarjetas Superiores (KPIs)
    private long totalPacientes;
    private long totalMedicos;
    private long citasDeHoy;
    
    // 2. Gráfico: Top 5 Medicamentos
    private List<Map<String, Object>> topMedicamentos;
    
    // 3. Gráfico: Estado de Citas (Para ver Asistencias vs Inasistencias)
    private List<Map<String, Object>> citasPorEstado;
}
