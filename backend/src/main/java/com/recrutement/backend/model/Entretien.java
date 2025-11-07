package com.recrutement.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "entretiens")
public class Entretien {

    @Id
    private String id;

    // Relations
    @Indexed
    private String candidatureId;

    @Indexed
    private String candidatId;

    @Indexed
    private String offreId;

    // Informations dénormalisées (pour performance)
    private String candidatNom;
    private String candidatPrenom;
    private String candidatEmail;
    private String offreTitre;

    // Type d'entretien
    private TypeEntretien type = TypeEntretien.ENTRETIEN_RH;

    // Titre et description
    private String titre;
    private String description;

    // Date et durée
    @Indexed
    private LocalDateTime dateDebut;

    private LocalDateTime dateFin;

    private Integer dureeMinutes = 60;

    // Lieu
    private TypeLieu typeLieu = TypeLieu.PRESENTIEL;
    private String lieu; // Adresse physique ou lien visio
    private String salle;

    // Participants
    private List<Participant> participants = new ArrayList<>();

    // Interviewers (recruteurs)
    private List<String> interviewersIds = new ArrayList<>();
    private List<String> interviewersNoms = new ArrayList<>();

    // Statut
    @Indexed
    private StatutEntretien statut = StatutEntretien.PLANIFIE;

    // Notes et évaluation
    private String notesAvant; // Notes préparatoires
    private String notesPendant; // Notes prises pendant l'entretien
    private String notesApres; // Compte-rendu final

    private Integer evaluationGlobale; // Note sur 5
    private List<Evaluation> evaluationsDetaillees = new ArrayList<>();

    // Recommandation
    private RecommandationFinale recommandation;
    private String raisonRecommandation;

    // Documents
    private String lienDocuments; // Lien vers dossier partagé
    private List<String> documentIds = new ArrayList<>();

    // Rappels
    private boolean rappelEnvoye = false;
    private LocalDateTime dateRappel;

    // Métadonnées
    @CreatedDate
    private LocalDateTime dateCreation;

    @LastModifiedDate
    private LocalDateTime dateModification;

    private String createurId;
    private String createurNom;

    // Classes internes
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Participant {
        private String userId;
        private String nom;
        private String email;
        private RoleParticipant role;
        private boolean confirmationRecue = false;
        private LocalDateTime dateConfirmation;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Evaluation {
        private String critere; // Ex: "Compétences techniques"
        private Integer note; // Sur 5
        private String commentaire;

        public String getCritere() {
            return critere;
        }

        public void setCritere(String critere) {
            this.critere = critere;
        }

        public Integer getNote() {
            return note;
        }

        public void setNote(Integer note) {
            this.note = note;
        }

        public String getCommentaire() {
            return commentaire;
        }

        public void setCommentaire(String commentaire) {
            this.commentaire = commentaire;
        }
    }

    // Enums
    public enum TypeEntretien {
        ENTRETIEN_RH,
        ENTRETIEN_TECHNIQUE,
        ENTRETIEN_MANAGER,
        ENTRETIEN_FINAL,
        TEST_TECHNIQUE,
        ASSESSMENT_CENTER,
        AUTRE
    }

    public enum TypeLieu {
        PRESENTIEL,
        VISIO,
        TELEPHONIQUE
    }

    public enum StatutEntretien {
        PLANIFIE,           // Créé et planifié
        CONFIRME,           // Confirmé par toutes les parties
        EN_COURS,           // En cours de réalisation
        TERMINE,            // Terminé, en attente d'évaluation
        EVALUE,             // Évalué et noté
        ANNULE,             // Annulé
        REPORTE             // Reporté à une autre date
    }

    public enum RoleParticipant {
        CANDIDAT,
        OBSERVATEUR,
        ORGANISATEUR
    }

    public enum RecommandationFinale {
        FORTEMENT_RECOMMANDE,
        RECOMMANDE,
        MITIGE,
        NON_RECOMMANDE,
        A_REVOIR
    }

    // Méthodes utilitaires
    public boolean estPasse() {
        return dateDebut != null && dateDebut.isBefore(LocalDateTime.now());
    }

    public boolean estAujourdhui() {
        if (dateDebut == null) return false;
        LocalDateTime now = LocalDateTime.now();
        return dateDebut.toLocalDate().equals(now.toLocalDate());
    }

    public boolean estDansLesProchaines24h() {
        if (dateDebut == null) return false;
        LocalDateTime dans24h = LocalDateTime.now().plusHours(24);
        return dateDebut.isAfter(LocalDateTime.now()) && dateDebut.isBefore(dans24h);
    }

    public long getMinutesAvantDebut() {
        if (dateDebut == null) return 0;
        return java.time.Duration.between(LocalDateTime.now(), dateDebut).toMinutes();
    }

    public void calculerDateFin() {
        if (dateDebut != null && dureeMinutes != null) {
            this.dateFin = dateDebut.plusMinutes(dureeMinutes);
        }
    }

    public double getNoteMoyenne() {
        if (evaluationsDetaillees == null || evaluationsDetaillees.isEmpty()) {
            return 0.0;
        }
        return evaluationsDetaillees.stream()
                .mapToInt(Evaluation::getNote)
                .average()
                .orElse(0.0);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCandidatureId() {
        return candidatureId;
    }

    public void setCandidatureId(String candidatureId) {
        this.candidatureId = candidatureId;
    }

    public String getCandidatId() {
        return candidatId;
    }

    public void setCandidatId(String candidatId) {
        this.candidatId = candidatId;
    }

    public String getOffreId() {
        return offreId;
    }

    public void setOffreId(String offreId) {
        this.offreId = offreId;
    }

    public String getCandidatNom() {
        return candidatNom;
    }

    public void setCandidatNom(String candidatNom) {
        this.candidatNom = candidatNom;
    }

    public String getCandidatPrenom() {
        return candidatPrenom;
    }

    public void setCandidatPrenom(String candidatPrenom) {
        this.candidatPrenom = candidatPrenom;
    }

    public String getCandidatEmail() {
        return candidatEmail;
    }

    public void setCandidatEmail(String candidatEmail) {
        this.candidatEmail = candidatEmail;
    }

    public String getOffreTitre() {
        return offreTitre;
    }

    public void setOffreTitre(String offreTitre) {
        this.offreTitre = offreTitre;
    }

    public TypeEntretien getType() {
        return type;
    }

    public void setType(TypeEntretien type) {
        this.type = type;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public Integer getDureeMinutes() {
        return dureeMinutes;
    }

    public void setDureeMinutes(Integer dureeMinutes) {
        this.dureeMinutes = dureeMinutes;
    }

    public TypeLieu getTypeLieu() {
        return typeLieu;
    }

    public void setTypeLieu(TypeLieu typeLieu) {
        this.typeLieu = typeLieu;
    }

    public String getLieu() {
        return lieu;
    }

    public void setLieu(String lieu) {
        this.lieu = lieu;
    }

    public String getSalle() {
        return salle;
    }

    public void setSalle(String salle) {
        this.salle = salle;
    }

    public List<Participant> getParticipants() {
        return participants;
    }

    public void setParticipants(List<Participant> participants) {
        this.participants = participants;
    }

    public List<String> getInterviewersIds() {
        return interviewersIds;
    }

    public void setInterviewersIds(List<String> interviewersIds) {
        this.interviewersIds = interviewersIds;
    }

    public List<String> getInterviewersNoms() {
        return interviewersNoms;
    }

    public void setInterviewersNoms(List<String> interviewersNoms) {
        this.interviewersNoms = interviewersNoms;
    }

    public StatutEntretien getStatut() {
        return statut;
    }

    public void setStatut(StatutEntretien statut) {
        this.statut = statut;
    }

    public String getNotesAvant() {
        return notesAvant;
    }

    public void setNotesAvant(String notesAvant) {
        this.notesAvant = notesAvant;
    }

    public String getNotesPendant() {
        return notesPendant;
    }

    public void setNotesPendant(String notesPendant) {
        this.notesPendant = notesPendant;
    }

    public String getNotesApres() {
        return notesApres;
    }

    public void setNotesApres(String notesApres) {
        this.notesApres = notesApres;
    }

    public Integer getEvaluationGlobale() {
        return evaluationGlobale;
    }

    public void setEvaluationGlobale(Integer evaluationGlobale) {
        this.evaluationGlobale = evaluationGlobale;
    }

    public List<Evaluation> getEvaluationsDetaillees() {
        return evaluationsDetaillees;
    }

    public void setEvaluationsDetaillees(List<Evaluation> evaluationsDetaillees) {
        this.evaluationsDetaillees = evaluationsDetaillees;
    }

    public RecommandationFinale getRecommandation() {
        return recommandation;
    }

    public void setRecommandation(RecommandationFinale recommandation) {
        this.recommandation = recommandation;
    }

    public String getRaisonRecommandation() {
        return raisonRecommandation;
    }

    public void setRaisonRecommandation(String raisonRecommandation) {
        this.raisonRecommandation = raisonRecommandation;
    }

    public String getLienDocuments() {
        return lienDocuments;
    }

    public void setLienDocuments(String lienDocuments) {
        this.lienDocuments = lienDocuments;
    }

    public List<String> getDocumentIds() {
        return documentIds;
    }

    public void setDocumentIds(List<String> documentIds) {
        this.documentIds = documentIds;
    }

    public boolean isRappelEnvoye() {
        return rappelEnvoye;
    }

    public void setRappelEnvoye(boolean rappelEnvoye) {
        this.rappelEnvoye = rappelEnvoye;
    }

    public LocalDateTime getDateRappel() {
        return dateRappel;
    }

    public void setDateRappel(LocalDateTime dateRappel) {
        this.dateRappel = dateRappel;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDateModification() {
        return dateModification;
    }

    public void setDateModification(LocalDateTime dateModification) {
        this.dateModification = dateModification;
    }

    public String getCreateurId() {
        return createurId;
    }

    public void setCreateurId(String createurId) {
        this.createurId = createurId;
    }

    public String getCreateurNom() {
        return createurNom;
    }

    public void setCreateurNom(String createurNom) {
        this.createurNom = createurNom;
    }
}