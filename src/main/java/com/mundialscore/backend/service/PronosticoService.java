package com.mundialscore.backend.service;

import com.mundialscore.backend.dto.DataDtos.PronosticoRequest;
import com.mundialscore.backend.model.Partido;
import com.mundialscore.backend.model.Pronostico;
import com.mundialscore.backend.model.Usuario;
import com.mundialscore.backend.repository.PartidoRepository;
import com.mundialscore.backend.repository.PronosticoRepository;
import com.mundialscore.backend.repository.UsuarioRepository;
import com.mundialscore.backend.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PronosticoService {

    private final PronosticoRepository pronosticoRepository;
    private final PartidoRepository partidoRepository;
    private final UsuarioRepository usuarioRepository;

    public PronosticoService(PronosticoRepository pronosticoRepository,
            PartidoRepository partidoRepository,
            UsuarioRepository usuarioRepository) {
        this.pronosticoRepository = pronosticoRepository;
        this.partidoRepository = partidoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Pronostico crearPronostico(String email, PronosticoRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        Partido partido = partidoRepository.findById(request.getPartidoId())
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        var existing = pronosticoRepository.findByUsuarioId(usuario.getId()).stream()
                .filter(p -> p.getPartido().getId().equals(partido.getId()))
                .findFirst();

        Pronostico pronostico;

        if (existing.isPresent()) {
            pronostico = existing.get();
            pronostico.setGolesLocalPronosticados(request.getGolesLocal());
            pronostico.setGolesVisitantePronosticados(request.getGolesVisitante());
        } else {
            pronostico = new Pronostico();
            pronostico.setUsuario(usuario);
            pronostico.setPartido(partido);
            pronostico.setGolesLocalPronosticados(request.getGolesLocal());
            pronostico.setGolesVisitantePronosticados(request.getGolesVisitante());
        }

        // Block if match finished
        if (partido.hasResult()) {
            throw new RuntimeException("El partido ya ha finalizado, no se pueden hacer pronósticos.");
        }

        // Block if match started
        if (partido.getFechaHora().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("El partido ya ha comenzado, no se pueden hacer pronósticos.");
        }

        return pronosticoRepository.save(pronostico);
    }

    public List<Pronostico> obtenerMisPronosticos(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        return pronosticoRepository.findByUsuarioId(usuario.getId());
    }

}
