package com.example.backend_clinica.controllers;

import com.example.backend_clinica.dto.LoginDTO;
import com.example.backend_clinica.dto.RegistroMedicoDTO;
import com.example.backend_clinica.entities.Usuario;
import com.example.backend_clinica.repositories.UsuarioRepository;
import com.example.backend_clinica.security.JwtUtil;
import com.example.backend_clinica.services.MedicoService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.backend_clinica.services.PacienteService;
import com.example.backend_clinica.dto.RegistroPacienteDTO;
import com.example.backend_clinica.dto.LoginResponseDTO;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200") // Recuerda dejarlo para que Angular pueda conectarse
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MedicoService medicoService;

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private JwtUtil jwtUtil;

    // 1. REGISTRO SIMPLE (Para Administradores)
    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            Usuario guardado = usuarioRepository.save(usuario);
            return ResponseEntity.ok("¡Usuario " + guardado.getUsername() + " guardado con éxito!");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El correo electrónico ya está registrado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocurrió un error inesperado.");
        }
    }

    // 2. REGISTRO COMPLEJO (Para Médicos - RF-01)
    @PostMapping("/registrar-medico")
    public ResponseEntity<?> registrarMedico(@RequestBody RegistroMedicoDTO medicoDTO) {
        try {
            medicoService.registrarMedicoCompleto(medicoDTO);
            return ResponseEntity.ok("Médico y Usuario creados correctamente.");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El correo o DNI ya existe en el sistema.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error en el registro del médico: " + e.getMessage());
        }
    }

    // 3. LOGIN CON TOKEN JWT MODIFICADO
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        return usuarioRepository.findByUsername(loginDTO.getUsername())
                .<ResponseEntity<?>>map(usuario -> { // 🚨 ¡AGREGAMOS EL GENÉRICO AQUÍ!
                    // 1. Verificar si la contraseña coincide con BCrypt
                    if (passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {

                        // 2. SI COINCIDE: Convertimos el rol_id a Long usando .longValue() para que
                        // JwtUtil lo acepte sin errores
                        Long rolIdLong = usuario.getRolId().longValue();

                        String tokenGenerado = jwtUtil.generarToken(usuario.getUsername(), rolIdLong);

                        // 3. Empaquetamos la respuesta en el nuevo DTO
                        LoginResponseDTO respuesta = new LoginResponseDTO(
                                tokenGenerado,
                                usuario.getUsername(),
                                rolIdLong);

                        // 4. Respondemos con un HTTP 200 (OK) y el token seguro
                        return ResponseEntity.ok(respuesta);

                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado"));
    }

    // 4. REGISTRO DE PACIENTES (RF-02)
    @PostMapping("/registrar-paciente")
    public ResponseEntity<String> registrarPaciente(@RequestBody RegistroPacienteDTO dto) {
        try {
            pacienteService.registrarPacienteCompleto(dto);
            return ResponseEntity.ok("Paciente registrado exitosamente en el sistema");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al registrar paciente: " + e.getMessage());
        }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> listarTodosLosUsuarios() {
        // repository.findAll() jala de forma automática todas las filas de la tabla
        // usuarios
        List<Usuario> lista = usuarioRepository.findAll();
        return ResponseEntity.ok(lista);
    }

    // A. OBTENER UN USUARIO POR ID (Carga dinámica de datos Médicos o Pacientes)
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .<ResponseEntity<?>>map(usuario -> {
                    com.example.backend_clinica.dto.PacienteEdicionDTO respuesta = new com.example.backend_clinica.dto.PacienteEdicionDTO();
                    respuesta.setUsername(usuario.getUsername());
                    respuesta.setRolId(usuario.getRolId()); // Asegúrate de tener rolId en el DTO si lo usas
                    respuesta.setActivo(usuario.isActivo());

                    // Si es Médico (Rol 2)
                    if (usuario.getRolId() == 2) {
                        medicoService.obtenerPorUsuarioId(id).ifPresent(medico -> {
                            respuesta.setNombre(medico.getNombre());
                            respuesta.setApellido(medico.getApellido());
                            respuesta.setDni(medico.getDni());
                            // Campos de médico prestados al DTO común o manejados de forma dinámica
                        });
                    }
                    // 🚨 SI ES PACIENTE (Rol 3): Jalamos los datos de la tabla pacientes
                    else if (usuario.getRolId() == 3) {
                        pacienteService.obtenerPorUsuarioId(id).ifPresent(paciente -> {
                            respuesta.setNombre(paciente.getNombre());
                            respuesta.setApellido(paciente.getApellido());
                            respuesta.setDni(paciente.getDni());
                            respuesta.setTelefono(paciente.getTelefono());
                            respuesta.setFechaNacimiento(paciente.getFechaNacimiento());
                        });
                    }
                    return ResponseEntity.ok(respuesta);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado"));
    }

    // B. ACTUALIZAR UN USUARIO EXISTENTE (Médico o Paciente)
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody com.example.backend_clinica.dto.PacienteEdicionDTO datosActualizados) {
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    try {
                        usuarioExistente.setUsername(datosActualizados.getUsername());
                        usuarioExistente.setActivo(datosActualizados.isActivo());
                        
                        if (datosActualizados.getPassword() != null && !datosActualizados.getPassword().trim().isEmpty()) {
                            usuarioExistente.setPassword(passwordEncoder.encode(datosActualizados.getPassword()));
                        }
                        usuarioRepository.save(usuarioExistente);

                        // Si es Médico (Rol 2)
                        if (usuarioExistente.getRolId() == 2) {
                            // Convertimos o adaptamos al DTO de médicos correspondiente
                            medicoService.actualizarDatosMedicos2(usuarioExistente.getUsuarioId(), datosActualizados);
                        } 
                        // 🚨 SI ES PACIENTE (Rol 3): Modificamos su perfil en Supabase
                        else if (usuarioExistente.getRolId() == 3) {
                            pacienteService.actualizarDatosPaciente(usuarioExistente.getUsuarioId(), datosActualizados);
                        }
                        
                        return ResponseEntity.ok("¡Registro actualizado con éxito!");
                        
                    } catch (DataIntegrityViolationException e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("El correo electrónico, DNI o Teléfono ya está registrado en el sistema.");
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Ocurrió un error inesperado al actualizar: " + e.getMessage());
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado"));
    }

    @GetMapping("/pacientes/lista-completa")
    public ResponseEntity<List<com.example.backend_clinica.dto.PacienteEdicionDTO>> listarPacientesCompletos() {
        List<Usuario> usuariosPacientes = usuarioRepository.findAll().stream()
                .filter(u -> u.getRolId() == 3)
                .toList();

        List<com.example.backend_clinica.dto.PacienteEdicionDTO> listaRespuesta = new java.util.ArrayList<>();

        for (Usuario u : usuariosPacientes) {
            com.example.backend_clinica.dto.PacienteEdicionDTO dto = new com.example.backend_clinica.dto.PacienteEdicionDTO();

            dto.setUsuarioId(u.getUsuarioId());
            dto.setUsername(u.getUsername());
            dto.setActivo(u.isActivo());
            // Inyectamos el ID temporalmente en una propiedad o manejamos una extensión del DTO
            
            pacienteService.obtenerPorUsuarioId(u.getUsuarioId()).ifPresent(p -> {
                dto.setNombre(p.getNombre());
                dto.setApellido(p.getApellido());
                dto.setDni(p.getDni());
                dto.setTelefono(p.getTelefono());
                dto.setFechaNacimiento(p.getFechaNacimiento());
            });
            listaRespuesta.add(dto);
        }
        return ResponseEntity.ok(listaRespuesta);
    }
}
