package com.example.backend_clinica.services;

import com.example.backend_clinica.dto.PacienteEdicionDTO;
import com.example.backend_clinica.dto.RegistroMedicoDTO;
import com.example.backend_clinica.dto.UsuarioEdicionDTO; // <-- Importamos tu nuevo DTO
import com.example.backend_clinica.entities.Medico;
import com.example.backend_clinica.entities.Usuario;
import com.example.backend_clinica.repositories.MedicoRepository;
import com.example.backend_clinica.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MedicoService {

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private MedicoRepository medicoRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional // CRUCIAL: Si falla el médico, se borra el usuario (todo o nada)
    public void registrarMedicoCompleto(RegistroMedicoDTO dto) {
        // 1. Creamos el Usuario (la cuenta de acceso)
        Usuario usuario = new Usuario();
        // 🚨 SEGURO CONTRA NULOS: Si Angular manda username lo usamos, si manda email, usamos email.
        if (dto.getUsername() != null && !dto.getUsername().isEmpty()) {
            usuario.setUsername(dto.getUsername());
        } else {
            usuario.setUsername(dto.getEmail());
        }
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRolId(2); // Rol 2 = Médico
        usuario.setActivo(true);
        
        // Guardamos y recuperamos el usuario con su ID generado
        Usuario usuarioGuardado = usuarioRepo.save(usuario);

        // 2. Creamos el Médico (el perfil profesional)
        Medico medico = new Medico();
        medico.setNombre(dto.getNombre());
        medico.setApellido(dto.getApellido());
        medico.setDni(dto.getDni());
        medico.setCmp(dto.getCmp());
        medico.setEspecialidadId(dto.getEspecialidadId());
        
        // AMARRE: Usamos el ID del usuario que acabamos de guardar
        medico.setUsuarioId(usuarioGuardado.getUsuarioId());

        medicoRepo.save(medico);
    }

    // 🚨 NUEVO MÉTODO: ACTUALIZAR O CREAR PERFIL MÉDICO EN LA EDICIÓN
    @Transactional
    public void actualizarDatosMedicos(Long usuarioId, UsuarioEdicionDTO dto) {
        medicoRepo.findByUsuarioId(usuarioId)
                .ifPresentOrElse(
                    medicoExistente -> {
                        // 1. ACTUALIZACIÓN COMPLETA (Ahora incluye nombre y apellido)
                        medicoExistente.setNombre(dto.getNombre());
                        medicoExistente.setApellido(dto.getApellido());
                        medicoExistente.setDni(dto.getDni());
                        medicoExistente.setCmp(dto.getCmp());
                        medicoExistente.setEspecialidadId(dto.getEspecialidadId()); 
                        medicoRepo.save(medicoExistente);
                    },
                    () -> {
                        // 2. CREACIÓN (Por si acaso, aunque ya bloqueamos el rol)
                        Medico nuevoMedico = new Medico();
                        nuevoMedico.setUsuarioId(usuarioId);
                        nuevoMedico.setNombre(dto.getNombre());
                        nuevoMedico.setApellido(dto.getApellido());
                        nuevoMedico.setDni(dto.getDni());
                        nuevoMedico.setCmp(dto.getCmp());
                        nuevoMedico.setEspecialidadId(dto.getEspecialidadId()); 
                        medicoRepo.save(nuevoMedico);
                    }
                );
    }

//este es un metodo de emergencia ya q no pude editar los datos del usuario(medico)
    @Transactional
public void actualizarDatosMedicos2(Long usuarioId, PacienteEdicionDTO dto) {
    medicoRepo.findByUsuarioId(usuarioId).ifPresent(medicoExistente -> {
        // Solo actualizamos los datos básicos que vienen desde la vista de "Editar Usuario"
        if (dto.getNombre() != null) medicoExistente.setNombre(dto.getNombre());
        if (dto.getApellido() != null) medicoExistente.setApellido(dto.getApellido());
        if (dto.getDni() != null) medicoExistente.setDni(dto.getDni());
        
        medicoRepo.save(medicoExistente);
    });
}


    public java.util.Optional<Medico> obtenerPorUsuarioId(Long usuarioId) {
        return medicoRepo.findByUsuarioId(usuarioId);
    }
}