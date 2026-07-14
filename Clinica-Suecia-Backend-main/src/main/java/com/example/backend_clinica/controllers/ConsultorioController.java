package com.example.backend_clinica.controllers;

import com.example.backend_clinica.entities.Consultorio;
import com.example.backend_clinica.repositories.ConsultorioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultorios")
@CrossOrigin(origins = "http://localhost:4200")
public class ConsultorioController {

    @Autowired
    private ConsultorioRepository consultorioRepository;

    // 1. LEER TODOS (GET)
    @GetMapping
    public ResponseEntity<List<Consultorio>> listarConsultorios() {
        List<Consultorio> lista = consultorioRepository.findAll();
        return ResponseEntity.ok(lista);
    }

    // 2. LEER UNO SOLO POR ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerConsultorio(@PathVariable Integer id) {
        return consultorioRepository.findById(id)
                .<ResponseEntity<?>>map(consultorio -> ResponseEntity.ok(consultorio)) // 🚨 Comodín agregado aquí
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Consultorio no encontrado"));
    }

    // 3. CREAR NUEVO (POST)
    @PostMapping
    public ResponseEntity<Consultorio> crearConsultorio(@RequestBody Consultorio consultorio) {
        Consultorio nuevo = consultorioRepository.save(consultorio);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // 4. ACTUALIZAR (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarConsultorio(@PathVariable Integer id, @RequestBody Consultorio datos) {
        return consultorioRepository.findById(id)
                .<ResponseEntity<?>>map(consultorioExistente -> { // 🚨 Comodín agregado aquí
                    consultorioExistente.setNombreSala(datos.getNombreSala());
                    consultorioExistente.setPiso(datos.getPiso());
                    consultorioExistente.setTipo(datos.getTipo());
                    
                    Consultorio actualizado = consultorioRepository.save(consultorioExistente);
                    return ResponseEntity.ok(actualizado);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Consultorio no encontrado"));
    }

    // 5. ELIMINAR (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarConsultorio(@PathVariable Integer id) {
        return consultorioRepository.findById(id)
                .<ResponseEntity<?>>map(consultorio -> { // 🚨 Comodín agregado aquí
                    consultorioRepository.delete(consultorio);
                    return ResponseEntity.ok().body("Consultorio eliminado correctamente");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Consultorio no encontrado"));
    }
}