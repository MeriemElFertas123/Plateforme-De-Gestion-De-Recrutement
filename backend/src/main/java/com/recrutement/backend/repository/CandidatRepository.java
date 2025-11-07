package com.recrutement.backend.repository;

import com.recrutement.backend.model.Candidat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidatRepository extends MongoRepository<Candidat, String> {

    // Recherche par email
    Optional<Candidat> findByEmail(String email);

    boolean existsByEmail(String email);

    // Recherche par nom
    List<Candidat> findByNomContainingIgnoreCase(String nom);

    // Recherche par statut
    List<Candidat> findByStatut(Candidat.StatutCandidat statut);

    Page<Candidat> findByStatut(Candidat.StatutCandidat statut, Pageable pageable);

    // Recherche par compétences
    @Query("{ 'competences': { $in: ?0 } }")
    List<Candidat> findByCompetencesIn(List<String> competences);

    // Recherche par ville
    List<Candidat> findByVille(String ville);

    // Recherche textuelle globale
    @Query("{ $or: [ " +
            "{ 'nom': { $regex: ?0, $options: 'i' } }, " +
            "{ 'prenom': { $regex: ?0, $options: 'i' } }, " +
            "{ 'email': { $regex: ?0, $options: 'i' } }, " +
            "{ 'titre': { $regex: ?0, $options: 'i' } }, " +
            "{ 'competences': { $regex: ?0, $options: 'i' } } " +
            "] }")
    Page<Candidat> searchCandidats(String keyword, Pageable pageable);

    // Compter par statut
    long countByStatut(Candidat.StatutCandidat statut);
}