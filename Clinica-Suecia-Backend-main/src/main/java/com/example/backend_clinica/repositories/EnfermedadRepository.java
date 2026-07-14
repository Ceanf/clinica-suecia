package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.Enfermedad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnfermedadRepository extends JpaRepository<Enfermedad, Long> {

    Optional<Enfermedad> findByNombre(String nombre);

}