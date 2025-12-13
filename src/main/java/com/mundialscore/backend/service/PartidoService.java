package com.mundialscore.backend.service;

import com.mundialscore.backend.dto.DataDtos.PartidoRequest;
import com.mundialscore.backend.dto.DataDtos.ResultadoRequest;
import com.mundialscore.backend.model.Partido;
import com.mundialscore.backend.model.Pronostico;
import com.mundialscore.backend.model.Usuario;
import com.mundialscore.backend.repository.PartidoRepository;
import com.mundialscore.backend.repository.PronosticoRepository;
import com.mundialscore.backend.repository.UsuarioRepository;
import com.mundialscore.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PartidoService {

    private final PartidoRepository partidoRepository;
    private final PronosticoRepository pronosticoRepository;
    private final UsuarioRepository usuarioRepository;

    public PartidoService(PartidoRepository partidoRepository,
            PronosticoRepository pronosticoRepository,
            UsuarioRepository usuarioRepository) {
        this.partidoRepository = partidoRepository;
        this.pronosticoRepository = pronosticoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Partido> obtenerTodos() {
        return partidoRepository.findAll();
    }

    public Partido crearPartido(PartidoRequest request) {
        Partido partido = new Partido();
        partido.setEquipoLocal(request.getEquipoLocal());
        partido.setEquipoVisitante(request.getEquipoVisitante());
        partido.setFechaHora(request.getFechaHora());
        partido.setEstadio(request.getEstadio());
        return partidoRepository.save(partido);
    }

    @Transactional
    public Partido registrarResultado(Long id, ResultadoRequest resultado) {
        Partido partido = partidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));
        partido.setGolesLocal(resultado.getGolesLocal());
        partido.setGolesVisitante(resultado.getGolesVisitante());
        Partido saved = partidoRepository.save(partido);

        recalcularPuntos(saved);
        return saved;
    }

    private void recalcularPuntos(Partido partido) {
        List<Pronostico> pronosticos = pronosticoRepository.findByPartidoId(partido.getId());

        for (Pronostico p : pronosticos) {
            int puntosViejos = p.getPuntosObtenidos() != null ? p.getPuntosObtenidos() : 0;
            int puntosNuevos = calcularPuntos(p, partido);

            p.setPuntosObtenidos(puntosNuevos);

            Usuario u = p.getUsuario();
            u.setPuntosTotales(u.getPuntosTotales() - puntosViejos + puntosNuevos);

            usuarioRepository.save(u);
            pronosticoRepository.save(p);
        }
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
