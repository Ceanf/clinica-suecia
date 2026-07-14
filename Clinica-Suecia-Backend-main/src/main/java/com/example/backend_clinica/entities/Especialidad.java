package com.example.backend_clinica.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "especialidades") // Vincula directamente con tu tabla en Supabase
public class Especialidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "especialidad_id") // Nombre exacto de tu PK en el diagrama
    private Integer especialidadId;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
}