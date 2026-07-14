package com.example.backend_clinica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TratamientoDTO {

    private Long tratamientoId;

    private Long medicamentoId;

    private String medicamento;

    private String tipo;

    private String concentracion;

    private String dosis;

    private String frecuencia;

    private Integer duracionDias;

    private String indicaciones;

}