package com.recrutement.backend.service;

import com.recrutement.backend.model.Candidature;
import com.recrutement.backend.model.Entretien;
import com.recrutement.backend.model.Offre;
import com.recrutement.backend.repository.CandidatRepository;
import com.recrutement.backend.repository.CandidatureRepository;
import com.recrutement.backend.repository.EntretienRepository;
import com.recrutement.backend.repository.OffreRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final OffreRepository offreRepository;
    private final CandidatureRepository candidatureRepository;
    private final EntretienRepository entretienRepository;
    private final CandidatRepository candidatRepository;

    public AnalyticsService(
            OffreRepository offreRepository,
            CandidatureRepository candidatureRepository,
            EntretienRepository entretienRepository,
            CandidatRepository candidatRepository) {
        this.offreRepository = offreRepository;
        this.candidatureRepository = candidatureRepository;
        this.entretienRepository = entretienRepository;
        this.candidatRepository = candidatRepository;
    }

    /**
     * Tableau de bord global
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Statistiques globales
        stats.put("totalOffres", offreRepository.count());
        stats.put("offresPubliees", offreRepository.countByStatut(Offre.StatutOffre.PUBLIEE));
        stats.put("totalCandidatures", candidatureRepository.count());
        stats.put("totalEntretiens", entretienRepository.count());
        stats.put("totalCandidats", candidatRepository.count());

        // Statistiques des 30 derniers jours
        LocalDateTime il30Jours = LocalDateTime.now().minusDays(30);
        stats.put("candidaturesRecentes", candidatureRepository.findByDatePostulationBetween(il30Jours, LocalDateTime.now()).size());
        stats.put("entretiensAVenir", entretienRepository.findEntretiensAVenir(LocalDateTime.now()).size());

        // Taux de conversion
        long totalCandidatures = candidatureRepository.count();
        long candidaturesAcceptees = candidatureRepository.countByStatut(Candidature.StatutCandidature.ACCEPTE);
        double tauxConversion = totalCandidatures > 0 ? (candidaturesAcceptees * 100.0 / totalCandidatures) : 0;
        stats.put("tauxConversion", Math.round(tauxConversion * 100) / 100.0);

        // Temps moyen de recrutement
        stats.put("tempsMoyenRecrutement", calculerTempsMoyenRecrutement());

        return stats;
    }

    /**
     * Évolution des candidatures par mois (12 derniers mois)
     */
    public List<Map<String, Object>> getEvolutionCandidatures() {
        List<Map<String, Object>> evolution = new ArrayList<>();
        LocalDate maintenant = LocalDate.now();

        for (int i = 11; i >= 0; i--) {
            YearMonth mois = YearMonth.from(maintenant.minusMonths(i));
            LocalDateTime debut = mois.atDay(1).atStartOfDay();
            LocalDateTime fin = mois.atEndOfMonth().atTime(23, 59, 59);

            List<Candidature> candidatures = candidatureRepository.findByDatePostulationBetween(debut, fin);

            Map<String, Object> data = new HashMap<>();
            data.put("mois", mois.getMonth().name().substring(0, 3) + " " + mois.getYear());
            data.put("total", candidatures.size());
            data.put("acceptees", candidatures.stream().filter(c -> c.getStatut() == Candidature.StatutCandidature.ACCEPTE).count());
            data.put("refusees", candidatures.stream().filter(c -> c.getStatut() == Candidature.StatutCandidature.REFUSE).count());

            evolution.add(data);
        }

        return evolution;
    }

    /**
     * Répartition des candidatures par statut
     */
    public List<Map<String, Object>> getRepartitionParStatut() {
        List<Map<String, Object>> repartition = new ArrayList<>();

        for (Candidature.StatutCandidature statut : Candidature.StatutCandidature.values()) {
            long count = candidatureRepository.countByStatut(statut);
            if (count > 0) {
                Map<String, Object> data = new HashMap<>();
                data.put("statut", statut.name());
                data.put("nombre", count);
                repartition.add(data);
            }
        }

        return repartition;
    }

    /**
     * Top 5 offres par nombre de candidatures
     */
    public List<Map<String, Object>> getTopOffres() {
        List<Offre> offres = offreRepository.findAll();

        return offres.stream()
                .sorted((o1, o2) -> Integer.compare(o2.getNombreCandidatures(), o1.getNombreCandidatures()))
                .limit(5)
                .map(offre -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", offre.getId());
                    data.put("titre", offre.getTitre());
                    data.put("nombreCandidatures", offre.getNombreCandidatures());
                    data.put("nombreVues", offre.getNombreVues());
                    data.put("tauxConversion", offre.getNombreCandidatures() > 0 && offre.getNombreVues() > 0
                            ? Math.round((offre.getNombreCandidatures() * 100.0 / offre.getNombreVues()) * 100) / 100.0
                            : 0);
                    return data;
                })
                .collect(Collectors.toList());
    }

    /**
     * Répartition des entretiens par type
     */
    public List<Map<String, Object>> getRepartitionEntretiens() {
        List<Map<String, Object>> repartition = new ArrayList<>();

        for (Entretien.TypeEntretien type : Entretien.TypeEntretien.values()) {
            List<Entretien> entretiens = entretienRepository.findByType(type);
            if (!entretiens.isEmpty()) {
                Map<String, Object> data = new HashMap<>();
                data.put("type", type.name());
                data.put("nombre", entretiens.size());
                repartition.add(data);
            }
        }

        return repartition;
    }

    /**
     * Sources de candidatures
     */
    public List<Map<String, Object>> getSourcesCandidatures() {
        List<Candidature> candidatures = candidatureRepository.findAll();

        Map<Candidature.SourceCandidature, Long> sourcesMap = candidatures.stream()
                .collect(Collectors.groupingBy(Candidature::getSource, Collectors.counting()));

        return sourcesMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("source", entry.getKey().name());
                    data.put("nombre", entry.getValue());
                    return data;
                })
                .sorted((a, b) -> Long.compare((Long) b.get("nombre"), (Long) a.get("nombre")))
                .collect(Collectors.toList());
    }

    /**
     * Distribution des scores de matching
     */
    public Map<String, Long> getDistributionScores() {
        List<Candidature> candidatures = candidatureRepository.findAll();

        Map<String, Long> distribution = new HashMap<>();
        distribution.put("0-20", candidatures.stream().filter(c -> c.getScoreMatching() < 20).count());
        distribution.put("20-40", candidatures.stream().filter(c -> c.getScoreMatching() >= 20 && c.getScoreMatching() < 40).count());
        distribution.put("40-60", candidatures.stream().filter(c -> c.getScoreMatching() >= 40 && c.getScoreMatching() < 60).count());
        distribution.put("60-80", candidatures.stream().filter(c -> c.getScoreMatching() >= 60 && c.getScoreMatching() < 80).count());
        distribution.put("80-100", candidatures.stream().filter(c -> c.getScoreMatching() >= 80).count());

        return distribution;
    }

    /**
     * Statistiques des entretiens
     */
    public Map<String, Object> getStatsEntretiens() {
        Map<String, Object> stats = new HashMap<>();

        List<Entretien> tous = entretienRepository.findAll();
        stats.put("total", tous.size());
        stats.put("planifies", entretienRepository.countByStatut(Entretien.StatutEntretien.PLANIFIE));
        stats.put("confirmes", entretienRepository.countByStatut(Entretien.StatutEntretien.CONFIRME));
        stats.put("termines", entretienRepository.countByStatut(Entretien.StatutEntretien.TERMINE));
        stats.put("evalues", entretienRepository.countByStatut(Entretien.StatutEntretien.EVALUE));

        // Entretiens de la semaine
        LocalDateTime debutSemaine = LocalDate.now().atStartOfDay();
        LocalDateTime finSemaine = debutSemaine.plusDays(7);
        stats.put("cetteS emaine", entretienRepository.findByDateDebutBetween(debutSemaine, finSemaine).size());

        // Note moyenne des évaluations
        List<Entretien> evalues = entretienRepository.findByStatut(Entretien.StatutEntretien.EVALUE);
        double noteMoyenne = evalues.stream()
                .filter(e -> e.getEvaluationGlobale() != null)
                .mapToInt(Entretien::getEvaluationGlobale)
                .average()
                .orElse(0.0);
        stats.put("noteMoyenne", Math.round(noteMoyenne * 100) / 100.0);

        return stats;
    }

    /**
     * Performance par recruteur
     */
    public List<Map<String, Object>> getPerformanceRecruteurs() {
        List<Map<String, Object>> performance = new ArrayList<>();

        // Grouper par créateur
        List<Offre> offres = offreRepository.findAll();
        Map<String, List<Offre>> offresParCreateur = offres.stream()
                .collect(Collectors.groupingBy(Offre::getCreateurNom));

        for (Map.Entry<String, List<Offre>> entry : offresParCreateur.entrySet()) {
            Map<String, Object> data = new HashMap<>();
            data.put("recruteur", entry.getKey());
            data.put("nombreOffres", entry.getValue().size());

            int totalCandidatures = entry.getValue().stream()
                    .mapToInt(Offre::getNombreCandidatures)
                    .sum();
            data.put("nombreCandidatures", totalCandidatures);

            double moyenneCandidatures = entry.getValue().size() > 0
                    ? (double) totalCandidatures / entry.getValue().size()
                    : 0;
            data.put("moyenneCandidatures", Math.round(moyenneCandidatures * 100) / 100.0);

            performance.add(data);
        }

        return performance.stream()
                .sorted((a, b) -> Integer.compare((Integer) b.get("nombreCandidatures"), (Integer) a.get("nombreCandidatures")))
                .collect(Collectors.toList());
    }

    /**
     * Calculer le temps moyen de recrutement (en jours)
     */
    private double calculerTempsMoyenRecrutement() {
        List<Candidature> acceptees = candidatureRepository.findByStatut(Candidature.StatutCandidature.ACCEPTE);

        if (acceptees.isEmpty()) {
            return 0.0;
        }

        double moyenneJours = acceptees.stream()
                .filter(c -> c.getDatePostulation() != null)
                .mapToLong(c -> ChronoUnit.DAYS.between(c.getDatePostulation(), LocalDateTime.now()))
                .average()
                .orElse(0.0);

        return Math.round(moyenneJours * 100) / 100.0;
    }

    /**
     * Activité récente (timeline)
     */
    public List<Map<String, Object>> getActiviteRecente(int limit) {
        List<Map<String, Object>> activites = new ArrayList<>();

        // Candidatures récentes
        List<Candidature> candidatures = candidatureRepository.findTop10ByOrderByDatePostulationDesc();
        for (Candidature c : candidatures) {
            if (activites.size() >= limit) break;
            Map<String, Object> activite = new HashMap<>();
            activite.put("type", "CANDIDATURE");
            activite.put("description", c.getCandidatPrenom() + " " + c.getCandidatNom() + " a postulé pour " + c.getOffreTitre());
            activite.put("date", c.getDatePostulation());
            activites.add(activite);
        }

        // Entretiens à venir
        List<Entretien> entretiens = entretienRepository.findEntretiensAVenir(LocalDateTime.now());
        for (Entretien e : entretiens) {
            if (activites.size() >= limit) break;
            Map<String, Object> activite = new HashMap<>();
            activite.put("type", "ENTRETIEN");
            activite.put("description", "Entretien " + e.getType() + " avec " + e.getCandidatPrenom() + " " + e.getCandidatNom());
            activite.put("date", e.getDateDebut());
            activites.add(activite);
        }

        // Trier par date décroissante
        activites.sort((a, b) -> ((LocalDateTime) b.get("date")).compareTo((LocalDateTime) a.get("date")));

        return activites.stream().limit(limit).collect(Collectors.toList());
    }
}