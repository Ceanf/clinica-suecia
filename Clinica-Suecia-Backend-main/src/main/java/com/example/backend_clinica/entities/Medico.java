package com.example.backend_clinica.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "medicos")
@Data // Esto te ahorra escribir Getters y Setters
public class Medico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medico_id")
    private Long medicoId;

    private String nombre;
    private String apellido;
    private String dni;
    private String cmp;

    @Column(name = "usuario_id") // La llave foránea de tu diagrama
    private Long usuarioId;

    @Column(name = "especialidad_id") // La otra llave foránea
    private Integer especialidadId;
}
