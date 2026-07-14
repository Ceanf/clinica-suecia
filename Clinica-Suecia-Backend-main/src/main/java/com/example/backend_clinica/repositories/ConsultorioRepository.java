package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.Consultorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultorioRepository extends JpaRepository<Consultorio, Integer> {
    // Al heredar de JpaRepository, Spring Boot nos regala mágicamente 
    // todos los métodos para crear, leer, actualizar y eliminar consultorios.
}
