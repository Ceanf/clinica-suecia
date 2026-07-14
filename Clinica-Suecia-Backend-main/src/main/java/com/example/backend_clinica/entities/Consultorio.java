package com.example.backend_clinica.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "consultorios") // Vincula con la tabla exacta de Supabase
public class Consultorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consultorio_id")
    private Integer consultorioId;

    @Column(name = "nombre_sala", nullable = false, length = 100)
    private String nombreSala;

    @Column(name = "piso")
    private Integer piso;

    @Column(name = "tipo", length = 100)
    private String tipo; // Ej: "General", "Pediatría", "Cirugía Menor"
}