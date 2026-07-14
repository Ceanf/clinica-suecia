package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.HistorialClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HistorialClinicoRepository extends JpaRepository<HistorialClinico, Long> {
    // Buscar el historial único de un paciente
    Optional<HistorialClinico> findByPacienteId(Long pacienteId);
}
