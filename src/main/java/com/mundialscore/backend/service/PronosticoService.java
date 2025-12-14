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
        Integer puntosViejos = 0;

        if (existing.isPresent()) {
            pronostico = existing.get();
            if (pronostico.getPuntosObtenidos() != null) {
                puntosViejos = pronostico.getPuntosObtenidos();
            }
            pronostico.setGolesLocalPronosticados(request.getGolesLocal());
            pronostico.setGolesVisitantePronosticados(request.getGolesVisitante());
        } else {
            pronostico = new Pronostico();
            pronostico.setUsuario(usuario);
            pronostico.setPartido(partido);
            pronostico.setGolesLocalPronosticados(request.getGolesLocal());
            pronostico.setGolesVisitantePronosticados(request.getGolesVisitante());
        }

        // Calculate points immediately if match has result
        if (partido.hasResult()) {
            int puntosNuevos = calcularPuntos(pronostico, partido);
            pronostico.setPuntosObtenidos(puntosNuevos);

            int diff = puntosNuevos - puntosViejos;
            if (diff != 0) {
                usuario.setPuntosTotales(usuario.getPuntosTotales() + diff);
                usuarioRepository.save(usuario);
            }
        }

        return pronosticoRepository.save(pronostico);
    }

    public List<Pronostico> obtenerMisPronosticos(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        return pronosticoRepository.findByUsuarioId(usuario.getId());
    }

    private int calcularPuntos(Pronostico p, Partido m) {
        if (!m.hasResult())
            return 0;

        int realL = m.getGolesLocal();
        int realV = m.getGolesVisitante();
        int predL = p.getGolesLocalPronosticados();
        int predV = p.getGolesVisitantePronosticados();

        // 1. Exacto
        if (realL == predL && realV == predV) {
            return 5;
        }

        // Determine winners (1: Local, 0: Draw, -1: Visitor)
        int realSign = Integer.signum(realL - realV);
        int predSign = Integer.signum(predL - predV);

        // 2. Ganador o Empate
        if (realSign == predSign) {
            return 3;
        }

        // 3. Goles de un solo equipo
        if (realL == predL || realV == predV) {
            return 1;
        }

        return 0;
    }
}
