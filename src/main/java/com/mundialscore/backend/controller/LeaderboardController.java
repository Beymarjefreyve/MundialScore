package com.mundialscore.backend.controller;

import com.mundialscore.backend.model.Usuario;
import com.mundialscore.backend.service.LeaderboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.obtenerLeaderboard());
    }
}
