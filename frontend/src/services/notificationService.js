import api from './api';

/**
 * Service pour gérer les notifications
 */

// ==================== CRUD ====================

/**
 * Obtenir toutes les notifications
 */
export const getAllNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

/**
 * Obtenir les notifications récentes
 */
export const getRecentNotifications = async () => {
  const response = await api.get('/notifications/recent');
  return response.data;
};

/**
 * Obtenir les statistiques
 */
export const getStatistics = async () => {
  const response = await api.get('/notifications/statistics');
  return response.data;
};

// ==================== ENVOI NOTIFICATIONS ====================

/**
 * Envoyer un email de test
 */
export const sendTestEmail = async (email, nom) => {
  const response = await api.post('/notifications/test', { email, nom });
  return response.data;
};

/**
 * Envoyer notification candidature reçue
 */
export const sendCandidatureRecue = async (data) => {
  const response = await api.post('/notifications/candidature-recue', data);
  return response.data;
};

/**
 * Envoyer invitation entretien
 */
export const sendInvitationEntretien = async (data) => {
  const response = await api.post('/notifications/invitation-entretien', data);
  return response.data;
};

/**
 * Envoyer rappel entretien
 */
export const sendRappelEntretien = async (data) => {
  const response = await api.post('/notifications/rappel-entretien', data);
  return response.data;
};

/**
 * Envoyer notification acceptation
 */
export const sendNotificationAcceptation = async (data) => {
  const response = await api.post('/notifications/acceptation', data);
  return response.data;
};

// ==================== UTILITAIRES ====================

/**
 * Traduire le type de notification
 */
export const getTypeLabel = (type) => {
  const labels = {
    CANDIDATURE_RECUE: 'Candidature reçue',
    CANDIDATURE_ACCEPTEE: 'Candidature acceptée',
    CANDIDATURE_REFUSEE: 'Candidature refusée',
    ENTRETIEN_PLANIFIE: 'Entretien planifié',
    ENTRETIEN_RAPPEL: 'Rappel entretien',
    ENTRETIEN_ANNULE: 'Entretien annulé',
    ENTRETIEN_REPORTE: 'Entretien reporté',
    OFFRE_EMPLOI: 'Offre d\'emploi',
    BIENVENUE: 'Bienvenue',
    AUTRE: 'Autre'
  };
  return labels[type] || type;
};

/**
 * Obtenir la couleur du type
 */
export const getTypeColor = (type) => {
  const colors = {
    CANDIDATURE_RECUE: 'blue',
    CANDIDATURE_ACCEPTEE: 'success',
    CANDIDATURE_REFUSEE: 'error',
    ENTRETIEN_PLANIFIE: 'green',
    ENTRETIEN_RAPPEL: 'warning',
    ENTRETIEN_ANNULE: 'error',
    ENTRETIEN_REPORTE: 'orange',
    OFFRE_EMPLOI: 'purple',
    BIENVENUE: 'cyan',
    AUTRE: 'default'
  };
  return colors[type] || 'default';
};

/**
 * Obtenir l'icône du type
 */
export const getTypeIcon = (type) => {
  const icons = {
    CANDIDATURE_RECUE: '📨',
    CANDIDATURE_ACCEPTEE: '✅',
    CANDIDATURE_REFUSEE: '❌',
    ENTRETIEN_PLANIFIE: '📅',
    ENTRETIEN_RAPPEL: '⏰',
    ENTRETIEN_ANNULE: '🚫',
    ENTRETIEN_REPORTE: '🔄',
    OFFRE_EMPLOI: '💼',
    BIENVENUE: '👋',
    AUTRE: '📧'
  };
  return icons[type] || '📧';
};

/**
 * Traduire le statut
 */
export const getStatutLabel = (statut) => {
  const labels = {
    EN_ATTENTE: 'En attente',
    ENVOYE: 'Envoyé',
    ECHEC: 'Échec',
    LU: 'Lu'
  };
  return labels[statut] || statut;
};

/**
 * Obtenir la couleur du statut
 */
export const getStatutColor = (statut) => {
  const colors = {
    EN_ATTENTE: 'processing',
    ENVOYE: 'success',
    ECHEC: 'error',
    LU: 'default'
  };
  return colors[statut] || 'default';
};

/**
 * Formater la date
 */
export const formatDate = (date) => {
  if (!date) return 'Non spécifié';
  
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default {
  // CRUD
  getAllNotifications,
  getRecentNotifications,
  getStatistics,
  
  // Envoi
  sendTestEmail,
  sendCandidatureRecue,
  sendInvitationEntretien,
  sendRappelEntretien,
  sendNotificationAcceptation,
  
  // Utilitaires
  getTypeLabel,
  getTypeColor,
  getTypeIcon,
  getStatutLabel,
  getStatutColor,
  formatDate
};