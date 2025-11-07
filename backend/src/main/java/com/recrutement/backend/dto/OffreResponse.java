package com.recrutement.backend.dto;

import com.recrutement.backend.model.Offre;

import java.time.LocalDateTime;
import java.util.List;

public class OffreResponse {

    private String id;
    private String titre;
    private String description;
    private String reference;
    private List<String> competencesRequises;
    private List<String> competencesSouhaitees;
    private String localisation;
    private Offre.TypeContrat typeContrat;
    private String departement;
    private Integer experienceRequise;
    private Offre.NiveauEtudes niveauEtudesRequis;
    private Double salaireMin;
    private Double salaireMax;
    private Offre.StatutOffre statut;
    private LocalDateTime datePublication;
    private LocalDateTime dateExpiration;
    private String createurId;
    private String createurNom;
    private List<Offre.EtapeRecrutement> etapesRecrutement;
    private int nombreVues;
    private int nombreCandidatures;
    private boolean teletravailPossible;
    private List<String> avantages;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;

    public OffreResponse() {}

    // Constructeur depuis Offre
    public OffreResponse(Offre offre) {
        this.id = offre.getId();
        this.titre = offre.getTitre();
        this.description = offre.getDescription();
        this.reference = offre.getReference();
        this.competencesRequises = offre.getCompetencesRequises();
        this.competencesSouhaitees = offre.getCompetencesSouhaitees();
        this.localisation = offre.getLocalisation();
        this.typeContrat = offre.getTypeContrat();
        this.departement = offre.getDepartement();
        this.experienceRequise = offre.getExperienceRequise();
        this.niveauEtudesRequis = offre.getNiveauEtudesRequis();
        this.salaireMin = offre.getSalaireMin();
        this.salaireMax = offre.getSalaireMax();
        this.statut = offre.getStatut();
        this.datePublication = offre.getDatePublication();
        this.dateExpiration = offre.getDateExpiration();
        this.createurId = offre.getCreateurId();
        this.createurNom = offre.getCreateurNom();
        this.etapesRecrutement = offre.getEtapesRecrutement();
        this.nombreVues = offre.getNombreVues();
        this.nombreCandidatures = offre.getNombreCandidatures();
        this.teletravailPossible = offre.isTeletravailPossible();
        this.avantages = offre.getAvantages();
        this.dateCreation = offre.getDateCreation();
        this.dateModification = offre.getDateModification();
    }

    // Getters et Setters
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

    public Offre.StatutOffre getStatut() {
        return statut;
    }

    public void setStatut(Offre.StatutOffre statut) {
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

    public List<Offre.EtapeRecrutement> getEtapesRecrutement() {
        return etapesRecrutement;
    }

    public void setEtapesRecrutement(List<Offre.EtapeRecrutement> etapesRecrutement) {
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