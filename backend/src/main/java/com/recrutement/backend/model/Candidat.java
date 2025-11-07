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
@Document(collection = "candidats")
public class Candidat {

    @Id
    private String id;

    // Informations personnelles
    private String nom;
    private String prenom;

    @Indexed(unique = true)
    private String email;

    private String telephone;
    private String adresse;
    private String ville;
    private String codePostal;
    private String pays = "MAROC";

    // Profil professionnel
    private String titre; // Ex: "Développeur Full Stack"
    private String resumeProfessionnel;

    // Compétences
    private List<String> competences = new ArrayList<>();

    // Expériences professionnelles
    private List<Experience> experiences = new ArrayList<>();

    // Formations
    private List<Formation> formations = new ArrayList<>();

    // Langues
    private List<Langue> langues = new ArrayList<>();

    // Documents
    private String cvUrl; // Lien vers le CV stocké
    private String cvFileName;
    private String lettreMotivationUrl;
    private String portfolioUrl;
    private String linkedinUrl;
    private String githubUrl;

    // Préférences
    private List<String> typesContratRecherches = new ArrayList<>();
    private List<String> localisationsPreferees = new ArrayList<>();
    private boolean ouvertTeletravail = false;
    private boolean ouvertMobilite = false;
    private Double salaireAttendu;
    private DisponibiliteType disponibilite = DisponibiliteType.IMMEDIAT;

    // Statut
    private StatutCandidat statut = StatutCandidat.ACTIF;

    // Métadonnées
    @CreatedDate
    private LocalDateTime dateCreation;

    @LastModifiedDate
    private LocalDateTime dateModification;

    // Classes internes
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Experience {
        private String entreprise;
        private String poste;
        private String description;
        private LocalDateTime dateDebut;
        private LocalDateTime dateFin;
        private boolean enCours = false;
        private String ville;

        public String getEntreprise() {
            return entreprise;
        }

        public void setEntreprise(String entreprise) {
            this.entreprise = entreprise;
        }

        public String getPoste() {
            return poste;
        }

        public void setPoste(String poste) {
            this.poste = poste;
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

        public boolean isEnCours() {
            return enCours;
        }

        public void setEnCours(boolean enCours) {
            this.enCours = enCours;
        }

        public String getVille() {
            return ville;
        }

        public void setVille(String ville) {
            this.ville = ville;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Formation {
        private String ecole;
        private String diplome;
        private String domaine;
        private LocalDateTime dateDebut;
        private LocalDateTime dateFin;
        private String ville;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Langue {
        private String langue;
        private NiveauLangue niveau;
    }

    // Enums
    public enum StatutCandidat {
        ACTIF,              // Disponible et cherche activement
        EMBAUCHE,           // A trouvé un emploi
        INACTIF,            // Ne cherche plus
        BLACKLISTE          // Ne plus contacter
    }

    public enum DisponibiliteType {
        IMMEDIAT,
        UN_MOIS,
        DEUX_MOIS,
        TROIS_MOIS,
        PLUS_TARD
    }

    public enum NiveauLangue {
        NOTIONS,
        INTERMEDIAIRE,
        COURANT,
        BILINGUE,
        NATIF
    }

    // Méthodes utilitaires
    public String getNomComplet() {
        return prenom + " " + nom;
    }

    public int getAnneesExperience() {
        if (experiences == null || experiences.isEmpty()) {
            return 0;
        }

        return experiences.stream()
                .mapToInt(exp -> {
                    LocalDateTime debut = exp.getDateDebut();
                    LocalDateTime fin = exp.isEnCours() ? LocalDateTime.now() : exp.getDateFin();

                    if (debut != null && fin != null) {
                        return (int) java.time.temporal.ChronoUnit.YEARS.between(debut, fin);
                    }
                    return 0;
                })
                .sum();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getResumeProfessionnel() {
        return resumeProfessionnel;
    }

    public void setResumeProfessionnel(String resumeProfessionnel) {
        this.resumeProfessionnel = resumeProfessionnel;
    }

    public List<String> getCompetences() {
        return competences;
    }

    public void setCompetences(List<String> competences) {
        this.competences = competences;
    }

    public List<Experience> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<Experience> experiences) {
        this.experiences = experiences;
    }

    public List<Formation> getFormations() {
        return formations;
    }

    public void setFormations(List<Formation> formations) {
        this.formations = formations;
    }

    public List<Langue> getLangues() {
        return langues;
    }

    public void setLangues(List<Langue> langues) {
        this.langues = langues;
    }

    public String getCvUrl() {
        return cvUrl;
    }

    public void setCvUrl(String cvUrl) {
        this.cvUrl = cvUrl;
    }

    public String getCvFileName() {
        return cvFileName;
    }

    public void setCvFileName(String cvFileName) {
        this.cvFileName = cvFileName;
    }

    public String getLettreMotivationUrl() {
        return lettreMotivationUrl;
    }

    public void setLettreMotivationUrl(String lettreMotivationUrl) {
        this.lettreMotivationUrl = lettreMotivationUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public List<String> getTypesContratRecherches() {
        return typesContratRecherches;
    }

    public void setTypesContratRecherches(List<String> typesContratRecherches) {
        this.typesContratRecherches = typesContratRecherches;
    }

    public List<String> getLocalisationsPreferees() {
        return localisationsPreferees;
    }

    public void setLocalisationsPreferees(List<String> localisationsPreferees) {
        this.localisationsPreferees = localisationsPreferees;
    }

    public boolean isOuvertTeletravail() {
        return ouvertTeletravail;
    }

    public void setOuvertTeletravail(boolean ouvertTeletravail) {
        this.ouvertTeletravail = ouvertTeletravail;
    }

    public boolean isOuvertMobilite() {
        return ouvertMobilite;
    }

    public void setOuvertMobilite(boolean ouvertMobilite) {
        this.ouvertMobilite = ouvertMobilite;
    }

    public Double getSalaireAttendu() {
        return salaireAttendu;
    }

    public void setSalaireAttendu(Double salaireAttendu) {
        this.salaireAttendu = salaireAttendu;
    }

    public DisponibiliteType getDisponibilite() {
        return disponibilite;
    }

    public void setDisponibilite(DisponibiliteType disponibilite) {
        this.disponibilite = disponibilite;
    }

    public StatutCandidat getStatut() {
        return statut;
    }

    public void setStatut(StatutCandidat statut) {
        this.statut = statut;
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

}