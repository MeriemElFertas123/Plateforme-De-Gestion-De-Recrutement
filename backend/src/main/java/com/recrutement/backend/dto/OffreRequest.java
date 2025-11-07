package com.recrutement.backend.dto;

import com.recrutement.backend.model.Offre;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OffreRequest {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 5, max = 200, message = "Le titre doit contenir entre 5 et 200 caractères")
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    @Size(min = 50, message = "La description doit contenir au moins 50 caractères")
    private String description;

    private String reference;

    @NotNull(message = "Au moins une compétence requise")
    @Size(min = 1, message = "Au moins une compétence requise")
    private List<String> competencesRequises = new ArrayList<>();

    private List<String> competencesSouhaitees = new ArrayList<>();

    @NotBlank(message = "La localisation est obligatoire")
    private String localisation;

    @NotNull(message = "Le type de contrat est obligatoire")
    private Offre.TypeContrat typeContrat;

    private String departement;

    private Integer experienceRequise;

    private Offre.NiveauEtudes niveauEtudesRequis;

    private Double salaireMin;

    private Double salaireMax;

    private LocalDateTime dateExpiration;

    private List<Offre.EtapeRecrutement> etapesRecrutement = new ArrayList<>();

    private boolean teletravailPossible;

    private List<String> avantages = new ArrayList<>();

    // Constructeurs
    public OffreRequest() {}

    // Getters et Setters
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

    public Offre.TypeContrat getTypeContrat() {
        return typeContrat;
    }

    public void setTypeContrat(Offre.TypeContrat typeContrat) {
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

    public Offre.NiveauEtudes getNiveauEtudesRequis() {
        return niveauEtudesRequis;
    }

    public void setNiveauEtudesRequis(Offre.NiveauEtudes niveauEtudesRequis) {
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

    public LocalDateTime getDateExpiration() {
        return dateExpiration;
    }

    public void setDateExpiration(LocalDateTime dateExpiration) {
        this.dateExpiration = dateExpiration;
    }

    public List<Offre.EtapeRecrutement> getEtapesRecrutement() {
        return etapesRecrutement;
    }

    public void setEtapesRecrutement(List<Offre.EtapeRecrutement> etapesRecrutement) {
        this.etapesRecrutement = etapesRecrutement;
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
}