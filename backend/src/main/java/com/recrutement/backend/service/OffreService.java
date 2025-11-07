package com.recrutement.backend.service;

import com.recrutement.backend.dto.OffreRequest;
import com.recrutement.backend.dto.OffreResponse;
import com.recrutement.backend.model.Offre;
import com.recrutement.backend.model.User;
import com.recrutement.backend.repository.OffreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OffreService {

    private final OffreRepository offreRepository;
    private final UserService userService;

    // Constructeur
    public OffreService(OffreRepository offreRepository, UserService userService) {
        this.offreRepository = offreRepository;
        this.userService = userService;
    }

    /**
     * Créer une nouvelle offre
     */
    public OffreResponse createOffre(OffreRequest request, String userId) {
        // Récupérer l'utilisateur créateur
        User createur = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Créer l'entité Offre
        Offre offre = new Offre();
        mapRequestToOffre(request, offre);

        // Générer une référence unique
        offre.setReference(generateReference());

        // Définir le créateur
        offre.setCreateurId(createur.getId());
        offre.setCreateurNom(createur.getNomComplet());

        // Statut par défaut : BROUILLON
        offre.setStatut(Offre.StatutOffre.BROUILLON);

        // Sauvegarder
        Offre savedOffre = offreRepository.save(offre);

        return new OffreResponse(savedOffre);
    }

    /**
     * Obtenir une offre par ID
     */
    public OffreResponse getOffreById(String id) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        // Incrémenter le nombre de vues
        offre.incrementVues();
        offreRepository.save(offre);

        return new OffreResponse(offre);
    }

    /**
     * Obtenir toutes les offres
     */
    public List<OffreResponse> getAllOffres() {
        return offreRepository.findAll()
                .stream()
                .map(OffreResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtenir les offres avec pagination
     */
    public Page<OffreResponse> getOffresWithPagination(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        return offreRepository.findAll(pageable)
                .map(OffreResponse::new);
    }

    /**
     * Obtenir les offres par statut
     */
    public List<OffreResponse> getOffresByStatut(Offre.StatutOffre statut) {
        return offreRepository.findByStatut(statut)
                .stream()
                .map(OffreResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtenir les offres par créateur
     */
    public List<OffreResponse> getOffresByCreateur(String createurId) {
        return offreRepository.findByCreateurId(createurId)
                .stream()
                .map(OffreResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtenir les offres actives (publiées et non expirées)
     */
    public List<OffreResponse> getOffresActives() {
        return offreRepository.findActiveOffres(LocalDateTime.now())
                .stream()
                .map(OffreResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Rechercher des offres par mot-clé
     */
    public Page<OffreResponse> searchOffres(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateCreation"));
        return offreRepository.searchOffres(keyword, pageable)
                .map(OffreResponse::new);
    }

    /**
     * Rechercher par compétences
     */
    public List<OffreResponse> searchByCompetences(List<String> competences) {
        return offreRepository.findByCompetencesIn(competences)
                .stream()
                .map(OffreResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Filtrer les offres
     */
    public List<OffreResponse> filterOffres(
            Offre.StatutOffre statut,
            Offre.TypeContrat typeContrat,
            String departement,
            String localisation
    ) {
        List<Offre> offres = offreRepository.findAll();

        // Filtrer par statut
        if (statut != null) {
            offres = offres.stream()
                    .filter(o -> o.getStatut() == statut)
                    .collect(Collectors.toList());
        }

        // Filtrer par type de contrat
        if (typeContrat != null) {
            offres = offres.stream()
                    .filter(o -> o.getTypeContrat() == typeContrat)
                    .collect(Collectors.toList());
        }

        // Filtrer par département
        if (departement != null && !departement.isEmpty()) {
            offres = offres.stream()
                    .filter(o -> departement.equals(o.getDepartement()))
                    .collect(Collectors.toList());
        }

        // Filtrer par localisation
        if (localisation != null && !localisation.isEmpty()) {
            offres = offres.stream()
                    .filter(o -> localisation.equals(o.getLocalisation()))
                    .collect(Collectors.toList());
        }

        return offres.stream()
                .map(OffreResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Mettre à jour une offre
     */
    public OffreResponse updateOffre(String id, OffreRequest request, String userId) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        // Vérifier que l'utilisateur est le créateur
        if (!offre.getCreateurId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette offre");
        }

        // Mettre à jour les champs
        mapRequestToOffre(request, offre);

        // Sauvegarder
        Offre updatedOffre = offreRepository.save(offre);

        return new OffreResponse(updatedOffre);
    }

    /**
     * Supprimer une offre
     */
    public void deleteOffre(String id, String userId) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        // Vérifier que l'utilisateur est le créateur ou admin
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!offre.getCreateurId().equals(userId) && user.getRole() != User.Role.RECRUTEUR) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer cette offre");
        }

        offreRepository.deleteById(id);
    }

    /**
     * Publier une offre (changer statut de BROUILLON à PUBLIEE)
     */
    public OffreResponse publierOffre(String id, String userId) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        // Vérifier que l'utilisateur est le créateur
        if (!offre.getCreateurId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à publier cette offre");
        }

        // Valider que l'offre est complète
        if (offre.getTitre() == null || offre.getDescription() == null) {
            throw new RuntimeException("L'offre doit avoir un titre et une description");
        }

        // Changer le statut
        offre.setStatut(Offre.StatutOffre.PUBLIEE);
        offre.setDatePublication(LocalDateTime.now());

        // Si pas de date d'expiration, définir 3 mois par défaut
        if (offre.getDateExpiration() == null) {
            offre.setDateExpiration(LocalDateTime.now().plusMonths(3));
        }

        Offre publishedOffre = offreRepository.save(offre);

        return new OffreResponse(publishedOffre);
    }

    /**
     * Archiver une offre
     */
    public OffreResponse archiverOffre(String id, String userId) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        if (!offre.getCreateurId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à archiver cette offre");
        }

        offre.setStatut(Offre.StatutOffre.ARCHIVEE);
        Offre archivedOffre = offreRepository.save(offre);

        return new OffreResponse(archivedOffre);
    }

    /**
     * Marquer une offre comme pourvue
     */
    public OffreResponse marquerCommePourvue(String id, String userId) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        if (!offre.getCreateurId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette offre");
        }

        offre.setStatut(Offre.StatutOffre.POURVUE);
        Offre pourvueOffre = offreRepository.save(offre);

        return new OffreResponse(pourvueOffre);
    }

    /**
     * Vérifier et mettre à jour les offres expirées
     */
    public void checkExpiredOffres() {
        List<Offre> expiredOffres = offreRepository.findExpiredOffres(LocalDateTime.now());

        for (Offre offre : expiredOffres) {
            offre.setStatut(Offre.StatutOffre.EXPIREE);
            offreRepository.save(offre);
        }
    }

    /**
     * Obtenir les statistiques d'une offre
     */
    public Map<String, Object> getOffreStats(String id) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("nombreVues", offre.getNombreVues());
        stats.put("nombreCandidatures", offre.getNombreCandidatures());
        stats.put("tauxConversion", calculateTauxConversion(offre));
        stats.put("joursPublies", calculateJoursPublies(offre));

        return stats;
    }

    /**
     * Obtenir le nombre total d'offres par statut
     */
    public Map<String, Long> getOffresCountByStatut() {
        Map<String, Long> counts = new HashMap<>();

        for (Offre.StatutOffre statut : Offre.StatutOffre.values()) {
            long count = offreRepository.countByStatut(statut);
            counts.put(statut.name(), count);
        }

        return counts;
    }

    // ==================== MÉTHODES PRIVÉES ====================

    /**
     * Mapper OffreRequest vers Offre
     */
    private void mapRequestToOffre(OffreRequest request, Offre offre) {
        offre.setTitre(request.getTitre());
        offre.setDescription(request.getDescription());
        offre.setReference(request.getReference());
        offre.setCompetencesRequises(request.getCompetencesRequises());
        offre.setCompetencesSouhaitees(request.getCompetencesSouhaitees());
        offre.setLocalisation(request.getLocalisation());
        offre.setTypeContrat(request.getTypeContrat());
        offre.setDepartement(request.getDepartement());
        offre.setExperienceRequise(request.getExperienceRequise());
        offre.setNiveauEtudesRequis(request.getNiveauEtudesRequis());
        offre.setSalaireMin(request.getSalaireMin());
        offre.setSalaireMax(request.getSalaireMax());
        offre.setDateExpiration(request.getDateExpiration());
        offre.setEtapesRecrutement(request.getEtapesRecrutement());
        offre.setTeletravailPossible(request.isTeletravailPossible());
        offre.setAvantages(request.getAvantages());
    }

    /**
     * Générer une référence unique pour l'offre
     */
    private String generateReference() {
        String year = String.valueOf(LocalDateTime.now().getYear());
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "REF-" + year + "-" + uuid;
    }

    /**
     * Calculer le taux de conversion (candidatures / vues)
     */
    private double calculateTauxConversion(Offre offre) {
        if (offre.getNombreVues() == 0) {
            return 0.0;
        }
        return (double) offre.getNombreCandidatures() / offre.getNombreVues() * 100;
    }

    /**
     * Calculer le nombre de jours depuis la publication
     */
    private long calculateJoursPublies(Offre offre) {
        if (offre.getDatePublication() == null) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(
                offre.getDatePublication(),
                LocalDateTime.now()
        );
    }
}