package com.recrutement.backend.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CVParserService {

    private final Tika tika = new Tika();

    /**
     * Parser un CV et extraire les informations
     */
    public Map<String, Object> parseCV(MultipartFile file) throws IOException {
        Map<String, Object> extractedData = new HashMap<>();

        // Détecter le type de fichier
        String mimeType = tika.detect(file.getInputStream());

        // Extraire le texte selon le type
        String texte = "";
        if (mimeType.contains("pdf")) {
            texte = extractTextFromPDF(file.getInputStream());
        } else if (mimeType.contains("word") || mimeType.contains("document")) {
            texte = extractTextFromWord(file.getInputStream());
        } else {
            throw new RuntimeException("Format de fichier non supporté. Utilisez PDF ou DOCX.");
        }

        // Extraire les informations du texte
        extractedData.put("texteComplet", texte);
        extractedData.put("email", extractEmail(texte));
        extractedData.put("telephone", extractTelephone(texte));
        extractedData.put("competences", extractCompetences(texte));
        extractedData.put("nom", extractNom(texte));

        return extractedData;
    }

    /**
     * Extraire le texte d'un PDF
     */
    private String extractTextFromPDF(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    /**
     * Extraire le texte d'un fichier Word
     */
    private String extractTextFromWord(InputStream inputStream) throws IOException {
        StringBuilder texte = new StringBuilder();

        try (XWPFDocument document = new XWPFDocument(inputStream)) {
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                texte.append(paragraph.getText()).append("\n");
            }
        }

        return texte.toString();
    }

    /**
     * Extraire l'email du texte
     */
    private String extractEmail(String texte) {
        Pattern pattern = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
        Matcher matcher = pattern.matcher(texte);

        if (matcher.find()) {
            return matcher.group();
        }

        return null;
    }

    /**
     * Extraire le téléphone du texte
     */
    private String extractTelephone(String texte) {
        // Patterns français
        Pattern pattern = Pattern.compile(
                "(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}"
        );
        Matcher matcher = pattern.matcher(texte);

        if (matcher.find()) {
            return matcher.group().replaceAll("\\s", "");
        }

        return null;
    }

    /**
     * Extraire les compétences du texte
     */
    private List<String> extractCompetences(String texte) {
        List<String> competences = new ArrayList<>();

        // Liste des compétences techniques courantes
        String[] competencesCourantes = {
                "Java", "Spring", "Spring Boot", "React", "Angular", "Vue.js", "Node.js",
                "JavaScript", "TypeScript", "Python", "Django", "Flask",
                "PHP", "Laravel", "Symfony",
                "C#", ".NET", "ASP.NET",
                "SQL", "MySQL", "PostgreSQL", "MongoDB", "Oracle",
                "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions",
                "AWS", "Azure", "GCP", "Google Cloud",
                "HTML", "CSS", "SASS", "LESS",
                "Git", "SVN", "Mercurial",
                "REST", "GraphQL", "SOAP",
                "Agile", "Scrum", "Kanban",
                "Linux", "Unix", "Windows",
                "TDD", "BDD", "CI/CD",
                "Microservices", "API",
                "Redis", "Elasticsearch", "Kafka",
                "Machine Learning", "Deep Learning", "IA", "AI",
                "DevOps", "Cloud", "Serverless"
        };

        String texteMinuscule = texte.toLowerCase();

        for (String competence : competencesCourantes) {
            if (texteMinuscule.contains(competence.toLowerCase())) {
                if (!competences.contains(competence)) {
                    competences.add(competence);
                }
            }
        }

        return competences;
    }

    /**
     * Extraire le nom (première ligne généralement)
     */
    private String extractNom(String texte) {
        String[] lignes = texte.split("\n");

        if (lignes.length > 0) {
            String premiereLigne = lignes[0].trim();

            // Si la première ligne contient moins de 50 caractères et pas d'email
            if (premiereLigne.length() < 50 && !premiereLigne.contains("@")) {
                return premiereLigne;
            }
        }

        return null;
    }

    /**
     * Calculer un score de matching entre CV et offre
     */
    public int calculateMatchingScore(List<String> competencesCandidat, List<String> competencesRequises) {
        if (competencesRequises == null || competencesRequises.isEmpty()) {
            return 50; // Score neutre si pas de compétences requises
        }

        if (competencesCandidat == null || competencesCandidat.isEmpty()) {
            return 0;
        }

        // Convertir en minuscules pour comparaison
        Set<String> candidatSet = new HashSet<>();
        for (String comp : competencesCandidat) {
            candidatSet.add(comp.toLowerCase());
        }

        Set<String> requisesSet = new HashSet<>();
        for (String comp : competencesRequises) {
            requisesSet.add(comp.toLowerCase());
        }

        // Calculer l'intersection
        Set<String> intersection = new HashSet<>(candidatSet);
        intersection.retainAll(requisesSet);

        // Score = (compétences en commun / compétences requises) * 100
        int score = (int) ((intersection.size() * 100.0) / requisesSet.size());

        return Math.min(score, 100); // Maximum 100
    }
}