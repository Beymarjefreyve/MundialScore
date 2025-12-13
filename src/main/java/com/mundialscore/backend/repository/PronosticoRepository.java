package com.mundialscore.backend.repository;

import com.mundialscore.backend.model.Pronostico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PronosticoRepository extends JpaRepository<Pronostico, Long> {
    List<Pronostico> findByUsuarioId(Long usuarioId);

    List<Pronostico> findByPartidoId(Long partidoId);
}
