package com.recrutement.backend.repository;

import com.recrutement.backend.model.Entretien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EntretienRepository extends MongoRepository<Entretien, String> {

    // Recherche par candidature
    List<Entretien> findByCandidatureId(String candidatureId);

    // Recherche par candidat
    List<Entretien> findByCandidatId(String candidatId);

    Page<Entretien> findByCandidatId(String candidatId, Pageable pageable);

    // Recherche par offre
    List<Entretien> findByOffreId(String offreId);

    // Recherche par statut
    List<Entretien> findByStatut(Entretien.StatutEntretien statut);

    Page<Entretien> findByStatut(Entretien.StatutEntretien statut, Pageable pageable);

    // Recherche par type
    List<Entretien> findByType(Entretien.TypeEntretien type);

    // Recherche par date
    List<Entretien> findByDateDebutBetween(LocalDateTime debut, LocalDateTime fin);

    // Entretiens d'aujourd'hui
    @Query("{ 'dateDebut': { $gte: ?0, $lt: ?1 } }")
    List<Entretien> findEntretiensAujourdhui(LocalDateTime debutJournee, LocalDateTime finJournee);

    // Entretiens à venir
    @Query("{ 'dateDebut': { $gte: ?0 }, 'statut': { $in: ['PLANIFIE', 'CONFIRME'] } }")
    List<Entretien> findEntretiensAVenir(LocalDateTime maintenant);

    // Entretiens passés
    @Query("{ 'dateDebut': { $lt: ?0 } }")
    List<Entretien> findEntretiensPasses(LocalDateTime maintenant);

    // Entretiens par interviewer
    @Query("{ 'interviewersIds': ?0 }")
    List<Entretien> findByInterviewerId(String interviewerId);

    // Compter par statut
    long countByStatut(Entretien.StatutEntretien statut);

    // Compter par candidature
    long countByCandidatureId(String candidatureId);
}