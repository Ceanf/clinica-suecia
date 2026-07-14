package com.example.backend_clinica.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "recetas")
public class Receta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "receta_id")
    private Long recetaId;

    @Column(name = "cita_id", nullable = false)
    private Long citaId;

    private String medicamento;
    private String dosis;
    
    @Column(columnDefinition = "TEXT")
    private String instrucciones;
}
