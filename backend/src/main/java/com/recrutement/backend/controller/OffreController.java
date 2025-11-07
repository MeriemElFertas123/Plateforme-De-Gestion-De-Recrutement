package com.recrutement.backend.controller;

import com.recrutement.backend.dto.OffreRequest;
import com.recrutement.backend.dto.OffreResponse;
import com.recrutement.backend.model.Offre;
import com.recrutement.backend.service.JwtService;
import com.recrutement.backend.service.OffreService;
import javax.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/offres")
public class OffreController {

    private final OffreService offreService;
    private final JwtService jwtService;

    public OffreController(OffreService offreService, JwtService jwtService) {
        this.offreService = offreService;
        this.jwtService = jwtService;
    }

    /**
     * Créer une nouvelle offre
     * POST /api/offres
     */
    @PostMapping
    public ResponseEntity<?> createOffre(
            @Valid @RequestBody OffreRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            OffreResponse offre = offreService.createOffre(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(offre);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir toutes les offres
     * GET /api/offres
     */
    @GetMapping
    public ResponseEntity<List<OffreResponse>> getAllOffres() {
        List<OffreResponse> offres = offreService.getAllOffres();
        return ResponseEntity.ok(offres);
    }

    /**
     * Obtenir les offres avec pagination
     * GET /api/offres/paginated?page=0&size=10&sortBy=dateCreation
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<OffreResponse>> getOffresPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dateCreation") String sortBy
    ) {
        Page<OffreResponse> offres = offreService.getOffresWithPagination(page, size, sortBy);
        return ResponseEntity.ok(offres);
    }

    /**
     * Obtenir une offre par ID
     * GET /api/offres/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOffreById(@PathVariable String id) {
        try {
            OffreResponse offre = offreService.getOffreById(id);
            return ResponseEntity.ok(offre);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les offres par statut
     * GET /api/offres/statut/{statut}
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<OffreResponse>> getOffresByStatut(@PathVariable String statut) {
        try {
            Offre.StatutOffre statutOffre = Offre.StatutOffre.valueOf(statut.toUpperCase());
            List<OffreResponse> offres = offreService.getOffresByStatut(statutOffre);
            return ResponseEntity.ok(offres);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtenir les offres actives (publiées et non expirées)
     * GET /api/offres/actives
     */
    @GetMapping("/actives")
    public ResponseEntity<List<OffreResponse>> getOffresActives() {
        List<OffreResponse> offres = offreService.getOffresActives();
        return ResponseEntity.ok(offres);
    }

    /**
     * Obtenir mes offres (offres créées par l'utilisateur connecté)
     * GET /api/offres/mes-offres
     */
    @GetMapping("/mes-offres")
    public ResponseEntity<?> getMesOffres(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            List<OffreResponse> offres = offreService.getOffresByCreateur(userId);
            return ResponseEntity.ok(offres);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Rechercher des offres par mot-clé
     * GET /api/offres/search?keyword=java&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<Page<OffreResponse>> searchOffres(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<OffreResponse> offres = offreService.searchOffres(keyword, page, size);
        return ResponseEntity.ok(offres);
    }

    /**
     * Rechercher par compétences
     * POST /api/offres/search/competences
     * Body: ["Java", "React", "MongoDB"]
     */
    @PostMapping("/search/competences")
    public ResponseEntity<List<OffreResponse>> searchByCompetences(
            @RequestBody List<String> competences
    ) {
        List<OffreResponse> offres = offreService.searchByCompetences(competences);
        return ResponseEntity.ok(offres);
    }

    /**
     * Filtrer les offres
     * GET /api/offres/filter?statut=PUBLIEE&typeContrat=CDI&departement=IT&localisation=Paris
     */
    @GetMapping("/filter")
    public ResponseEntity<List<OffreResponse>> filterOffres(
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) String typeContrat,
            @RequestParam(required = false) String departement,
            @RequestParam(required = false) String localisation
    ) {
        Offre.StatutOffre statutOffre = statut != null ? Offre.StatutOffre.valueOf(statut.toUpperCase()) : null;
        Offre.TypeContrat typeContratOffre = typeContrat != null ? Offre.TypeContrat.valueOf(typeContrat.toUpperCase()) : null;

        List<OffreResponse> offres = offreService.filterOffres(
                statutOffre,
                typeContratOffre,
                departement,
                localisation
        );

        return ResponseEntity.ok(offres);
    }

    /**
     * Mettre à jour une offre
     * PUT /api/offres/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOffre(
            @PathVariable String id,
            @Valid @RequestBody OffreRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            OffreResponse offre = offreService.updateOffre(id, request, userId);
            return ResponseEntity.ok(offre);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Supprimer une offre
     * DELETE /api/offres/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffre(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            offreService.deleteOffre(id, userId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Offre supprimée avec succès");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Publier une offre (changer statut de BROUILLON à PUBLIEE)
     * PATCH /api/offres/{id}/publier
     */
    @PatchMapping("/{id}/publier")
    public ResponseEntity<?> publierOffre(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            OffreResponse offre = offreService.publierOffre(id, userId);
            return ResponseEntity.ok(offre);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Archiver une offre
     * PATCH /api/offres/{id}/archiver
     */
    @PatchMapping("/{id}/archiver")
    public ResponseEntity<?> archiverOffre(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            OffreResponse offre = offreService.archiverOffre(id, userId);
            return ResponseEntity.ok(offre);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Marquer une offre comme pourvue
     * PATCH /api/offres/{id}/pourvue
     */
    @PatchMapping("/{id}/pourvue")
    public ResponseEntity<?> marquerCommePourvue(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String userId = extractUserIdFromToken(authHeader);
            OffreResponse offre = offreService.marquerCommePourvue(id, userId);
            return ResponseEntity.ok(offre);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les statistiques d'une offre
     * GET /api/offres/{id}/stats
     */
    @GetMapping("/{id}/stats")
    public ResponseEntity<?> getOffreStats(@PathVariable String id) {
        try {
            Map<String, Object> stats = offreService.getOffreStats(id);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir le nombre d'offres par statut
     * GET /api/offres/statistics/count-by-statut
     */
    @GetMapping("/statistics/count-by-statut")
    public ResponseEntity<Map<String, Long>> getOffresCountByStatut() {
        Map<String, Long> counts = offreService.getOffresCountByStatut();
        return ResponseEntity.ok(counts);
    }

    /**
     * Vérifier et mettre à jour les offres expirées
     * POST /api/offres/check-expired
     */
    @PostMapping("/check-expired")
    public ResponseEntity<Map<String, String>> checkExpiredOffres() {
        offreService.checkExpiredOffres();

        Map<String, String> response = new HashMap<>();
        response.put("message", "Vérification des offres expirées effectuée");

        return ResponseEntity.ok(response);
    }

    // ==================== MÉTHODES UTILITAIRES ====================

    /**
     * Extraire l'ID utilisateur du token JWT
     */
    private String extractUserIdFromToken(String authHeader) {
        String token = authHeader.substring(7); // Enlever "Bearer "
        String email = jwtService.extractUsername(token);

        // Ici on pourrait extraire directement le userId du token
        // Pour l'instant on utilise l'email
        return jwtService.extractClaim(token, claims -> claims.get("userId", String.class));
    }

    /**
     * Créer une réponse d'erreur formatée
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}