package com.example.backend_clinica.services;

import com.example.backend_clinica.dto.RegistroCitaDTO;
import com.example.backend_clinica.entities.CitaMedica;
import com.example.backend_clinica.entities.Receta;
import com.example.backend_clinica.repositories.CitaMedicaRepository;
import com.example.backend_clinica.repositories.RecetaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

// @Service le dice a Spring Boot: "Esta clase es un Cerebro. Aquí están las reglas del negocio".
@Service
public class CitaMedicaService {

    // @Autowired es "Inyección de dependencias". Significa que Spring conecta la Base de Datos 
    // automáticamente por nosotros sin que tengamos que escribir código repetitivo.
    @Autowired
    private CitaMedicaRepository citaRepository;

    // 🚨 NUEVO: Agregamos el puente a la tabla de recetas para el "Camino B"
    @Autowired
    private RecetaRepository recetaRepository;


    // @Transactional es como un "Ctrl + Z" (Deshacer) automático. 
    // Si el código falla a la mitad, esta anotación borra los cambios a medias en la base de datos.
    @Transactional
    public CitaMedica agendarCita(RegistroCitaDTO dto) throws Exception {
        
        // 1. MATEMÁTICA DE TIEMPO: Creamos un "colchón" de 30 minutos.
        // minusMinutes(30) resta 30 mins a la hora solicitada. plusMinutes(30) le suma 30 mins.
        LocalDateTime inicioRango = dto.getFechaHora().minusMinutes(30);
        LocalDateTime finRango = dto.getFechaHora().plusMinutes(30);
        
        // 2. PROTECCIÓN DEL MÉDICO: Preguntamos a la base de datos si el doctor ya tiene 
        // una cita agendada que choque dentro de ese colchón de tiempo.
        if (citaRepository.existeCruceMedico(dto.getMedicoId(), inicioRango, finRango)) {
            // "throw new Exception" detiene el código de golpe y escupe este mensaje de error en rojo.
            throw new Exception("El médico ya tiene una cita que se cruza con este horario (las citas duran 30 min).");
        }

        // 3. PROTECCIÓN DEL CONSULTORIO: Hacemos exactamente lo mismo, pero para la sala física.
        if (citaRepository.existeCruceConsultorio(dto.getConsultorioId(), inicioRango, finRango)) {
            throw new Exception("El consultorio seleccionado estará ocupado durante este rango de tiempo.");
        }

        // 4. CREACIÓN: Si el código llegó hasta aquí, significa que no chocó con nada. 
        // Instanciamos (creamos) una cita en blanco y la empezamos a rellenar con los datos del frontend.
        CitaMedica nuevaCita = new CitaMedica();
        nuevaCita.setPacienteId(dto.getPacienteId());
        nuevaCita.setMedicoId(dto.getMedicoId());
        nuevaCita.setConsultorioId(dto.getConsultorioId());
        nuevaCita.setFechaHora(dto.getFechaHora());
        nuevaCita.setMotivoConsulta(dto.getMotivoConsulta());
        
        // Toda cita nace con este estado por defecto.
        nuevaCita.setEstado("Pendiente"); 

        // ".save()" es el comando mágico que inserta los datos en la tabla de PostgreSQL.
        return citaRepository.save(nuevaCita);
    }


    // 🚨 ACTUALIZADO CON RECETAS: Atender al paciente
    @Transactional
    public CitaMedica atenderCita(Long citaId, com.example.backend_clinica.dto.AtencionMedicaDTO dto) throws Exception {
        
        // 1. BUSCAR: findById busca la cita en la base de datos. 
        // ".orElseThrow" significa: "Si no la encuentras, lanza un error inmediatamente y detente".
        CitaMedica cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new Exception("Error: Cita no encontrada."));

        // 2. VALIDAR ESTADO: Solo podemos atender citas "Pendientes". 
        // El símbolo "!" al principio significa "NO". (Si el estado NO es Pendiente...).
        if (!cita.getEstado().equals("Pendiente")) {
            throw new Exception("Error: Esta cita ya fue procesada anteriormente.");
        }

        // 3. ACTUALIZAR: Llenamos los datos médicos que mandó el doctor.
        cita.setDiagnostico(dto.getDiagnostico());
        cita.setObservaciones(dto.getObservaciones()); 
        cita.setEstado("Atendida");
        cita.setFechaAtencion(LocalDateTime.now()); // LocalDateTime.now() captura la hora exacta de este milisegundo.

        // Guardamos la actualización de la Cita Médica primero.
        CitaMedica citaGuardada = citaRepository.save(cita);

        // 4. 🚨 LA MAGIA DE LAS RECETAS (Camino B): 
        // Preguntamos: "¿El doctor envió una lista de medicinas y esa lista NO está vacía?"
        if (dto.getRecetas() != null && !dto.getRecetas().isEmpty()) {
            
            // Este es un "Bucle For-Each". Significa: "Por cada medicamento (item) que haya en la lista..."
            for (com.example.backend_clinica.dto.AtencionMedicaDTO.RecetaItemDTO item : dto.getRecetas()) {
                
                // ...crea una Receta en blanco...
                Receta nuevaReceta = new Receta();
                
                // ...únela al ID de la cita que acabamos de atender...
                nuevaReceta.setCitaId(citaGuardada.getCitaId());
                
                // ...rellénala con los datos del medicamento...
                nuevaReceta.setMedicamento(item.getMedicamento());
                nuevaReceta.setDosis(item.getDosis());
                nuevaReceta.setInstrucciones(item.getInstrucciones());
                
                // ...y guárdala en la tabla 'recetas' de PostgreSQL. (Esto se repetirá por cada pastilla).
                recetaRepository.save(nuevaReceta);
            }
        }

        return citaGuardada;
    }


    // 🚨 REGLA: Marcar inasistencia del paciente
    @Transactional
    public CitaMedica marcarInasistencia(Long citaId) throws Exception {
        
        // Repetimos la lógica de buscar. Si no existe, explota.
        CitaMedica cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new Exception("Error: Cita no encontrada."));

        // Protegemos para que el doctor no pueda poner "No Asistió" a una cita que ya fue "Atendida".
        if (!cita.getEstado().equals("Pendiente")) {
            throw new Exception("Error: Solo se puede marcar inasistencia de citas pendientes.");
        }

        // Cambiamos el texto y guardamos.
        cita.setEstado("No Asistió");
        return citaRepository.save(cita);
    }
}