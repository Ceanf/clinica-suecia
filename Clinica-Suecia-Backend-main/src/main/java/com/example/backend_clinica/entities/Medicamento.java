package com.example.backend_clinica.entities;

import com.example.backend_clinica.enums.TipoMedicamento;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "medicamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"tratamientos"})
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medicamento_id")
    private Long medicamentoId;

    @Column(nullable = false, unique = true, length = 150)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMedicamento tipo;

    @Column(nullable = false, length = 50)
    private String concentracion;

    @Column(length = 250)
    private String laboratorio;

    @Column(nullable = false)
    private Boolean activo = true;

    @OneToMany(
            mappedBy = "medicamento",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<Tratamiento> tratamientos;

}