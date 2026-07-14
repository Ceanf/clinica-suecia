package com.example.backend_clinica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List; // 🚨 IMPORTANTE: Necesario importar esto para manejar múltiples recetas

@Data
@Entity
@Table(name = "citas_medicas")
public class CitaMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cita_id")
    private Long citaId;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(name = "medico_id", nullable = false)
    private Long medicoId;

    @Column(name = "consultorio_id", nullable = false)
    private Integer consultorioId;

    // Usamos LocalDateTime porque el diagrama indica 'timestamp' (fecha y hora exacta)
    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora; 

    @Column(name = "estado", length = 50)
    private String estado; // Ej: "Pendiente", "Atendida", "Cancelada"

    @Column(name = "motivo_consulta", columnDefinition = "TEXT")
    private String motivoConsulta;

    // Estos campos se llenarán después, cuando el médico atienda al paciente (Módulo 6)
    @Column(name = "diagnostico", columnDefinition = "TEXT")
    private String diagnostico;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_atencion")
    private LocalDateTime fechaAtencion; 

    // 🚨 NUEVA MAGIA: Relación de 1 a Muchos (Camino B).
    // Le indicamos a Java que una cita médica puede tener MUCHAS medicinas en la tabla 'recetas'.
    // Usamos insertable = false, updatable = false porque las insertamos manualmente desde el Servicio (CitaMedicaService),
    // aquí solo queremos que Java las LEA y las adjunte automáticamente al descargar la cita para el paciente.
    @OneToMany
    @JoinColumn(name = "cita_id", insertable = false, updatable = false)
    private List<Receta> recetas;
}