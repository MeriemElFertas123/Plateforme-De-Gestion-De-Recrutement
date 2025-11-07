package com.recrutement.backend.service;

import com.recrutement.backend.model.Entretien;
import com.recrutement.backend.model.Candidature;
import com.recrutement.backend.model.User;
import com.recrutement.backend.repository.EntretienRepository;
import com.recrutement.backend.repository.CandidatureRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EntretienService {

    private final EntretienRepository entretienRepository;
    private final CandidatureRepository candidatureRepository;
    private final UserService userService;
    private final EmailService emailService;
    public EntretienService(
            EntretienRepository entretienRepository,
            CandidatureRepository candidatureRepository,
            UserService userService, EmailService emailService) {
        this.entretienRepository = entretienRepository;
        this.candidatureRepository = candidatureRepository;
        this.userService = userService;
        this.emailService = emailService;
    }

    /**
     * Créer un entretien
     */
    public Entretien createEntretien(Entretien entretien, String createurId) {
        // Charger les informations de la candidature
        if (entretien.getCandidatureId() != null) {
            Candidature candidature = candidatureRepository.findById(entretien.getCandidatureId())
                    .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

            entretien.setCandidatId(candidature.getCandidatId());
            entretien.setOffreId(candidature.getOffreId());
            entretien.setCandidatNom(candidature.getCandidatNom());
            entretien.setCandidatPrenom(candidature.getCandidatPrenom());
            entretien.setCandidatEmail(candidature.getCandidatEmail());
            entretien.setOffreTitre(candidature.getOffreTitre());
        }

        // Informations du créateur
        User createur = userService.findById(createurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        entretien.setCreateurId(createurId);
        entretien.setCreateurNom(createur.getNomComplet());

        // Calculer la date de fin si pas fournie
        entretien.calculerDateFin();

        // Statut par défaut
        if (entretien.getStatut() == null) {
            entretien.setStatut(Entretien.StatutEntretien.PLANIFIE);
        }

        Entretien savedEntretien = entretienRepository.save(entretien);

// 📧 ENVOYER EMAIL D'INVITATION AUTOMATIQUEMENT
        try {
            // Formater la date et l'heure
            String dateFormatee = savedEntretien.getDateDebut().toLocalDate()
                    .format(java.time.format.DateTimeFormatter.ofPattern("EEEE d MMMM yyyy", java.util.Locale.FRENCH));
            String heureFormatee = savedEntretien.getDateDebut().toLocalTime()
                    .format(java.time.format.DateTimeFormatter.ofPattern("HH'h'mm"));

            emailService.envoyerInvitationEntretien(
                    savedEntretien.getCandidatEmail(),
                    savedEntretien.getCandidatNom() + " " + savedEntretien.getCandidatPrenom(),
                    savedEntretien.getOffreTitre(),
                    savedEntretien.getType().name(),
                    dateFormatee,
                    heureFormatee,
                    savedEntretien.getLieu(),
                    savedEntretien.getTypeLieu() == Entretien.TypeLieu.VISIO ? savedEntretien.getLieu() : null,
                    savedEntretien.getId()
            );
        } catch (Exception e) {
            System.err.println("Erreur envoi email entretien: " + e.getMessage());
        }

        return savedEntretien;
    }

    /**
     * Obtenir tous les entretiens
     */
    public List<Entretien> getAllEntretiens() {
        return entretienRepository.findAll(Sort.by(Sort.Direction.ASC, "dateDebut"));
    }

    /**
     * Obtenir un entretien par ID
     */
    public Entretien getEntretienById(String id) {
        return entretienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entretien non trouvé"));
    }

    /**
     * Mettre à jour un entretien
     */
    public Entretien updateEntretien(String id, Entretien entretienUpdate) {
        Entretien entretien = getEntretienById(id);

        // Mise à jour des champs
        if (entretienUpdate.getTitre() != null) entretien.setTitre(entretienUpdate.getTitre());
        if (entretienUpdate.getDescription() != null) entretien.setDescription(entretienUpdate.getDescription());
        if (entretienUpdate.getType() != null) entretien.setType(entretienUpdate.getType());
        if (entretienUpdate.getDateDebut() != null) entretien.setDateDebut(entretienUpdate.getDateDebut());
        if (entretienUpdate.getDureeMinutes() != null) entretien.setDureeMinutes(entretienUpdate.getDureeMinutes());
        if (entretienUpdate.getTypeLieu() != null) entretien.setTypeLieu(entretienUpdate.getTypeLieu());
        if (entretienUpdate.getLieu() != null) entretien.setLieu(entretienUpdate.getLieu());
        if (entretienUpdate.getSalle() != null) entretien.setSalle(entretienUpdate.getSalle());
        if (entretienUpdate.getStatut() != null) entretien.setStatut(entretienUpdate.getStatut());

        // Recalculer la date de fin
        entretien.calculerDateFin();

        return entretienRepository.save(entretien);
    }

    /**
     * Supprimer un entretien
     */
    public void deleteEntretien(String id) {
        entretienRepository.deleteById(id);
    }

    /**
     * Obtenir les entretiens d'une candidature
     */
    public List<Entretien> getEntretiensByCandidature(String candidatureId) {
        return entretienRepository.findByCandidatureId(candidatureId);
    }

    /**
     * Obtenir les entretiens par statut
     */
    public List<Entretien> getEntretiensByStatut(Entretien.StatutEntretien statut) {
        return entretienRepository.findByStatut(statut);
    }

    /**
     * Obtenir les entretiens d'aujourd'hui
     */
    public List<Entretien> getEntretiensAujourdhui() {
        LocalDateTime debutJournee = LocalDate.now().atStartOfDay();
        LocalDateTime finJournee = LocalDate.now().atTime(LocalTime.MAX);
        return entretienRepository.findEntretiensAujourdhui(debutJournee, finJournee);
    }

    /**
     * Obtenir les entretiens à venir
     */
    public List<Entretien> getEntretiensAVenir() {
        return entretienRepository.findEntretiensAVenir(LocalDateTime.now());
    }

    /**
     * Obtenir les entretiens passés
     */
    public List<Entretien> getEntretiensPasses() {
        return entretienRepository.findEntretiensPasses(LocalDateTime.now());
    }

    /**
     * Obtenir les entretiens d'un interviewer
     */
    public List<Entretien> getEntretiensByInterviewer(String interviewerId) {
        return entretienRepository.findByInterviewerId(interviewerId);
    }

    /**
     * Obtenir les entretiens avec pagination
     */
    public Page<Entretien> getEntretiensWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "dateDebut"));
        return entretienRepository.findAll(pageable);
    }

    /**
     * Changer le statut d'un entretien
     */
    public Entretien changerStatut(String id, Entretien.StatutEntretien nouveauStatut) {
        Entretien entretien = getEntretienById(id);
        entretien.setStatut(nouveauStatut);
        return entretienRepository.save(entretien);
    }

    /**
     * Ajouter une évaluation
     */
    public Entretien ajouterEvaluation(String id, Entretien.Evaluation evaluation) {
        Entretien entretien = getEntretienById(id);

        if (entretien.getEvaluationsDetaillees() == null) {
            entretien.setEvaluationsDetaillees(new java.util.ArrayList<>());
        }

        entretien.getEvaluationsDetaillees().add(evaluation);

        // Mettre à jour la note globale (moyenne)
        double moyenne = entretien.getNoteMoyenne();
        entretien.setEvaluationGlobale((int) Math.round(moyenne));

        return entretienRepository.save(entretien);
    }

    /**
     * Obtenir les statistiques
     */
    public Map<String, Long> getStatistics() {
        Map<String, Long> stats = new HashMap<>();

        for (Entretien.StatutEntretien statut : Entretien.StatutEntretien.values()) {
            long count = entretienRepository.countByStatut(statut);
            stats.put(statut.name(), count);
        }

        stats.put("TOTAL", entretienRepository.count());
        stats.put("AUJOURDHUI", (long) getEntretiensAujourdhui().size());
        stats.put("A_VENIR", (long) getEntretiensAVenir().size());

        return stats;
    }

    /**
     * Obtenir les entretiens par période
     */
    public List<Entretien> getEntretiensByPeriode(LocalDateTime debut, LocalDateTime fin) {
        return entretienRepository.findByDateDebutBetween(debut, fin);
    }
    /**
     * Obtenir les entretiens d'un candidat
     */
    public List<Entretien> getEntretiensByCandidat(String candidatId) {
        return entretienRepository.findByCandidatId(candidatId);
    }
}