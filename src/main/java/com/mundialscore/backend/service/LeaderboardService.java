package com.mundialscore.backend.service;

import com.mundialscore.backend.model.Usuario;
import com.mundialscore.backend.repository.UsuarioRepository;
import com.mundialscore.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaderboardService {

    private final UsuarioRepository usuarioRepository;

    public LeaderboardService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> obtenerLeaderboard() {
        return usuarioRepository.findAllByOrderByPuntosTotalesDesc();
    }
}
