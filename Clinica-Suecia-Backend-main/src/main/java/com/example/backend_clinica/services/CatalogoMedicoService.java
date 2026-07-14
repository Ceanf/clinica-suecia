package com.example.backend_clinica.services;

import com.example.backend_clinica.dto.TratamientoDTO;
import com.example.backend_clinica.entities.Tratamiento;
import com.example.backend_clinica.entities.Enfermedad;
import com.example.backend_clinica.repositories.EnfermedadRepository;
import com.example.backend_clinica.repositories.TratamientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogoMedicoService {

    private final EnfermedadRepository enfermedadRepository;
    private final TratamientoRepository tratamientoRepository;

    public List<Enfermedad> obtenerEnfermedades() {
        return enfermedadRepository.findAll();
    }

    public List<TratamientoDTO> obtenerTratamientosPorEnfermedad(Long enfermedadId) {

        List<Tratamiento> tratamientos =
                tratamientoRepository.findByEnfermedadEnfermedadId(enfermedadId);

        return tratamientos.stream()
                .map(this::convertirDTO)
                .collect(Collectors.toList());

    }

    private TratamientoDTO convertirDTO(Tratamiento t){

        TratamientoDTO dto = new TratamientoDTO();

        dto.setTratamientoId(t.getTratamientoId());

        dto.setMedicamentoId(t.getMedicamento().getMedicamentoId());

        dto.setMedicamento(t.getMedicamento().getNombre());

        dto.setTipo(t.getMedicamento().getTipo().name());

        dto.setConcentracion(t.getMedicamento().getConcentracion());

        dto.setDosis(t.getDosis());

        dto.setFrecuencia(t.getFrecuencia().name());

        dto.setDuracionDias(t.getDuracionDias());

        dto.setIndicaciones(t.getIndicaciones());

        return dto;

    }

}