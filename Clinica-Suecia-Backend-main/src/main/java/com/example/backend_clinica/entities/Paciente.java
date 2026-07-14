package com.example.backend_clinica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "pacientes")
@Data
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paciente_id")
    private Long pacienteId;

    private String nombre;
    private String apellido;
    private String dni;
    private String telefono;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "usuario_id")
    private Long usuarioId; // Aquí guardamos el ID de la cuenta creada
}