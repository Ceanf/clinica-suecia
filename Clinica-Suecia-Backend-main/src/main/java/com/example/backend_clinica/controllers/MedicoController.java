package com.example.backend_clinica.controllers;

import com.example.backend_clinica.entities.Medico;
import com.example.backend_clinica.repositories.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "http://localhost:4200")
public class MedicoController {

    @Autowired
    private MedicoRepository medicoRepository;

    @GetMapping
    public ResponseEntity<List<Medico>> listarMedicos() {
        return ResponseEntity.ok(medicoRepository.findAll());
    }
}
