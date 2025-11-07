package com.recrutement.backend.controller;

import com.recrutement.backend.model.Notification;
import com.recrutement.backend.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Email;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final EmailService emailService;

    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Obtenir toutes les notifications
     * GET /api/notifications
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = emailService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }

    /**
     * Obtenir les notifications récentes
     * GET /api/notifications/recent
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Notification>> getRecentNotifications() {
        List<Notification> notifications = emailService.getRecentNotifications();
        return ResponseEntity.ok(notifications);
    }

    /**
     * Obtenir les statistiques
     * GET /api/notifications/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getStatistics() {
        Map<String, Long> stats = emailService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Envoyer un email de test
     * POST /api/notifications/test
     */
    @PostMapping("/test")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String nom = request.get("nom");

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Email requis"));
            }

            emailService.sendSimpleEmail(
                    email,
                    "Test - Plateforme Recrutement",
                    "Bonjour " + (nom != null ? nom : "Utilisateur") + ",\n\n" +
                            "Ceci est un email de test de la plateforme de recrutement.\n\n" +
                            "Si vous recevez cet email, la configuration est correcte !\n\n" +
                            "Cordialement,\n" +
                            "L'équipe Recrutement"
            );

            Map<String, String> response = new HashMap<>();
            response.put("message", "Email de test envoyé avec succès à " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur lors de l'envoi: " + e.getMessage()));
        }
    }

    /**
     * Envoyer une notification de candidature reçue
     * POST /api/notifications/candidature-recue
     */
    @PostMapping("/candidature-recue")
    public ResponseEntity<?> sendCandidatureRecue(@RequestBody Map<String, String> request) {
        try {
            String candidatEmail = request.get("candidatEmail");
            String candidatNom = request.get("candidatNom");
            String offreTitre = request.get("offreTitre");
            String candidatureId = request.get("candidatureId");

            if (candidatEmail == null || candidatNom == null || offreTitre == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Paramètres manquants"));
            }

            Notification notification = emailService.envoyerNotificationCandidatureRecue(
                    candidatEmail,
                    candidatNom,
                    offreTitre,
                    candidatureId
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur: " + e.getMessage()));
        }
    }

    /**
     * Envoyer une invitation à un entretien
     * POST /api/notifications/invitation-entretien
     */
    @PostMapping("/invitation-entretien")
    public ResponseEntity<?> sendInvitationEntretien(@RequestBody Map<String, String> request) {
        try {
            String candidatEmail = request.get("candidatEmail");
            String candidatNom = request.get("candidatNom");
            String offreTitre = request.get("offreTitre");
            String typeEntretien = request.get("typeEntretien");
            String dateEntretien = request.get("dateEntretien");
            String heureEntretien = request.get("heureEntretien");
            String lieu = request.get("lieu");
            String lien = request.get("lien");
            String entretienId = request.get("entretienId");

            if (candidatEmail == null || candidatNom == null || offreTitre == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Paramètres manquants"));
            }

            Notification notification = emailService.envoyerInvitationEntretien(
                    candidatEmail,
                    candidatNom,
                    offreTitre,
                    typeEntretien,
                    dateEntretien,
                    heureEntretien,
                    lieu,
                    lien,
                    entretienId
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur: " + e.getMessage()));
        }
    }

    /**
     * Envoyer un rappel d'entretien
     * POST /api/notifications/rappel-entretien
     */
    @PostMapping("/rappel-entretien")
    public ResponseEntity<?> sendRappelEntretien(@RequestBody Map<String, String> request) {
        try {
            String candidatEmail = request.get("candidatEmail");
            String candidatNom = request.get("candidatNom");
            String offreTitre = request.get("offreTitre");
            String dateEntretien = request.get("dateEntretien");
            String heureEntretien = request.get("heureEntretien");
            String lieu = request.get("lieu");
            String entretienId = request.get("entretienId");

            Notification notification = emailService.envoyerRappelEntretien(
                    candidatEmail,
                    candidatNom,
                    offreTitre,
                    dateEntretien,
                    heureEntretien,
                    lieu,
                    entretienId
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur: " + e.getMessage()));
        }
    }

    /**
     * Envoyer une notification d'acceptation
     * POST /api/notifications/acceptation
     */
    @PostMapping("/acceptation")
    public ResponseEntity<?> sendNotificationAcceptation(@RequestBody Map<String, String> request) {
        try {
            String candidatEmail = request.get("candidatEmail");
            String candidatNom = request.get("candidatNom");
            String offreTitre = request.get("offreTitre");
            String candidatureId = request.get("candidatureId");

            Notification notification = emailService.envoyerNotificationAcceptation(
                    candidatEmail,
                    candidatNom,
                    offreTitre,
                    candidatureId
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur: " + e.getMessage()));
        }
    }

    // ==================== MÉTHODES UTILITAIRES ====================

    /**
     * Créer une réponse d'erreur
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}