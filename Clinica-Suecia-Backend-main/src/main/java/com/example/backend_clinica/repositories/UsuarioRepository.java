package com.example.backend_clinica.repositories;

import com.example.backend_clinica.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Aquí Spring Boot hará toda la magia de las consultas
    Optional<Usuario> findByUsername(String username);
}