package com.mundialscore.backend.controller;

import com.mundialscore.backend.dto.DataDtos.PronosticoRequest;
import com.mundialscore.backend.model.Pronostico;
import com.mundialscore.backend.service.PronosticoService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pronosticos")
public class PronosticoController {

    private final PronosticoService pronosticoService;

    public PronosticoController(PronosticoService pronosticoService) {
        this.pronosticoService = pronosticoService;
    }

    @PostMapping
    public ResponseEntity<Pronostico> crearPronostico(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PronosticoRequest request) {
        return ResponseEntity.ok(pronosticoService.crearPronostico(userDetails.getUsername(), request));
    }

    @GetMapping("/mis")
    public ResponseEntity<List<Pronostico>> misPronosticos(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(pronosticoService.obtenerMisPronosticos(userDetails.getUsername()));
    }
}
