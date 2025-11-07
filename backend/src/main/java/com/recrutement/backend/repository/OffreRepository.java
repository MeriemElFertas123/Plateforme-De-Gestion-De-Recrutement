package com.recrutement.backend.repository;

import com.recrutement.backend.model.Offre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OffreRepository extends MongoRepository<Offre, String> {

    // Recherche par statut
    List<Offre> findByStatut(Offre.StatutOffre statut);

    Page<Offre> findByStatut(Offre.StatutOffre statut, Pageable pageable);

    // Recherche par créateur
    List<Offre> findByCreateurId(String createurId);

    Page<Offre> findByCreateurId(String createurId, Pageable pageable);

    // Recherche par département
    List<Offre> findByDepartement(String departement);

    Page<Offre> findByDepartement(String departement, Pageable pageable);

    // Recherche par type de contrat
    List<Offre> findByTypeContrat(Offre.TypeContrat typeContrat);

    // Recherche par localisation
    List<Offre> findByLocalisation(String localisation);

    // Recherche par titre (contient)
    @Query("{ 'titre': { $regex: ?0, $options: 'i' } }")
    List<Offre> findByTitreContaining(String keyword);

    // Recherche par compétences
    @Query("{ 'competencesRequises': { $in: ?0 } }")
    List<Offre> findByCompetencesIn(List<String> competences);

    // Offres actives (publiées et non expirées)
    @Query("{ 'statut': 'PUBLIEE', $or: [ { 'dateExpiration': null }, { 'dateExpiration': { $gt: ?0 } } ] }")
    List<Offre> findActiveOffres(LocalDateTime now);

    // Offres expirées
    @Query("{ 'statut': 'PUBLIEE', 'dateExpiration': { $lt: ?0 } }")
    List<Offre> findExpiredOffres(LocalDateTime now);

    // Compter par statut
    long countByStatut(Offre.StatutOffre statut);

    // Compter par créateur
    long countByCreateurId(String createurId);

    // Recherche avancée avec pagination
    @Query("{ $or: [ " +
            "{ 'titre': { $regex: ?0, $options: 'i' } }, " +
            "{ 'description': { $regex: ?0, $options: 'i' } }, " +
            "{ 'competencesRequises': { $regex: ?0, $options: 'i' } } " +
            "] }")
    Page<Offre> searchOffres(String keyword, Pageable pageable);

    // Vérifier si une référence existe déjà
    boolean existsByReference(String reference);
}