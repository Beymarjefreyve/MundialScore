package com.mundialscore.backend.config;

import com.mundialscore.backend.model.Rol;
import com.mundialscore.backend.model.Usuario;
import com.mundialscore.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Crear usuario admin por defecto si no existe
        String adminEmail = "admin@gmail.com";

        if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("1234"));
            admin.setRol(Rol.ADMIN);
            admin.setPuntosTotales(0);

            usuarioRepository.save(admin);
            System.out.println("✅ Usuario admin creado: admin@gmail.com / 1234");
        } else {
            System.out.println("ℹ️ Usuario admin ya existe");
        }
    }
}
