package com.example.backend_clinica.services;


import com.example.backend_clinica.entities.Paciente;
import com.example.backend_clinica.entities.Usuario;
import com.example.backend_clinica.repositories.PacienteRepository;
import com.example.backend_clinica.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PacienteService {

    @Autowired private UsuarioRepository usuarioRepo;
    @Autowired private PacienteRepository pacienteRepo;
    @Autowired private PasswordEncoder passwordEncoder;

   @Transactional
    public void registrarPacienteCompleto(com.example.backend_clinica.dto.RegistroPacienteDTO dto) {
        Usuario usuario = new Usuario();
        
        // 🚨 CONTROL COMODÍN: Si Angular envía 'username' o 'email', capturamos cualquiera de forma segura
        if (dto.getUsername() != null && !dto.getUsername().isEmpty()) {
            usuario.setUsername(dto.getUsername());
        } else {
            usuario.setUsername(dto.getEmail());
        }

        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRolId(3); // Rol 3 = Paciente
        usuario.setActivo(true);
        Usuario usuarioGuardado = usuarioRepo.save(usuario);

        Paciente paciente = new Paciente();
        paciente.setNombre(dto.getNombre());
        paciente.setApellido(dto.getApellido());
        paciente.setDni(dto.getDni());
        paciente.setTelefono(dto.getTelefono());
        paciente.setFechaNacimiento(dto.getFechaNacimiento());
        paciente.setUsuarioId(usuarioGuardado.getUsuarioId());

        pacienteRepo.save(paciente);
    }

    @Transactional
    public void actualizarDatosPaciente(Long usuarioId, com.example.backend_clinica.dto.PacienteEdicionDTO dto) {
        pacienteRepo.findByUsuarioId(usuarioId)
                .ifPresentOrElse(
                    pacienteExistente -> {
                        // SI YA EXISTE: Actualizamos sus datos personales
                        pacienteExistente.setNombre(dto.getNombre());
                        pacienteExistente.setApellido(dto.getApellido());
                        pacienteExistente.setDni(dto.getDni());
                        pacienteExistente.setTelefono(dto.getTelefono());
                        pacienteExistente.setFechaNacimiento(dto.getFechaNacimiento());
                        pacienteRepo.save(pacienteExistente);
                    },
                    () -> {
                        // SI NO EXISTE: (Caso raro pero seguro) Creamos la fila
                        com.example.backend_clinica.entities.Paciente nuevoPaciente = new com.example.backend_clinica.entities.Paciente();
                        nuevoPaciente.setUsuarioId(usuarioId);
                        nuevoPaciente.setNombre(dto.getNombre());
                        nuevoPaciente.setApellido(dto.getApellido());
                        nuevoPaciente.setDni(dto.getDni());
                        nuevoPaciente.setTelefono(dto.getTelefono());
                        nuevoPaciente.setFechaNacimiento(dto.getFechaNacimiento());
                        pacienteRepo.save(nuevoPaciente);
                    }
                );
    }

    public java.util.Optional<com.example.backend_clinica.entities.Paciente> obtenerPorUsuarioId(Long usuarioId) {
        return pacienteRepo.findByUsuarioId(usuarioId);
    }
}
