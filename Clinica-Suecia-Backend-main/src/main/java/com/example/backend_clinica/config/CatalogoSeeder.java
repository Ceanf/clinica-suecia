package com.example.backend_clinica.config;

import com.example.backend_clinica.entities.Enfermedad;
import com.example.backend_clinica.entities.Medicamento;
import com.example.backend_clinica.enums.TipoMedicamento;
import com.example.backend_clinica.repositories.EnfermedadRepository;
import com.example.backend_clinica.repositories.MedicamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)

@RequiredArgsConstructor
public class CatalogoSeeder implements CommandLineRunner {

    private final EnfermedadRepository enfermedadRepository;
    private final MedicamentoRepository medicamentoRepository;

    @Override
    public void run(String... args) {

        cargarEnfermedades();
        cargarMedicamentos();

    }

    private void cargarEnfermedades() {

        if (enfermedadRepository.count() > 0)
            return;

        crearEnfermedad("Gripe","Infección viral del sistema respiratorio.");
        crearEnfermedad("Resfriado Común","Infección respiratoria leve.");
        crearEnfermedad("Amigdalitis","Inflamación de las amígdalas.");
        crearEnfermedad("Faringitis","Inflamación de la faringe.");
        crearEnfermedad("Rinitis Alérgica","Inflamación de la mucosa nasal.");
        crearEnfermedad("Bronquitis","Inflamación de los bronquios.");
        crearEnfermedad("Gastritis","Inflamación de la mucosa gástrica.");
        crearEnfermedad("Migraña","Dolor intenso de cabeza.");
        crearEnfermedad("Otitis","Infección del oído.");
        crearEnfermedad("Sinusitis","Inflamación de los senos paranasales.");

        System.out.println("✔ Enfermedades cargadas.");

    }

    private void cargarMedicamentos() {

        if (medicamentoRepository.count() > 0)
            return;

        crearMedicamento("Paracetamol",TipoMedicamento.TABLETA,"500 mg","Genfar");
        crearMedicamento("Ibuprofeno",TipoMedicamento.CAPSULA,"400 mg","MK");
        crearMedicamento("Naproxeno",TipoMedicamento.TABLETA,"500 mg","Genfar");
        crearMedicamento("Diclofenaco",TipoMedicamento.TABLETA,"50 mg","MK");
        crearMedicamento("Loratadina",TipoMedicamento.TABLETA,"10 mg","Genfar");
        crearMedicamento("Cetirizina",TipoMedicamento.TABLETA,"10 mg","Genfar");
        crearMedicamento("Amoxicilina",TipoMedicamento.CAPSULA,"500 mg","Genfar");
        crearMedicamento("Azitromicina",TipoMedicamento.TABLETA,"500 mg","Portugal");
        crearMedicamento("Omeprazol",TipoMedicamento.CAPSULA,"20 mg","Genfar");
        crearMedicamento("Pantoprazol",TipoMedicamento.TABLETA,"40 mg","MK");

        System.out.println("✔ Medicamentos cargados.");

    }

    private void crearEnfermedad(String nombre,String descripcion){

        Enfermedad enfermedad = new Enfermedad();

        enfermedad.setNombre(nombre);
        enfermedad.setDescripcion(descripcion);

        enfermedadRepository.save(enfermedad);

    }

    private void crearMedicamento(String nombre,
                                  TipoMedicamento tipo,
                                  String concentracion,
                                  String laboratorio){

        Medicamento medicamento = new Medicamento();

        medicamento.setNombre(nombre);
        medicamento.setTipo(tipo);
        medicamento.setConcentracion(concentracion);
        medicamento.setLaboratorio(laboratorio);
        medicamento.setActivo(true);

        medicamentoRepository.save(medicamento);

    }

}