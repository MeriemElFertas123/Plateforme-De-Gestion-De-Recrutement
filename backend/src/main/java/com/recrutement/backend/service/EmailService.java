package com.recrutement.backend.service;

import com.recrutement.backend.model.Notification;
import com.recrutement.backend.repository.NotificationRepository;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final NotificationRepository notificationRepository;
    private final SpringTemplateEngine templateEngine;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.fromName}")
    private String fromName;

    public EmailService(
            JavaMailSender mailSender,
            NotificationRepository notificationRepository,
            SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.notificationRepository = notificationRepository;
        this.templateEngine = templateEngine;
    }

    /**
     * Envoyer un email simple
     */
    @Async
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, false);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erreur envoi email: " + e.getMessage());
        }
    }

    /**
     * Envoyer un email HTML avec template
     */
    @Async
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);

            // Générer le HTML depuis le template Thymeleaf
            Context context = new Context();
            context.setVariables(variables);
            String htmlContent = templateEngine.process(templateName, context);

            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erreur envoi email HTML: " + e.getMessage());
        }
    }

    /**
     * Créer et envoyer une notification de candidature reçue
     */
    public Notification envoyerNotificationCandidatureRecue(
            String candidatEmail,
            String candidatNom,
            String offreTitre,
            String candidatureId
    ) {
        Notification notification = new Notification();
        notification.setType(Notification.TypeNotification.CANDIDATURE_RECUE);
        notification.setDestinataireEmail(candidatEmail);
        notification.setDestinataireNom(candidatNom);
        notification.setSujet("Confirmation de réception - Candidature " + offreTitre);
        notification.setCandidatureId(candidatureId);

        Map<String, Object> variables = new HashMap<>();
        variables.put("candidatNom", candidatNom);
        variables.put("offreTitre", offreTitre);
        variables.put("anneeActuelle", java.time.Year.now().getValue());

        try {
            sendHtmlEmail(
                    candidatEmail,
                    notification.getSujet(),
                    "candidature-recue",
                    variables
            );
            notification.marquerCommeEnvoye();
        } catch (Exception e) {
            notification.marquerCommeEchec(e.getMessage());
        }

        return notificationRepository.save(notification);
    }

    /**
     * Envoyer une invitation à un entretien
     */
    public Notification envoyerInvitationEntretien(
            String candidatEmail,
            String candidatNom,
            String offreTitre,
            String typeEntretien,
            String dateEntretien,
            String heureEntretien,
            String lieu,
            String lien,
            String entretienId
    ) {
        Notification notification = new Notification();
        notification.setType(Notification.TypeNotification.ENTRETIEN_PLANIFIE);
        notification.setDestinataireEmail(candidatEmail);
        notification.setDestinataireNom(candidatNom);
        notification.setSujet("Invitation Entretien - " + offreTitre);
        notification.setEntretienId(entretienId);

        Map<String, Object> variables = new HashMap<>();
        variables.put("candidatNom", candidatNom);
        variables.put("offreTitre", offreTitre);
        variables.put("typeEntretien", typeEntretien);
        variables.put("dateEntretien", dateEntretien);
        variables.put("heureEntretien", heureEntretien);
        variables.put("lieu", lieu);
        variables.put("lien", lien);
        variables.put("anneeActuelle", Year.now().getValue());

        try {
            sendHtmlEmail(
                    candidatEmail,
                    notification.getSujet(),
                    "invitation-entretien",
                    variables
            );
            notification.marquerCommeEnvoye();
        } catch (Exception e) {
            notification.marquerCommeEchec(e.getMessage());
        }

        return notificationRepository.save(notification);
    }

    /**
     * Envoyer un rappel d'entretien (24h avant)
     */
    public Notification envoyerRappelEntretien(
            String candidatEmail,
            String candidatNom,
            String offreTitre,
            String dateEntretien,
            String heureEntretien,
            String lieu,
            String entretienId
    ) {
        Notification notification = new Notification();
        notification.setType(Notification.TypeNotification.ENTRETIEN_RAPPEL);
        notification.setDestinataireEmail(candidatEmail);
        notification.setDestinataireNom(candidatNom);
        notification.setSujet("Rappel : Entretien demain - " + offreTitre);
        notification.setEntretienId(entretienId);

        Map<String, Object> variables = new HashMap<>();
        variables.put("candidatNom", candidatNom);
        variables.put("offreTitre", offreTitre);
        variables.put("dateEntretien", dateEntretien);
        variables.put("heureEntretien", heureEntretien);
        variables.put("lieu", lieu);
        variables.put("anneeActuelle", java.time.Year.now().getValue());

        try {
            sendHtmlEmail(
                    candidatEmail,
                    notification.getSujet(),
                    "rappel-entretien",
                    variables
            );
            notification.marquerCommeEnvoye();
        } catch (Exception e) {
            notification.marquerCommeEchec(e.getMessage());
        }

        return notificationRepository.save(notification);
    }

    /**
     * Notifier acceptation candidature
     */
    public Notification envoyerNotificationAcceptation(
            String candidatEmail,
            String candidatNom,
            String offreTitre,
            String candidatureId
    ) {
        Notification notification = new Notification();
        notification.setType(Notification.TypeNotification.CANDIDATURE_ACCEPTEE);
        notification.setDestinataireEmail(candidatEmail);
        notification.setDestinataireNom(candidatNom);
        notification.setSujet("Félicitations ! Votre candidature a été acceptée");
        notification.setCandidatureId(candidatureId);

        Map<String, Object> variables = new HashMap<>();
        variables.put("candidatNom", candidatNom);
        variables.put("offreTitre", offreTitre);
        variables.put("anneeActuelle", java.time.Year.now().getValue());

        try {
            sendHtmlEmail(
                    candidatEmail,
                    notification.getSujet(),
                    "candidature-acceptee",
                    variables
            );
            notification.marquerCommeEnvoye();
        } catch (Exception e) {
            notification.marquerCommeEchec(e.getMessage());
        }

        return notificationRepository.save(notification);
    }

    /**
     * Obtenir toutes les notifications
     */
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    /**
     * Obtenir les notifications récentes
     */
    public List<Notification> getRecentNotifications() {
        return notificationRepository.findTop20ByOrderByDateCreationDesc();
    }

    /**
     * Obtenir les statistiques
     */
    public Map<String, Long> getStatistics() {
        Map<String, Long> stats = new HashMap<>();

        stats.put("TOTAL", notificationRepository.count());
        stats.put("ENVOYE", notificationRepository.countByStatut(Notification.StatutNotification.ENVOYE));
        stats.put("EN_ATTENTE", notificationRepository.countByStatut(Notification.StatutNotification.EN_ATTENTE));
        stats.put("ECHEC", notificationRepository.countByStatut(Notification.StatutNotification.ECHEC));

        return stats;
    }
}