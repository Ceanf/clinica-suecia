package com.example.backend_clinica.controllers;

import com.example.backend_clinica.dto.DashboardDTO;
import com.example.backend_clinica.repositories.CitaMedicaRepository;
import com.example.backend_clinica.repositories.PacienteRepository;
import com.example.backend_clinica.repositories.MedicoRepository;
import com.example.backend_clinica.repositories.RecetaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    @Autowired private PacienteRepository pacienteRepo;
    @Autowired private MedicoRepository medicoRepo;
    @Autowired private CitaMedicaRepository citaRepo;
    @Autowired private RecetaRepository recetaRepo;

    @GetMapping("/resumen")
    public DashboardDTO obtenerResumen() {
        DashboardDTO dashboard = new DashboardDTO();

        // 1. Llenamos los KPIs
        dashboard.setTotalPacientes(pacienteRepo.count());
        dashboard.setTotalMedicos(medicoRepo.count());
        dashboard.setCitasDeHoy(citaRepo.contarCitasDeHoy());

        // 2. Formateamos los datos del Gráfico de Citas
        List<Map<String, Object>> listaEstados = new ArrayList<>();
        for (Object[] fila : citaRepo.contarCitasPorEstado()) {
            Map<String, Object> map = new HashMap<>();
            map.put("estado", fila[0]);
            map.put("cantidad", fila[1]);
            listaEstados.add(map);
        }
        dashboard.setCitasPorEstado(listaEstados);

        // 3. Formateamos los datos del Gráfico de Medicamentos
        List<Map<String, Object>> listaMedicinas = new ArrayList<>();
        for (Object[] fila : recetaRepo.obtenerTopMedicamentos()) {
            Map<String, Object> map = new HashMap<>();
            map.put("medicamento", fila[0]);
            map.put("cantidad", fila[1]);
            listaMedicinas.add(map);
        }
        dashboard.setTopMedicamentos(listaMedicinas);

        return dashboard;
    }
}
