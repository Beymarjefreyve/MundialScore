package com.mundialscore.backend.controller;

import com.mundialscore.backend.model.Partido;
import com.mundialscore.backend.service.PartidoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/partidos")
public class PartidoController {

    private final PartidoService partidoService;

    public PartidoController(PartidoService partidoService) {
        this.partidoService = partidoService;
    }

    @GetMapping
    public ResponseEntity<List<Partido>> obtenerPartidos() {
        return ResponseEntity.ok(partidoService.obtenerTodos());
    }
}
