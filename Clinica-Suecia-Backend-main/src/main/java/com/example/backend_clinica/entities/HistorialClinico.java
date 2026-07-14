package com.example.backend_clinica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "historial_clinico")
public class HistorialClinico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "historial_id")
    private Long historialId;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(name = "fecha_apertura")
    private LocalDateTime fechaApertura;

    @Column(name = "antecedentes_familiares", columnDefinition = "TEXT")
    private String antecedentesFamiliares;

    @Column(columnDefinition = "TEXT")
    private String alergias;

    @Column(name = "grupo_sanguineo", length = 20)
    private String grupoSanguineo;
}
