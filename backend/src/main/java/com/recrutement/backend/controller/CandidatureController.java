package com.recrutement.backend.controller;

import com.recrutement.backend.model.Candidature;
import com.recrutement.backend.service.CandidatureService;
import com.recrutement.backend.service.JwtService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidatures")
public class CandidatureController {

    private final CandidatureService candidatureService;
    private final JwtService jwtService;

    public CandidatureController(CandidatureService candidatureService, JwtService jwtService) {
        this.candidatureService = candidatureService;
        this.jwtService = jwtService;
    }

    /**
     * Créer une candidature (avec upload de CV)
     * POST /api/candidatures
     */
    @PostMapping
    public ResponseEntity<?> createCandidature(
            @RequestParam("offreId") String offreId,
            @RequestParam("nom") String nom,
            @RequestParam("prenom") String prenom,
            @RequestParam("email") String email,
            @RequestParam("telephone") String telephone,
            @RequestParam(value = "lettreMotivation", required = false) String lettreMotivation,
            @RequestParam(value = "cv", required = false) MultipartFile cv
    ) {
        try {
            Candidature candidature = candidatureService.createCandidature(
                    offreId, nom, prenom, email, telephone, lettreMotivation, cv
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(candidature);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Obtenir toutes les candidatures
     * GET /api/candidatures
     */
    @GetMapping
    public ResponseEntity<List<Candidature>> getAllCandidatures() {
        List<Candidature> candidatures = candidatureService.getAllCandidatures();
        return ResponseEntity.ok(candidatures);
    }

    /**
     * Obtenir une candidature par ID
     * GET /api/candidatures/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCandidatureById(@PathVariable String id) {
        try {
            Candidature candidature = candidatureService.getCandidatureById(id);
            return ResponseEntity.ok(candidature);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les candidatures d'un candidat
     * GET /api/candidatures/candidat/{candidatId}
     */
    @GetMapping("/candidat/{candidatId}")
    public ResponseEntity<List<Candidature>> getCandidaturesByCandidat(@PathVariable String candidatId) {
        List<Candidature> candidatures = candidatureService.getCandidaturesByCandidat(candidatId);
        return ResponseEntity.ok(candidatures);
    }

    /**
     * Obtenir les candidatures d'une offre
     * GET /api/candidatures/offre/{offreId}
     */
    @GetMapping("/offre/{offreId}")
    public ResponseEntity<List<Candidature>> getCandidaturesByOffre(@PathVariable String offreId) {
        List<Candidature> candidatures = candidatureService.getCandidaturesByOffre(offreId);
        return ResponseEntity.ok(candidatures);
    }

    /**
     * Obtenir les candidatures par statut
     * GET /api/candidatures/statut/{statut}
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<?> getCandidaturesByStatut(@PathVariable String statut) {
        try {
            Candidature.StatutCandidature statutEnum = Candidature.StatutCandidature.valueOf(statut.toUpperCase());
            List<Candidature> candidatures = candidatureService.getCandidaturesByStatut(statutEnum);
            return ResponseEntity.ok(candidatures);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Statut invalide"));
        }
    }

    /**
     * Obtenir les candidatures avec pagination
     * GET /api/candidatures/paginated?page=0&size=10
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<Candidature>> getCandidaturesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Candidature> candidatures = candidatureService.getCandidaturesWithPagination(page, size);
        return ResponseEntity.ok(candidatures);
    }

    /**
     * Filtrer les candidatures
     * GET /api/candidatures/filter?offreId=...&statut=...&scoreMin=...
     */
    @GetMapping("/filter")
    public ResponseEntity<List<Candidature>> filterCandidatures(
            @RequestParam(required = false) String offreId,
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) Integer scoreMin
    ) {
        Candidature.StatutCandidature statutEnum = null;
        if (statut != null) {
            try {
                statutEnum = Candidature.StatutCandidature.valueOf(statut.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Ignorer statut invalide
            }
        }

        List<Candidature> candidatures = candidatureService.filterCandidatures(offreId, statutEnum, scoreMin);
        return ResponseEntity.ok(candidatures);
    }

    /**
     * Changer le statut d'une candidature
     * PATCH /api/candidatures/{id}/statut
     */
    @PatchMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(
            @PathVariable String id,
            @RequestParam String nouveauStatut,
            @RequestParam(required = false) String commentaire,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            Candidature.StatutCandidature statutEnum = Candidature.StatutCandidature.valueOf(nouveauStatut.toUpperCase());

            Candidature candidature = candidatureService.changerStatut(id, statutEnum, userId, commentaire);
            return ResponseEntity.ok(candidature);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Statut invalide"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Ajouter un commentaire
     * POST /api/candidatures/{id}/commentaires
     */
    @PostMapping("/{id}/commentaires")
    public ResponseEntity<?> ajouterCommentaire(
            @PathVariable String id,
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            String contenu = (String) request.get("contenu");
            boolean prive = request.get("prive") != null && (boolean) request.get("prive");

            Candidature candidature = candidatureService.ajouterCommentaire(id, userId, contenu, prive);
            return ResponseEntity.ok(candidature);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Supprimer une candidature
     * DELETE /api/candidatures/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCandidature(@PathVariable String id) {
        try {
            candidatureService.deleteCandidature(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Candidature supprimée avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les statistiques
     * GET /api/candidatures/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getStatistics() {
        Map<String, Long> stats = candidatureService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Obtenir les candidatures récentes
     * GET /api/candidatures/recent?limit=10
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Candidature>> getRecentCandidatures(
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<Candidature> candidatures = candidatureService.getRecentCandidatures(limit);
        return ResponseEntity.ok(candidatures);
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