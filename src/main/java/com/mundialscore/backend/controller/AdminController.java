package com.mundialscore.backend.controller;

import com.mundialscore.backend.dto.DataDtos.PartidoRequest;
import com.mundialscore.backend.dto.DataDtos.ResultadoRequest;
import com.mundialscore.backend.model.Partido;
import com.mundialscore.backend.service.PartidoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/partidos")
public class AdminController {

    private final PartidoService partidoService;

    public AdminController(PartidoService partidoService) {
        this.partidoService = partidoService;
    }

    @PostMapping
    public ResponseEntity<Partido> crearPartido(@RequestBody PartidoRequest request) {
        return ResponseEntity.ok(partidoService.crearPartido(request));
    }

    @PutMapping("/{id}/resultado")
    public ResponseEntity<Partido> registrarResultado(
            @PathVariable Long id,
            @RequestBody ResultadoRequest request) {
        return ResponseEntity.ok(partidoService.registrarResultado(id, request));
    }
}
