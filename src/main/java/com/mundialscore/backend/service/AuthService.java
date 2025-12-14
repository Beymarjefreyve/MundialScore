package com.mundialscore.backend.service;

import com.mundialscore.backend.dto.AuthDtos.AuthResponse;
import com.mundialscore.backend.dto.AuthDtos.LoginRequest;
import com.mundialscore.backend.dto.AuthDtos.RegisterRequest;
import com.mundialscore.backend.dto.AuthDtos.UserInfo;
import com.mundialscore.backend.exception.EmailAlreadyExistsException;
import com.mundialscore.backend.model.Rol;
import com.mundialscore.backend.model.Usuario;
import com.mundialscore.backend.repository.UsuarioRepository;
import com.mundialscore.backend.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        // Check for existing email
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("El email ya está registrado");
        }

        Usuario user = new Usuario();
        user.setNombre(request.getNombre());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRol(Rol.USER); // Todos los usuarios registrados tienen rol USER
        user.setPuntosTotales(0);

        usuarioRepository.save(user);
        var jwtToken = jwtService.generateToken(user);

        UserInfo userInfo = new UserInfo(user.getId(), user.getNombre(), user.getEmail(), user.getRol().name());
        return new AuthResponse(jwtToken, userInfo);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);

        UserInfo userInfo = new UserInfo(user.getId(), user.getNombre(), user.getEmail(), user.getRol().name());
        return new AuthResponse(jwtToken, userInfo);
    }
}
