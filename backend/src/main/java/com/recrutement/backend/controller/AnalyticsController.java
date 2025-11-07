package com.recrutement.backend.controller;

import com.recrutement.backend.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * Tableau de bord global
     * GET /api/analytics/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Évolution des candidatures par mois
     * GET /api/analytics/evolution-candidatures
     */
    @GetMapping("/evolution-candidatures")
    public ResponseEntity<List<Map<String, Object>>> getEvolutionCandidatures() {
        List<Map<String, Object>> evolution = analyticsService.getEvolutionCandidatures();
        return ResponseEntity.ok(evolution);
    }

    /**
     * Répartition des candidatures par statut
     * GET /api/analytics/repartition-statut
     */
    @GetMapping("/repartition-statut")
    public ResponseEntity<List<Map<String, Object>>> getRepartitionParStatut() {
        List<Map<String, Object>> repartition = analyticsService.getRepartitionParStatut();
        return ResponseEntity.ok(repartition);
    }

    /**
     * Top 5 offres
     * GET /api/analytics/top-offres
     */
    @GetMapping("/top-offres")
    public ResponseEntity<List<Map<String, Object>>> getTopOffres() {
        List<Map<String, Object>> topOffres = analyticsService.getTopOffres();
        return ResponseEntity.ok(topOffres);
    }

    /**
     * Répartition des entretiens par type
     * GET /api/analytics/repartition-entretiens
     */
    @GetMapping("/repartition-entretiens")
    public ResponseEntity<List<Map<String, Object>>> getRepartitionEntretiens() {
        List<Map<String, Object>> repartition = analyticsService.getRepartitionEntretiens();
        return ResponseEntity.ok(repartition);
    }

    /**
     * Sources des candidatures
     * GET /api/analytics/sources-candidatures
     */
    @GetMapping("/sources-candidatures")
    public ResponseEntity<List<Map<String, Object>>> getSourcesCandidatures() {
        List<Map<String, Object>> sources = analyticsService.getSourcesCandidatures();
        return ResponseEntity.ok(sources);
    }

    /**
     * Distribution des scores de matching
     * GET /api/analytics/distribution-scores
     */
    @GetMapping("/distribution-scores")
    public ResponseEntity<Map<String, Long>> getDistributionScores() {
        Map<String, Long> distribution = analyticsService.getDistributionScores();
        return ResponseEntity.ok(distribution);
    }

    /**
     * Statistiques des entretiens
     * GET /api/analytics/stats-entretiens
     */
    @GetMapping("/stats-entretiens")
    public ResponseEntity<Map<String, Object>> getStatsEntretiens() {
        Map<String, Object> stats = analyticsService.getStatsEntretiens();
        return ResponseEntity.ok(stats);
    }

    /**
     * Performance par recruteur
     * GET /api/analytics/performance-recruteurs
     */
    @GetMapping("/performance-recruteurs")
    public ResponseEntity<List<Map<String, Object>>> getPerformanceRecruteurs() {
        List<Map<String, Object>> performance = analyticsService.getPerformanceRecruteurs();
        return ResponseEntity.ok(performance);
    }

    /**
     * Activité récente
     * GET /api/analytics/activite-recente?limit=10
     */
    @GetMapping("/activite-recente")
    public ResponseEntity<List<Map<String, Object>>> getActiviteRecente(
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<Map<String, Object>> activites = analyticsService.getActiviteRecente(limit);
        return ResponseEntity.ok(activites);
    }
}