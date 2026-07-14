package com.example.backend_clinica.services;

import com.example.backend_clinica.entities.HistorialClinico;
import com.example.backend_clinica.repositories.HistorialClinicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class HistorialClinicoService {

    @Autowired
    private HistorialClinicoRepository repository;

    // 🚨 MAGIA SENIOR: Si no existe, crea uno vacío automáticamente
    public HistorialClinico obtenerOcrearHistorial(Long pacienteId) {
        Optional<HistorialClinico> historial = repository.findByPacienteId(pacienteId);
        
        if (historial.isPresent()) {
            return historial.get();
        } else {
            HistorialClinico nuevo = new HistorialClinico();
            nuevo.setPacienteId(pacienteId);
            nuevo.setFechaApertura(LocalDateTime.now());
            nuevo.setAlergias("Ninguna registrada");
            nuevo.setAntecedentesFamiliares("Ninguno registrado");
            nuevo.setGrupoSanguineo("N/A");
            return repository.save(nuevo);
        }
    }

    // Para cuando el doctor actualice las alergias o grupo sanguíneo
    public HistorialClinico actualizarHistorial(Long pacienteId, HistorialClinico datos) {
        HistorialClinico actual = obtenerOcrearHistorial(pacienteId);
        actual.setAlergias(datos.getAlergias());
        actual.setAntecedentesFamiliares(datos.getAntecedentesFamiliares());
        actual.setGrupoSanguineo(datos.getGrupoSanguineo());
        return repository.save(actual);
    }
}
