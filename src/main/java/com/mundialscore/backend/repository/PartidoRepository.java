package com.mundialscore.backend.repository;

import com.mundialscore.backend.model.Partido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartidoRepository extends JpaRepository<Partido, Long> {
}
