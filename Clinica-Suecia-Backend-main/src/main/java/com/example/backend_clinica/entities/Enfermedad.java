package com.example.backend_clinica.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "enfermedades")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"tratamientos"})
public class Enfermedad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enfermedad_id")
    private Long enfermedadId;

    @Column(nullable = false, unique = true, length = 150)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @OneToMany(
            mappedBy = "enfermedad",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<Tratamiento> tratamientos;

}