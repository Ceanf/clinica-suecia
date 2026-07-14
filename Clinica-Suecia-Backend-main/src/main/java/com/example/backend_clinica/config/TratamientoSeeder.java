package com.example.backend_clinica.config;

import com.example.backend_clinica.entities.Enfermedad;
import com.example.backend_clinica.entities.Medicamento;
import com.example.backend_clinica.entities.Tratamiento;
import com.example.backend_clinica.enums.FrecuenciaMedicamento;
import com.example.backend_clinica.repositories.EnfermedadRepository;
import com.example.backend_clinica.repositories.MedicamentoRepository;
import com.example.backend_clinica.repositories.TratamientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)

@RequiredArgsConstructor
public class TratamientoSeeder implements CommandLineRunner {

    private final EnfermedadRepository enfermedadRepository;
    private final MedicamentoRepository medicamentoRepository;
    private final TratamientoRepository tratamientoRepository;

    @Override
    public void run(String... args) {

        if(tratamientoRepository.count()>0){
            return;
        }

        crearTratamiento(
                "Gripe",
                "Paracetamol",
                "500 mg",
                FrecuenciaMedicamento.CADA_8_HORAS,
                5,
                "Tomar después de los alimentos."
        );

        crearTratamiento(
                "Gripe",
                "Loratadina",
                "10 mg",
                FrecuenciaMedicamento.CADA_24_HORAS,
                5,
                "Una tableta diaria."
        );

        crearTratamiento(
                "Resfriado Común",
                "Paracetamol",
                "500 mg",
                FrecuenciaMedicamento.CADA_8_HORAS,
                3,
                "Reposo e hidratación."
        );

        crearTratamiento(
                "Resfriado Común",
                "Cetirizina",
                "10 mg",
                FrecuenciaMedicamento.CADA_24_HORAS,
                5,
                "Una tableta al día."
        );

        crearTratamiento(
                "Gastritis",
                "Omeprazol",
                "20 mg",
                FrecuenciaMedicamento.ANTES_DEL_DESAYUNO,
                14,
                "Tomar 30 minutos antes del desayuno."
        );

        crearTratamiento(
                "Migraña",
                "Ibuprofeno",
                "400 mg",
                FrecuenciaMedicamento.CADA_8_HORAS,
                3,
                "Solo si hay dolor."
        );

        crearTratamiento(
                "Migraña",
                "Naproxeno",
                "500 mg",
                FrecuenciaMedicamento.CADA_12_HORAS,
                5,
                "Tomar con alimentos."
        );

        System.out.println("✔ Tratamientos cargados.");
    }

    private void crearTratamiento(
            String nombreEnfermedad,
            String nombreMedicamento,
            String dosis,
            FrecuenciaMedicamento frecuencia,
            Integer duracionDias,
            String indicaciones){

        Enfermedad enfermedad = enfermedadRepository.findByNombre(nombreEnfermedad)
                .orElseThrow();

        Medicamento medicamento = medicamentoRepository.findByNombre(nombreMedicamento)
                .orElseThrow();

        Tratamiento tratamiento = new Tratamiento();

        tratamiento.setEnfermedad(enfermedad);
        tratamiento.setMedicamento(medicamento);
        tratamiento.setDosis(dosis);
        tratamiento.setFrecuencia(frecuencia);
        tratamiento.setDuracionDias(duracionDias);
        tratamiento.setIndicaciones(indicaciones);
        tratamiento.setActivo(true);

        tratamientoRepository.save(tratamiento);

    }

}