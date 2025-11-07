package com.recrutement.backend.repository;

import com.recrutement.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Recherche par destinataire
    List<Notification> findByDestinataireEmail(String email);

    // Recherche par statut
    List<Notification> findByStatut(Notification.StatutNotification statut);

    // Recherche par type
    List<Notification> findByType(Notification.TypeNotification type);

    // Notifications en attente (à envoyer)
    List<Notification> findByStatutOrderByDateCreationAsc(Notification.StatutNotification statut);

    // Notifications récentes
    List<Notification> findTop20ByOrderByDateCreationDesc();

    // Recherche par candidature
    List<Notification> findByCandidatureId(String candidatureId);

    // Recherche par entretien
    List<Notification> findByEntretienId(String entretienId);

    // Compter par statut
    long countByStatut(Notification.StatutNotification statut);

    // Notifications entre deux dates
    List<Notification> findByDateCreationBetween(LocalDateTime debut, LocalDateTime fin);
}