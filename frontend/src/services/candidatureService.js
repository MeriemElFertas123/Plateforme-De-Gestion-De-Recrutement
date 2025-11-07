import api from './api';

/**
 * Service pour gérer les candidatures
 */

// ==================== CRUD DE BASE ====================

/**
 * Créer une candidature (avec upload de CV)
 */
export const createCandidature = async (formData) => {
  const response = await api.post('/candidatures', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

/**
 * Obtenir toutes les candidatures
 */
export const getAllCandidatures = async () => {
  const response = await api.get('/candidatures');
  return response.data;
};

/**
 * Obtenir une candidature par ID
 */
export const getCandidatureById = async (id) => {
  const response = await api.get(`/candidatures/${id}`);
  return response.data;
};

/**
 * Supprimer une candidature
 */
export const deleteCandidature = async (id) => {
  const response = await api.delete(`/candidatures/${id}`);
  return response.data;
};

// ==================== RECHERCHE & FILTRAGE ====================

/**
 * Obtenir les candidatures d'une offre
 */
export const getCandidaturesByOffre = async (offreId) => {
  const response = await api.get(`/candidatures/offre/${offreId}`);
  return response.data;
};

/**
 * Obtenir les candidatures par statut
 */
export const getCandidaturesByStatut = async (statut) => {
  const response = await api.get(`/candidatures/statut/${statut}`);
  return response.data;
};

/**
 * Filtrer les candidatures
 */
export const filterCandidatures = async (filters) => {
  const response = await api.get('/candidatures/filter', {
    params: filters // { offreId, statut, scoreMin }
  });
  return response.data;
};

/**
 * Obtenir les candidatures avec pagination
 */
export const getCandidaturesPaginated = async (page = 0, size = 10) => {
  const response = await api.get('/candidatures/paginated', {
    params: { page, size }
  });
  return response.data;
};

/**
 * Obtenir les candidatures récentes
 */
export const getRecentCandidatures = async (limit = 10) => {
  const response = await api.get('/candidatures/recent', {
    params: { limit }
  });
  return response.data;
};

// ==================== GESTION DE STATUT ====================

/**
 * Changer le statut d'une candidature
 */
export const changerStatut = async (id, nouveauStatut, commentaire = '') => {
  const response = await api.patch(`/candidatures/${id}/statut`, null, {
    params: { nouveauStatut, commentaire }
  });
  return response.data;
};

/**
 * Ajouter un commentaire
 */
export const ajouterCommentaire = async (id, contenu, prive = false) => {
  const response = await api.post(`/candidatures/${id}/commentaires`, {
    contenu,
    prive
  });
  return response.data;
};

// ==================== STATISTIQUES ====================

/**
 * Obtenir les statistiques des candidatures
 */
export const getStatistics = async () => {
  const response = await api.get('/candidatures/statistics');
  return response.data;
};

// ==================== UTILITAIRES ====================

/**
 * Traduire le statut
 */
export const getStatutLabel = (statut) => {
  const labels = {
    NOUVEAU: 'Nouveau',
    EN_REVISION: 'En révision',
    PRESELECTIONNE: 'Présélectionné',
    ENTRETIEN_RH: 'Entretien RH',
    TEST_TECHNIQUE: 'Test technique',
    ENTRETIEN_FINAL: 'Entretien final',
    OFFRE_ENVOYEE: 'Offre envoyée',
    ACCEPTE: 'Accepté',
    REFUSE: 'Refusé',
    RETIRE: 'Retiré'
  };
  return labels[statut] || statut;
};

/**
 * Obtenir la couleur du badge selon le statut
 */
export const getStatutColor = (statut) => {
  const colors = {
    NOUVEAU: 'blue',
    EN_REVISION: 'cyan',
    PRESELECTIONNE: 'purple',
    ENTRETIEN_RH: 'orange',
    TEST_TECHNIQUE: 'orange',
    ENTRETIEN_FINAL: 'gold',
    OFFRE_ENVOYEE: 'lime',
    ACCEPTE: 'success',
    REFUSE: 'error',
    RETIRE: 'default'
  };
  return colors[statut] || 'default';
};

/**
 * Obtenir la couleur du score
 */
export const getScoreColor = (score) => {
  if (score >= 80) return '#52c41a'; // Vert
  if (score >= 60) return '#faad14'; // Orange
  if (score >= 40) return '#ff7875'; // Rouge clair
  return '#f5222d'; // Rouge
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

/**
 * Traduire la source
 */
export const getSourceLabel = (source) => {
  const labels = {
    SITE_CARRIERE: 'Site carrière',
    LINKEDIN: 'LinkedIn',
    INDEED: 'Indeed',
    COOPTATION: 'Cooptation',
    SPONTANEE: 'Spontanée',
    AUTRE: 'Autre'
  };
  return labels[source] || source;
};

/**
 * Calculer le temps écoulé depuis la candidature
 */
export const getTempsEcoule = (datePostulation) => {
  if (!datePostulation) return '';
  
  const now = new Date();
  const date = new Date(datePostulation);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else if (diffMinutes > 0) {
    return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else {
    return 'À l\'instant';
  }
};

export default {
  // CRUD
  createCandidature,
  getAllCandidatures,
  getCandidatureById,
  deleteCandidature,
  
  // Recherche
  getCandidaturesByOffre,
  getCandidaturesByStatut,
  filterCandidatures,
  getCandidaturesPaginated,
  getRecentCandidatures,
  
  // Statut
  changerStatut,
  ajouterCommentaire,
  
  // Stats
  getStatistics,
  
  // Utilitaires
  getStatutLabel,
  getStatutColor,
  getScoreColor,
  formatDate,
  getSourceLabel,
  getTempsEcoule
};