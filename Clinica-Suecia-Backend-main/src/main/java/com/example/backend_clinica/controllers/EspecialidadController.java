package com.example.backend_clinica.controllers;

import com.example.backend_clinica.entities.Especialidad;
import com.example.backend_clinica.repositories.EspecialidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200") // Permite la conexión segura de Angular
public class EspecialidadController {

    @Autowired
    private EspecialidadRepository especialidadRepository;

    // 🔍 ENDPOINT: Jala todas las especialidades activas de Supabase
    @GetMapping("/especialidades")
    public ResponseEntity<List<Especialidad>> listarEspecialidades() {
        List<Especialidad> lista = especialidadRepository.findAll();
        return ResponseEntity.ok(lista);
    }
}
