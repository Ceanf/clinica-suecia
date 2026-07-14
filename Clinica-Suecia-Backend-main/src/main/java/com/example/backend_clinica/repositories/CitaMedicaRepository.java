package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.CitaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaMedicaRepository extends JpaRepository<CitaMedica, Long> {
    
    // 1. Para que el paciente o administrador vea su historial de citas
    List<CitaMedica> findByPacienteId(Long pacienteId);

    // 2. Para que el médico vea su agenda del día
    List<CitaMedica> findByMedicoId(Long medicoId);

    // 🚨 MAGIA MATEMÁTICA: Busca si hay citas estrictamente dentro de un rango de tiempo
    @Query("SELECT COUNT(c) > 0 FROM CitaMedica c WHERE c.medicoId = :medicoId AND c.fechaHora > :inicio AND c.fechaHora < :fin")
    boolean existeCruceMedico(@Param("medicoId") Long medicoId, @Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    // 🚨 MAGIA MATEMÁTICA: Busca si el consultorio está ocupado dentro del rango de tiempo
    @Query("SELECT COUNT(c) > 0 FROM CitaMedica c WHERE c.consultorioId = :consultorioId AND c.fechaHora > :inicio AND c.fechaHora < :fin")
    boolean existeCruceConsultorio(@Param("consultorioId") Integer consultorioId, @Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    // 🚨 Contar cuántas citas hay exactamente HOY
    @org.springframework.data.jpa.repository.Query(value = "SELECT COUNT(*) FROM citas_medicas WHERE DATE(fecha_hora) = CURRENT_DATE", nativeQuery = true)
    long contarCitasDeHoy();

    // 🚨 Agrupar citas por estado (Ej: 10 Atendidas, 5 Pendientes)
    @org.springframework.data.jpa.repository.Query(value = "SELECT estado, COUNT(*) as cantidad FROM citas_medicas GROUP BY estado", nativeQuery = true)
    java.util.List<Object[]> contarCitasPorEstado();
}
