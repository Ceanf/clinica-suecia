package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.Paciente;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByUsuarioId(Long usuarioId);
}
