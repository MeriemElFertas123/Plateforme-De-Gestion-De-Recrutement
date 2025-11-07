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
@Document(collection = "offres")
public class Offre {

    @Id
    private String id;

    // Informations de base
    @Indexed
    private String titre;

    private String description;

    private String reference; // Ex: "REF-2024-001"

    // Compétences
    private List<String> competencesRequises = new ArrayList<>();

    private List<String> competencesSouhaitees = new ArrayList<>();

    // Localisation et contrat
    private String localisation;

    private TypeContrat typeContrat;

    private String departement; // Ex: "Informatique", "RH", "Marketing"

    // Expérience et formation
    private Integer experienceRequise; // En années

    private NiveauEtudes niveauEtudesRequis;

    // Salaire
    private Double salaireMin;

    private Double salaireMax;

    private String deviseMonnaie = "DH";

    // Statut et publication
    @Indexed
    private StatutOffre statut = StatutOffre.BROUILLON;

    private LocalDateTime datePublication;

    private LocalDateTime dateExpiration;

    // Informations sur le créateur
    @Indexed
    private String createurId; // ID du recruteur qui a créé l'offre

    private String createurNom; // Nom du recruteur

    // Processus de recrutement
    private List<EtapeRecrutement> etapesRecrutement = new ArrayList<>();

    // Statistiques
    private int nombreVues = 0;

    private int nombreCandidatures = 0;

    // Options
    private boolean teletravailPossible = false;

    private List<String> avantages = new ArrayList<>(); // Ex: "Tickets restaurant", "Mutuelle"

    // Métadonnées
    @CreatedDate
    private LocalDateTime dateCreation;

    @LastModifiedDate
    private LocalDateTime dateModification;

    // Enums
    public enum TypeContrat {
        CDI,
        CDD,
        STAGE,
        ALTERNANCE,
        FREELANCE,
        INTERIM
    }

    public enum StatutOffre {
        BROUILLON,      // En cours de rédaction
        PUBLIEE,        // Active et visible
        EXPIREE,        // Date d'expiration dépassée
        POURVUE,        // Poste pourvu
        ARCHIVEE        // Archivée par le recruteur
    }

    public enum NiveauEtudes {
        BAC,
        BAC_PLUS_2,
        BAC_PLUS_3,
        BAC_PLUS_5,
        DOCTORAT,
        AUCUN
    }

    public static class EtapeRecrutement {
        private String nom; // Ex: "Entretien RH"
        private String description;
        private int ordre; // Pour l'ordre des étapes

        public EtapeRecrutement() {}

        public EtapeRecrutement(String nom, String description, int ordre) {
            this.nom = nom;
            this.description = description;
            this.ordre = ordre;
        }

        // Getters et Setters
        public String getNom() {
            return nom;
        }

        public void setNom(String nom) {
            this.nom = nom;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public int getOrdre() {
            return ordre;
        }

        public void setOrdre(int ordre) {
            this.ordre = ordre;
        }
    }

    // Méthodes utilitaires
    public boolean isActive() {
        return statut == StatutOffre.PUBLIEE
                && (dateExpiration == null || dateExpiration.isAfter(LocalDateTime.now()));
    }

    public boolean isExpired() {
        return dateExpiration != null && dateExpiration.isBefore(LocalDateTime.now());
    }

    public void incrementVues() {
        this.nombreVues++;
    }

    public void incrementCandidatures() {
        this.nombreCandidatures++;
    }

    // Getters et Setters (Lombok les génère automatiquement avec @Data)

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public List<String> getCompetencesRequises() {
        return competencesRequises;
    }

    public void setCompetencesRequises(List<String> competencesRequises) {
        this.competencesRequises = competencesRequises;
    }

    public List<String> getCompetencesSouhaitees() {
        return competencesSouhaitees;
    }

    public void setCompetencesSouhaitees(List<String> competencesSouhaitees) {
        this.competencesSouhaitees = competencesSouhaitees;
    }

    public String getLocalisation() {
        return localisation;
    }

    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }

    public TypeContrat getTypeContrat() {
        return typeContrat;
    }

    public void setTypeContrat(TypeContrat typeContrat) {
        this.typeContrat = typeContrat;
    }

    public String getDepartement() {
        return departement;
    }

    public void setDepartement(String departement) {
        this.departement = departement;
    }

    public Integer getExperienceRequise() {
        return experienceRequise;
    }

    public void setExperienceRequise(Integer experienceRequise) {
        this.experienceRequise = experienceRequise;
    }

    public NiveauEtudes getNiveauEtudesRequis() {
        return niveauEtudesRequis;
    }

    public void setNiveauEtudesRequis(NiveauEtudes niveauEtudesRequis) {
        this.niveauEtudesRequis = niveauEtudesRequis;
    }

    public Double getSalaireMin() {
        return salaireMin;
    }

    public void setSalaireMin(Double salaireMin) {
        this.salaireMin = salaireMin;
    }

    public Double getSalaireMax() {
        return salaireMax;
    }

    public void setSalaireMax(Double salaireMax) {
        this.salaireMax = salaireMax;
    }

    public String getDeviseMonnaie() {
        return deviseMonnaie;
    }

    public void setDeviseMonnaie(String deviseMonnaie) {
        this.deviseMonnaie = deviseMonnaie;
    }

    public StatutOffre getStatut() {
        return statut;
    }

    public void setStatut(StatutOffre statut) {
        this.statut = statut;
    }

    public LocalDateTime getDatePublication() {
        return datePublication;
    }

    public void setDatePublication(LocalDateTime datePublication) {
        this.datePublication = datePublication;
    }

    public LocalDateTime getDateExpiration() {
        return dateExpiration;
    }

    public void setDateExpiration(LocalDateTime dateExpiration) {
        this.dateExpiration = dateExpiration;
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

    public List<EtapeRecrutement> getEtapesRecrutement() {
        return etapesRecrutement;
    }

    public void setEtapesRecrutement(List<EtapeRecrutement> etapesRecrutement) {
        this.etapesRecrutement = etapesRecrutement;
    }

    public int getNombreVues() {
        return nombreVues;
    }

    public void setNombreVues(int nombreVues) {
        this.nombreVues = nombreVues;
    }

    public int getNombreCandidatures() {
        return nombreCandidatures;
    }

    public void setNombreCandidatures(int nombreCandidatures) {
        this.nombreCandidatures = nombreCandidatures;
    }

    public boolean isTeletravailPossible() {
        return teletravailPossible;
    }

    public void setTeletravailPossible(boolean teletravailPossible) {
        this.teletravailPossible = teletravailPossible;
    }

    public List<String> getAvantages() {
        return avantages;
    }

    public void setAvantages(List<String> avantages) {
        this.avantages = avantages;
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