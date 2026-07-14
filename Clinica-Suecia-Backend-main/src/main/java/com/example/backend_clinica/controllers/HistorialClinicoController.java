package com.example.backend_clinica.controllers;

import com.example.backend_clinica.entities.HistorialClinico;
import com.example.backend_clinica.services.HistorialClinicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin(origins = "http://localhost:4200")
public class HistorialClinicoController {

    @Autowired
    private HistorialClinicoService service;

    // Obtener la ficha base del paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<HistorialClinico> obtenerHistorial(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(service.obtenerOcrearHistorial(pacienteId));
    }

    // Actualizar la ficha base del paciente
    @PutMapping("/paciente/{pacienteId}")
    public ResponseEntity<HistorialClinico> actualizarHistorial(@PathVariable Long pacienteId, @RequestBody HistorialClinico datos) {
        return ResponseEntity.ok(service.actualizarHistorial(pacienteId, datos));
    }
}