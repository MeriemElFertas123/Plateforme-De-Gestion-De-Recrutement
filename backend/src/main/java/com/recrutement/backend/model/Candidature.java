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
@Document(collection = "candidatures")
public class Candidature {

    @Id
    private String id;

    // Relations
    @Indexed
    private String candidatId;

    @Indexed
    private String offreId;

    // Informations rapides (dénormalisées pour performance)
    private String candidatNom;
    private String candidatPrenom;
    private String candidatEmail;
    private String offreTitre;

    // Statut
    @Indexed
    private StatutCandidature statut = StatutCandidature.NOUVEAU;

    // Score de matching
    private int scoreMatching = 0; // 0-100

    // Lettre de motivation
    private String lettreMotivation;

    // Commentaires internes
    private List<Commentaire> commentaires = new ArrayList<>();

    // Historique des changements de statut
    private List<HistoriqueStatut> historique = new ArrayList<>();

    // Source de la candidature
    private SourceCandidature source = SourceCandidature.SITE_CARRIERE;

    // Dates
    @CreatedDate
    private LocalDateTime datePostulation;

    @LastModifiedDate
    private LocalDateTime dateModification;

    private LocalDateTime dateDerniereAction;

    // Classes internes
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Commentaire {
        private String auteurId;
        private String auteurNom;
        private String contenu;
        private LocalDateTime date;
        private boolean prive = false; // Visible uniquement en interne

        public String getAuteurId() {
            return auteurId;
        }

        public void setAuteurId(String auteurId) {
            this.auteurId = auteurId;
        }

        public String getAuteurNom() {
            return auteurNom;
        }

        public void setAuteurNom(String auteurNom) {
            this.auteurNom = auteurNom;
        }

        public String getContenu() {
            return contenu;
        }

        public void setContenu(String contenu) {
            this.contenu = contenu;
        }

        public LocalDateTime getDate() {
            return date;
        }

        public void setDate(LocalDateTime date) {
            this.date = date;
        }

        public boolean isPrive() {
            return prive;
        }

        public void setPrive(boolean prive) {
            this.prive = prive;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HistoriqueStatut {
        private StatutCandidature ancienStatut;
        private StatutCandidature nouveauStatut;
        private String auteurId;
        private String auteurNom;
        private String commentaire;
        private LocalDateTime date;

        public StatutCandidature getAncienStatut() {
            return ancienStatut;
        }

        public void setAncienStatut(StatutCandidature ancienStatut) {
            this.ancienStatut = ancienStatut;
        }

        public StatutCandidature getNouveauStatut() {
            return nouveauStatut;
        }

        public void setNouveauStatut(StatutCandidature nouveauStatut) {
            this.nouveauStatut = nouveauStatut;
        }

        public String getAuteurId() {
            return auteurId;
        }

        public void setAuteurId(String auteurId) {
            this.auteurId = auteurId;
        }

        public String getAuteurNom() {
            return auteurNom;
        }

        public void setAuteurNom(String auteurNom) {
            this.auteurNom = auteurNom;
        }

        public String getCommentaire() {
            return commentaire;
        }

        public void setCommentaire(String commentaire) {
            this.commentaire = commentaire;
        }

        public LocalDateTime getDate() {
            return date;
        }

        public void setDate(LocalDateTime date) {
            this.date = date;
        }
    }

    // Enums
    public enum StatutCandidature {
        NOUVEAU,            // Candidature reçue
        EN_REVISION,        // En cours d'analyse
        PRESELECTIONNE,     // CV retenu
        ENTRETIEN_RH,       // Convoqué entretien RH
        TEST_TECHNIQUE,     // Convoqué test technique
        ENTRETIEN_FINAL,    // Entretien final
        OFFRE_ENVOYEE,      // Offre d'emploi envoyée
        ACCEPTE,            // Candidat accepté
        REFUSE,             // Candidature rejetée
        RETIRE              // Candidat s'est retiré
    }

    public enum SourceCandidature {
        SITE_CARRIERE,
        LINKEDIN,
        INDEED,
        COOPTATION,
        SPONTANEE,
        AUTRE
    }

    // Méthodes utilitaires
    public void ajouterCommentaire(String auteurId, String auteurNom, String contenu, boolean prive) {
        Commentaire commentaire = new Commentaire();
        commentaire.setAuteurId(auteurId);
        commentaire.setAuteurNom(auteurNom);
        commentaire.setContenu(contenu);
        commentaire.setDate(LocalDateTime.now());
        commentaire.setPrive(prive);

        if (this.commentaires == null) {
            this.commentaires = new ArrayList<>();
        }
        this.commentaires.add(commentaire);
    }

    public void changerStatut(StatutCandidature nouveauStatut, String auteurId, String auteurNom, String commentaire) {
        HistoriqueStatut historique = new HistoriqueStatut();
        historique.setAncienStatut(this.statut);
        historique.setNouveauStatut(nouveauStatut);
        historique.setAuteurId(auteurId);
        historique.setAuteurNom(auteurNom);
        historique.setCommentaire(commentaire);
        historique.setDate(LocalDateTime.now());

        if (this.historique == null) {
            this.historique = new ArrayList<>();
        }
        this.historique.add(historique);

        this.statut = nouveauStatut;
        this.dateDerniereAction = LocalDateTime.now();
    }

    public long getJoursDepuisPostulation() {
        if (datePostulation == null) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(datePostulation, LocalDateTime.now());
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public StatutCandidature getStatut() {
        return statut;
    }

    public void setStatut(StatutCandidature statut) {
        this.statut = statut;
    }

    public int getScoreMatching() {
        return scoreMatching;
    }

    public void setScoreMatching(int scoreMatching) {
        this.scoreMatching = scoreMatching;
    }

    public String getLettreMotivation() {
        return lettreMotivation;
    }

    public void setLettreMotivation(String lettreMotivation) {
        this.lettreMotivation = lettreMotivation;
    }

    public List<Commentaire> getCommentaires() {
        return commentaires;
    }

    public void setCommentaires(List<Commentaire> commentaires) {
        this.commentaires = commentaires;
    }

    public List<HistoriqueStatut> getHistorique() {
        return historique;
    }

    public void setHistorique(List<HistoriqueStatut> historique) {
        this.historique = historique;
    }

    public SourceCandidature getSource() {
        return source;
    }

    public void setSource(SourceCandidature source) {
        this.source = source;
    }

    public LocalDateTime getDatePostulation() {
        return datePostulation;
    }

    public void setDatePostulation(LocalDateTime datePostulation) {
        this.datePostulation = datePostulation;
    }

    public LocalDateTime getDateModification() {
        return dateModification;
    }

    public void setDateModification(LocalDateTime dateModification) {
        this.dateModification = dateModification;
    }

    public LocalDateTime getDateDerniereAction() {
        return dateDerniereAction;
    }

    public void setDateDerniereAction(LocalDateTime dateDerniereAction) {
        this.dateDerniereAction = dateDerniereAction;
    }
}