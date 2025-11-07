package com.recrutement.backend.repository;

import com.recrutement.backend.model.Candidature;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CandidatureRepository extends MongoRepository<Candidature, String> {

    // Recherche par candidat
    List<Candidature> findByCandidatId(String candidatId);

    Page<Candidature> findByCandidatId(String candidatId, Pageable pageable);

    // Recherche par offre
    List<Candidature> findByOffreId(String offreId);

    Page<Candidature> findByOffreId(String offreId, Pageable pageable);

    // Recherche par statut
    List<Candidature> findByStatut(Candidature.StatutCandidature statut);

    Page<Candidature> findByStatut(Candidature.StatutCandidature statut, Pageable pageable);

    // Recherche par offre et statut
    List<Candidature> findByOffreIdAndStatut(String offreId, Candidature.StatutCandidature statut);

    // Vérifier si candidat a déjà postulé à une offre
    boolean existsByCandidatIdAndOffreId(String candidatId, String offreId);

    // Compter par offre
    long countByOffreId(String offreId);

    // Compter par statut
    long countByStatut(Candidature.StatutCandidature statut);

    // Candidatures récentes
    List<Candidature> findTop10ByOrderByDatePostulationDesc();

    // Candidatures par score
    @Query("{ 'scoreMatching': { $gte: ?0 } }")
    List<Candidature> findByScoreGreaterThan(int score);

    // Candidatures par date
    List<Candidature> findByDatePostulationBetween(LocalDateTime debut, LocalDateTime fin);
}