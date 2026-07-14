package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.Receta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecetaRepository extends JpaRepository<Receta, Long> {
    // Para buscar todas las medicinas de una cita específica
    List<Receta> findByCitaId(Long citaId);

    // 🚨 Top 5 medicamentos más recetados
    @org.springframework.data.jpa.repository.Query(value = "SELECT medicamento, COUNT(*) as cantidad FROM recetas GROUP BY medicamento ORDER BY cantidad DESC LIMIT 5", nativeQuery = true)
    java.util.List<Object[]> obtenerTopMedicamentos();
}
