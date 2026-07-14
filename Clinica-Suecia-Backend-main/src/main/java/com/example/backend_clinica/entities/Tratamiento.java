package com.example.backend_clinica.entities;

import com.example.backend_clinica.enums.FrecuenciaMedicamento;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tratamientos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tratamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tratamiento_id")
    private Long tratamientoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enfermedad_id", nullable = false)
    @JsonIgnoreProperties("tratamientos")
    private Enfermedad enfermedad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicamento_id", nullable = false)
    @JsonIgnoreProperties("tratamientos")
    private Medicamento medicamento;

    @Column(nullable = false, length = 100)
    private String dosis;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FrecuenciaMedicamento frecuencia;

    @Column(nullable = false)
    private Integer duracionDias;

    @Column(length = 500)
    private String indicaciones;

    @Column(nullable = false)
    private Boolean activo = true;

}