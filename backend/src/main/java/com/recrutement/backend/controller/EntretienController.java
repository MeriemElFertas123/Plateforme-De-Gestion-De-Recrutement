package com.recrutement.backend.controller;

import com.recrutement.backend.model.Entretien;
import com.recrutement.backend.service.EntretienService;
import com.recrutement.backend.service.JwtService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/entretiens")
public class EntretienController {

    private final EntretienService entretienService;
    private final JwtService jwtService;

    public EntretienController(EntretienService entretienService, JwtService jwtService) {
        this.entretienService = entretienService;
        this.jwtService = jwtService;
    }

    /**
     * Créer un entretien
     * POST /api/entretiens
     */
    @PostMapping
    public ResponseEntity<?> createEntretien(
            @RequestBody Entretien entretien,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            Entretien created = entretienService.createEntretien(entretien, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir tous les entretiens
     * GET /api/entretiens
     */
    @GetMapping
    public ResponseEntity<List<Entretien>> getAllEntretiens() {
        List<Entretien> entretiens = entretienService.getAllEntretiens();
        return ResponseEntity.ok(entretiens);
    }
    /**
    /**
     * Obtenir un entretien par ID
     * GET /api/entretiens/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getEntretienById(@PathVariable String id) {
        try {
            Entretien entretien = entretienService.getEntretienById(id);
            return ResponseEntity.ok(entretien);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Mettre à jour un entretien
     * PUT /api/entretiens/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEntretien(
            @PathVariable String id,
            @RequestBody Entretien entretien
    ) {
        try {
            Entretien updated = entretienService.updateEntretien(id, entretien);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Supprimer un entretien
     * DELETE /api/entretiens/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntretien(@PathVariable String id) {
        try {
            entretienService.deleteEntretien(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Entretien supprimé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les entretiens d'une candidature
     * GET /api/entretiens/candidature/{candidatureId}
     */
    @GetMapping("/candidature/{candidatureId}")
    public ResponseEntity<List<Entretien>> getEntretiensByCandidature(@PathVariable String candidatureId) {
        List<Entretien> entretiens = entretienService.getEntretiensByCandidature(candidatureId);
        return ResponseEntity.ok(entretiens);
    }

    /**
     * Obtenir les entretiens d'un candidat
     * GET /api/entretiens/candidat/{candidatId}
     */
    @GetMapping("/candidat/{candidatId}")
    public ResponseEntity<List<Entretien>> getEntretiensByCandidat(@PathVariable String candidatId) {
        List<Entretien> entretiens = entretienService.getEntretiensByCandidat(candidatId);
        return ResponseEntity.ok(entretiens);
    }

    /**
     * Obtenir les entretiens par statut
     * GET /api/entretiens/statut/{statut}
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<?> getEntretiensByStatut(@PathVariable String statut) {
        try {
            Entretien.StatutEntretien statutEnum = Entretien.StatutEntretien.valueOf(statut.toUpperCase());
            List<Entretien> entretiens = entretienService.getEntretiensByStatut(statutEnum);
            return ResponseEntity.ok(entretiens);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Statut invalide"));
        }
    }

    /**
     * Obtenir les entretiens d'aujourd'hui
     * GET /api/entretiens/aujourdhui
     */
    @GetMapping("/aujourdhui")
    public ResponseEntity<List<Entretien>> getEntretiensAujourdhui() {
        List<Entretien> entretiens = entretienService.getEntretiensAujourdhui();
        return ResponseEntity.ok(entretiens);
    }

    /**
     * Obtenir les entretiens à venir
     * GET /api/entretiens/a-venir
     */
    @GetMapping("/a-venir")
    public ResponseEntity<List<Entretien>> getEntretiensAVenir() {
        List<Entretien> entretiens = entretienService.getEntretiensAVenir();
        return ResponseEntity.ok(entretiens);
    }

    /**
     * Obtenir les entretiens passés
     * GET /api/entretiens/passes
     */
    @GetMapping("/passes")
    public ResponseEntity<List<Entretien>> getEntretiensPasses() {
        List<Entretien> entretiens = entretienService.getEntretiensPasses();
        return ResponseEntity.ok(entretiens);
    }

    /**
     * Obtenir les entretiens d'un interviewer
     * GET /api/entretiens/interviewer/{interviewerId}
     */
    @GetMapping("/interviewer/{interviewerId}")
    public ResponseEntity<List<Entretien>> getEntretiensByInterviewer(@PathVariable String interviewerId) {
        List<Entretien> entretiens = entretienService.getEntretiensByInterviewer(interviewerId);
        return ResponseEntity.ok(entretiens);
    }

    /**
     * Obtenir les entretiens avec pagination
     * GET /api/entretiens/paginated?page=0&size=10
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<Entretien>> getEntretiensPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Entretien> entretiens = entretienService.getEntretiensWithPagination(page, size);
        return ResponseEntity.ok(entretiens);
    }

    /**
     * Obtenir les entretiens par période
     * GET /api/entretiens/periode?debut=2025-01-01T00:00:00&fin=2025-01-31T23:59:59
     */
    @GetMapping("/periode")
    public ResponseEntity<?> getEntretiensByPeriode(
            @RequestParam String debut,
            @RequestParam String fin
    ) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime dateDebut = LocalDateTime.parse(debut, formatter);
            LocalDateTime dateFin = LocalDateTime.parse(fin, formatter);

            List<Entretien> entretiens = entretienService.getEntretiensByPeriode(dateDebut, dateFin);
            return ResponseEntity.ok(entretiens);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Format de date invalide. Utilisez: yyyy-MM-ddTHH:mm:ss"));
        }
    }

    /**
     * Changer le statut d'un entretien
     * PATCH /api/entretiens/{id}/statut?nouveauStatut=CONFIRME
     */
    @PatchMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(
            @PathVariable String id,
            @RequestParam String nouveauStatut
    ) {
        try {
            Entretien.StatutEntretien statutEnum = Entretien.StatutEntretien.valueOf(nouveauStatut.toUpperCase());
            Entretien entretien = entretienService.changerStatut(id, statutEnum);
            return ResponseEntity.ok(entretien);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Statut invalide"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Ajouter une évaluation
     * POST /api/entretiens/{id}/evaluations
     */
    @PostMapping("/{id}/evaluations")
    public ResponseEntity<?> ajouterEvaluation(
            @PathVariable String id,
            @RequestBody Entretien.Evaluation evaluation
    ) {
        try {
            Entretien entretien = entretienService.ajouterEvaluation(id, evaluation);
            return ResponseEntity.ok(entretien);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les statistiques
     * GET /api/entretiens/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getStatistics() {
        Map<String, Long> stats = entretienService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    // ==================== MÉTHODES UTILITAIRES ====================

    /**
     * Extraire l'ID utilisateur du token JWT
     */
    private String extractUserIdFromToken(String authHeader) {
        String token = authHeader.substring(7);
        return jwtService.extractClaim(token, claims -> claims.get("userId", String.class));
    }

    /**
     * Créer une réponse d'erreur
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
