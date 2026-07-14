package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.Tratamiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TratamientoRepository extends JpaRepository<Tratamiento, Long> {

    List<Tratamiento> findByEnfermedadEnfermedadId(Long enfermedadId);

}