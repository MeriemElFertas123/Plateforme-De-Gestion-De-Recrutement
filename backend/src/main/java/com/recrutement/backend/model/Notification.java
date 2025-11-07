package com.recrutement.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    // Type de notification
    private TypeNotification type;

    // Destinataire
    @Indexed
    private String destinataireEmail;
    private String destinataireNom;

    // Sujet et contenu
    private String sujet;
    private String contenu;
    private String contenuHtml;

    // Statut d'envoi
    @Indexed
    private StatutNotification statut = StatutNotification.EN_ATTENTE;

    private String messageErreur;
    private int nombreTentatives = 0;

    // Dates
    @CreatedDate
    private LocalDateTime dateCreation;
    private LocalDateTime dateEnvoi;
    private LocalDateTime dateLecture;

    // Métadonnées
    private Map<String, Object> metadata = new HashMap<>();

    // Relations
    private String candidatureId;
    private String entretienId;
    private String offreId;

    // Enums
    public enum TypeNotification {
        CANDIDATURE_RECUE,              // Confirmation réception candidature
        CANDIDATURE_ACCEPTEE,           // Candidature acceptée
        CANDIDATURE_REFUSEE,            // Candidature refusée
        ENTRETIEN_PLANIFIE,            // Invitation entretien
        ENTRETIEN_RAPPEL,              // Rappel 24h avant
        ENTRETIEN_ANNULE,              // Entretien annulé
        ENTRETIEN_REPORTE,             // Entretien reporté
        OFFRE_EMPLOI,                  // Offre d'emploi
        BIENVENUE,                     // Email de bienvenue
        AUTRE
    }

    public enum StatutNotification {
        EN_ATTENTE,
        ENVOYE,
        ECHEC,
        LU
    }

    // Méthodes utilitaires
    public void marquerCommeEnvoye() {
        this.statut = StatutNotification.ENVOYE;
        this.dateEnvoi = LocalDateTime.now();
    }

    public void marquerCommeEchec(String erreur) {
        this.statut = StatutNotification.ECHEC;
        this.messageErreur = erreur;
        this.nombreTentatives++;
    }

    public void marquerCommeLu() {
        this.statut = StatutNotification.LU;
        this.dateLecture = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public TypeNotification getType() {
        return type;
    }

    public void setType(TypeNotification type) {
        this.type = type;
    }

    public String getDestinataireEmail() {
        return destinataireEmail;
    }

    public void setDestinataireEmail(String destinataireEmail) {
        this.destinataireEmail = destinataireEmail;
    }

    public String getDestinataireNom() {
        return destinataireNom;
    }

    public void setDestinataireNom(String destinataireNom) {
        this.destinataireNom = destinataireNom;
    }

    public String getSujet() {
        return sujet;
    }

    public void setSujet(String sujet) {
        this.sujet = sujet;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public String getContenuHtml() {
        return contenuHtml;
    }

    public void setContenuHtml(String contenuHtml) {
        this.contenuHtml = contenuHtml;
    }

    public StatutNotification getStatut() {
        return statut;
    }

    public void setStatut(StatutNotification statut) {
        this.statut = statut;
    }

    public String getMessageErreur() {
        return messageErreur;
    }

    public void setMessageErreur(String messageErreur) {
        this.messageErreur = messageErreur;
    }

    public int getNombreTentatives() {
        return nombreTentatives;
    }

    public void setNombreTentatives(int nombreTentatives) {
        this.nombreTentatives = nombreTentatives;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(LocalDateTime dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public LocalDateTime getDateLecture() {
        return dateLecture;
    }

    public void setDateLecture(LocalDateTime dateLecture) {
        this.dateLecture = dateLecture;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public String getCandidatureId() {
        return candidatureId;
    }

    public void setCandidatureId(String candidatureId) {
        this.candidatureId = candidatureId;
    }

    public String getEntretienId() {
        return entretienId;
    }

    public void setEntretienId(String entretienId) {
        this.entretienId = entretienId;
    }

    public String getOffreId() {
        return offreId;
    }

    public void setOffreId(String offreId) {
        this.offreId = offreId;
    }

}