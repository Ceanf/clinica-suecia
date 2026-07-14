package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspecialidadRepository extends JpaRepository<Especialidad, Integer> {
    // Hereda de forma automática todos los métodos como findAll(), save(), etc.
}
