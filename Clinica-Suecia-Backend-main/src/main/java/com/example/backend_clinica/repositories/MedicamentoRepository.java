package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {

    Optional<Medicamento> findByNombre(String nombre);

}