package com.example.backend_clinica.controllers;

import com.example.backend_clinica.dto.RegistroCitaDTO;
import com.example.backend_clinica.entities.CitaMedica;
import com.example.backend_clinica.repositories.CitaMedicaRepository;
import com.example.backend_clinica.services.CitaMedicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "http://localhost:4200")
public class CitaMedicaController {

    @Autowired
    private CitaMedicaService citaService;

    @Autowired
    private CitaMedicaRepository citaRepository;

    // 1. AGENDAR UNA NUEVA CITA (POST)
    @PostMapping
    public ResponseEntity<?> agendarCita(@RequestBody RegistroCitaDTO dto) {
        try {
            // Intentamos guardar la cita usando nuestro servicio blindado
            CitaMedica nuevaCita = citaService.agendarCita(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCita);
        } catch (Exception e) {
            // Si el servicio detecta un cruce de horarios, atrapamos el error y se lo mandamos a Angular
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 2. LISTAR TODAS LAS CITAS (GET) - Para el Administrador
    @GetMapping
    public ResponseEntity<List<CitaMedica>> listarTodas() {
        return ResponseEntity.ok(citaRepository.findAll());
    }

    // 3. LISTAR CITAS POR PACIENTE (GET) - Para el panel del Paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<CitaMedica>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(citaRepository.findByPacienteId(pacienteId));
    }

    // 4. LISTAR CITAS POR MÉDICO (GET) - Para la agenda del Médico
    @GetMapping("/medico/{medicoId}")
    public ResponseEntity<List<CitaMedica>> listarPorMedico(@PathVariable Long medicoId) {
        return ResponseEntity.ok(citaRepository.findByMedicoId(medicoId));
    }

    // 5. ATENDER CITA (PUT) - Exclusivo para el Médico
    @PutMapping("/atender/{id}")
    public ResponseEntity<?> atenderCita(@PathVariable Long id, @RequestBody com.example.backend_clinica.dto.AtencionMedicaDTO dto) {
        try {
            CitaMedica citaAtendida = citaService.atenderCita(id, dto);
            return ResponseEntity.ok(citaAtendida);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 6. MARCAR INASISTENCIA (PUT)
    @PutMapping("/inasistencia/{id}")
    public ResponseEntity<?> marcarInasistencia(@PathVariable Long id) {
        try {
            CitaMedica citaActualizada = citaService.marcarInasistencia(id);
            return ResponseEntity.ok(citaActualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
