package com.recrutement.backend.service;

import com.recrutement.backend.model.Candidat;
import com.recrutement.backend.model.Candidature;
import com.recrutement.backend.model.Offre;
import com.recrutement.backend.model.User;
import com.recrutement.backend.repository.CandidatRepository;
import com.recrutement.backend.repository.CandidatureRepository;
import com.recrutement.backend.repository.OffreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final CandidatRepository candidatRepository;
    private final OffreRepository offreRepository;
    private final CVParserService cvParserService;
    private final UserService userService;
    private final EmailService emailService;

    public CandidatureService(
            CandidatureRepository candidatureRepository,
            CandidatRepository candidatRepository,
            OffreRepository offreRepository,
            CVParserService cvParserService,
            UserService userService, EmailService emailService) {
        this.candidatureRepository = candidatureRepository;
        this.candidatRepository = candidatRepository;
        this.offreRepository = offreRepository;
        this.cvParserService = cvParserService;
        this.userService = userService;
        this.emailService = emailService;
    }

    /**
     * Créer une candidature avec parsing de CV
     */
    public Candidature createCandidature(
            String offreId,
            String nom,
            String prenom,
            String email,
            String telephone,
            String lettreMotivation,
            MultipartFile cv
    ) throws IOException {

        // Vérifier que l'offre existe
        Offre offre = offreRepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        // Vérifier si le candidat existe déjà
        Candidat candidat = candidatRepository.findByEmail(email).orElse(null);

        if (candidat == null) {
            // Créer nouveau candidat
            candidat = new Candidat();
            candidat.setNom(nom);
            candidat.setPrenom(prenom);
            candidat.setEmail(email);
            candidat.setTelephone(telephone);

            // Parser le CV si fourni
            if (cv != null && !cv.isEmpty()) {
                Map<String, Object> cvData = cvParserService.parseCV(cv);

                // Enrichir les données du candidat
                if (cvData.get("competences") != null) {
                    candidat.setCompetences((List<String>) cvData.get("competences"));
                }

                // Sauvegarder le nom du fichier
                candidat.setCvFileName(cv.getOriginalFilename());
                // TODO: Sauvegarder le fichier sur le système de fichiers ou S3
                candidat.setCvUrl("/uploads/" + cv.getOriginalFilename());
            }

            candidat = candidatRepository.save(candidat);
        } else {
            // Vérifier si déjà postulé à cette offre
            if (candidatureRepository.existsByCandidatIdAndOffreId(candidat.getId(), offreId)) {
                throw new RuntimeException("Vous avez déjà postulé à cette offre");
            }
        }

        // Créer la candidature
        Candidature candidature = new Candidature();
        candidature.setCandidatId(candidat.getId());
        candidature.setOffreId(offre.getId());
        candidature.setCandidatNom(candidat.getNom());
        candidature.setCandidatPrenom(candidat.getPrenom());
        candidature.setCandidatEmail(candidat.getEmail());
        candidature.setOffreTitre(offre.getTitre());
        candidature.setLettreMotivation(lettreMotivation);
        candidature.setStatut(Candidature.StatutCandidature.NOUVEAU);
        candidature.setSource(Candidature.SourceCandidature.SITE_CARRIERE);

        // Calculer le score de matching
        int score = cvParserService.calculateMatchingScore(
                candidat.getCompetences(),
                offre.getCompetencesRequises()
        );
        candidature.setScoreMatching(score);

        // Initialiser l'historique
        candidature.changerStatut(
                Candidature.StatutCandidature.NOUVEAU,
                "system",
                "Système",
                "Candidature soumise"
        );

        Candidature savedCandidature = candidatureRepository.save(candidature);

// Incrémenter le compteur de candidatures de l'offre
        offre.incrementCandidatures();
        offreRepository.save(offre);

// 📧 ENVOYER EMAIL DE CONFIRMATION AUTOMATIQUEMENT
        try {
            emailService.envoyerNotificationCandidatureRecue(
                    candidat.getEmail(),
                    candidat.getNomComplet(),
                    offre.getTitre(),
                    savedCandidature.getId()
            );
        } catch (Exception e) {
            // Ne pas bloquer la création de candidature si l'email échoue
            System.err.println("Erreur envoi email: " + e.getMessage());
        }

        return savedCandidature;
    }

    /**
     * Obtenir toutes les candidatures
     */
    public List<Candidature> getAllCandidatures() {
        return candidatureRepository.findAll(Sort.by(Sort.Direction.DESC, "datePostulation"));
    }

    /**
     * Obtenir une candidature par ID
     */
    public Candidature getCandidatureById(String id) {
        return candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));
    }

    /**
     * Obtenir les candidatures d'une offre
     */
    public List<Candidature> getCandidaturesByOffre(String offreId) {
        return candidatureRepository.findByOffreId(offreId);
    }

    /**
     * Obtenir les candidatures par statut
     */
    public List<Candidature> getCandidaturesByStatut(Candidature.StatutCandidature statut) {
        return candidatureRepository.findByStatut(statut);
    }

    /**
     * Obtenir les candidatures avec pagination
     */
    public Page<Candidature> getCandidaturesWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "datePostulation"));
        return candidatureRepository.findAll(pageable);
    }

    /**
     * Changer le statut d'une candidature
     */
    public Candidature changerStatut(
            String candidatureId,
            Candidature.StatutCandidature nouveauStatut,
            String userId,
            String commentaire
    ) {
        Candidature candidature = getCandidatureById(candidatureId);

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        candidature.changerStatut(nouveauStatut, userId, user.getNomComplet(), commentaire);

        return candidatureRepository.save(candidature);
    }
    /**
     * Changer le statut d'une candidature avec envoi d'email si acceptée
     */
    public Candidature changerStatutAvecNotification(
            String candidatureId,
            Candidature.StatutCandidature nouveauStatut,
            String userId,
            String commentaire
    ) {
        Candidature candidature = getCandidatureById(candidatureId);

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Candidature.StatutCandidature ancienStatut = candidature.getStatut();
        candidature.changerStatut(nouveauStatut, userId, user.getNomComplet(), commentaire);

        Candidature savedCandidature = candidatureRepository.save(candidature);

        // 📧 ENVOYER EMAIL SI ACCEPTÉ
        if (nouveauStatut == Candidature.StatutCandidature.ACCEPTE &&
                ancienStatut != Candidature.StatutCandidature.ACCEPTE) {
            try {
                emailService.envoyerNotificationAcceptation(
                        candidature.getCandidatEmail(),
                        candidature.getCandidatPrenom() + " " + candidature.getCandidatNom(),
                        candidature.getOffreTitre(),
                        candidature.getId()
                );
            } catch (Exception e) {
                System.err.println("Erreur envoi email acceptation: " + e.getMessage());
            }
        }

        return savedCandidature;
    }

    /**
     * Ajouter un commentaire
     */
    public Candidature ajouterCommentaire(
            String candidatureId,
            String userId,
            String contenu,
            boolean prive
    ) {
        Candidature candidature = getCandidatureById(candidatureId);

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        candidature.ajouterCommentaire(userId, user.getNomComplet(), contenu, prive);

        return candidatureRepository.save(candidature);
    }

    /**
     * Supprimer une candidature
     */
    public void deleteCandidature(String id) {
        Candidature candidature = getCandidatureById(id);

        // Décrémenter le compteur de l'offre
        Offre offre = offreRepository.findById(candidature.getOffreId()).orElse(null);
        if (offre != null) {
            offre.setNombreCandidatures(Math.max(0, offre.getNombreCandidatures() - 1));
            offreRepository.save(offre);
        }

        candidatureRepository.deleteById(id);
    }

    /**
     * Obtenir les statistiques des candidatures
     */
    public Map<String, Long> getStatistics() {
        Map<String, Long> stats = new java.util.HashMap<>();

        for (Candidature.StatutCandidature statut : Candidature.StatutCandidature.values()) {
            long count = candidatureRepository.countByStatut(statut);
            stats.put(statut.name(), count);
        }

        stats.put("TOTAL", candidatureRepository.count());

        return stats;
    }

    /**
     * Obtenir les candidatures récentes
     */
    public List<Candidature> getRecentCandidatures(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "datePostulation"));
        return candidatureRepository.findAll(pageable).getContent();
    }

    /**
     * Filtrer les candidatures
     */
    public List<Candidature> filterCandidatures(
            String offreId,
            Candidature.StatutCandidature statut,
            Integer scoreMin
    ) {
        List<Candidature> candidatures;

        if (offreId != null && !offreId.isEmpty()) {
            if (statut != null) {
                candidatures = candidatureRepository.findByOffreIdAndStatut(offreId, statut);
            } else {
                candidatures = candidatureRepository.findByOffreId(offreId);
            }
        } else if (statut != null) {
            candidatures = candidatureRepository.findByStatut(statut);
        } else {
            candidatures = candidatureRepository.findAll();
        }

        // Filtrer par score si spécifié
        if (scoreMin != null) {
            candidatures = candidatures.stream()
                    .filter(c -> c.getScoreMatching() >= scoreMin)
                    .toList();
        }

        return candidatures;
    }

    /**
     * Obtenir les candidatures d'un candidat spécifique
     */
    public List<Candidature> getCandidaturesByCandidat(String candidatId) {
        return candidatureRepository.findByCandidatId(candidatId);
    }
}