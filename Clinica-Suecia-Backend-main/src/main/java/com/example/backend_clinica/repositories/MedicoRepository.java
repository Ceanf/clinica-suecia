package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.Medico;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Long> {
    Optional<Medico> findByUsuarioId(Long usuarioId);
}