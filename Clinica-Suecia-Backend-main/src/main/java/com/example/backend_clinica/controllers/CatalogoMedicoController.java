package com.example.backend_clinica.controllers;

import com.example.backend_clinica.dto.TratamientoDTO;
import com.example.backend_clinica.entities.Enfermedad;
import com.example.backend_clinica.services.CatalogoMedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogo")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CatalogoMedicoController {

    private final CatalogoMedicoService catalogoMedicoService;

    @GetMapping("/enfermedades")
    public List<Enfermedad> listarEnfermedades() {
        return catalogoMedicoService.obtenerEnfermedades();
    }

    @GetMapping("/enfermedades/{id}/tratamientos")
    public List<TratamientoDTO> listarTratamientos(@PathVariable Long id) {
        return catalogoMedicoService.obtenerTratamientosPorEnfermedad(id);
    }

}