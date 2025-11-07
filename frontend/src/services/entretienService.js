import api from './api';

/**
 * Service pour gérer les entretiens
 */

// ==================== CRUD DE BASE ====================

/**
 * Créer un entretien
 */
export const createEntretien = async (entretien) => {
  const response = await api.post('/entretiens', entretien);
  return response.data;
};

/**
 * Obtenir tous les entretiens
 */
export const getAllEntretiens = async () => {
  const response = await api.get('/entretiens');
  return response.data;
};

/**
 * Obtenir un entretien par ID
 */
export const getEntretienById = async (id) => {
  const response = await api.get(`/entretiens/${id}`);
  return response.data;
};

/**
 * Mettre à jour un entretien
 */
export const updateEntretien = async (id, entretien) => {
  const response = await api.put(`/entretiens/${id}`, entretien);
  return response.data;
};

/**
 * Supprimer un entretien
 */
export const deleteEntretien = async (id) => {
  const response = await api.delete(`/entretiens/${id}`);
  return response.data;
};

// ==================== RECHERCHE ====================

/**
 * Obtenir les entretiens d'une candidature
 */
export const getEntretiensByCandidature = async (candidatureId) => {
  const response = await api.get(`/entretiens/candidature/${candidatureId}`);
  return response.data;
};

/**
 * Obtenir les entretiens d'un candidat
 */
export const getEntretiensByCandidat = async (candidatId) => {
  try {
    // Récupérer toutes les candidatures du candidat
    const candidaturesRes = await api.get(`/candidatures/candidat/${candidatId}`);
    const candidatures = candidaturesRes.data;
    
    // Récupérer tous les entretiens
    const entretiensRes = await api.get('/entretiens');
    const tousEntretiens = entretiensRes.data;
    
    // Filtrer les entretiens qui appartiennent aux candidatures du candidat
    const candidatureIds = candidatures.map(c => c.id);
    return tousEntretiens.filter(entretien => 
      candidatureIds.includes(entretien.candidatureId)
    ).map(entretien => ({
      ...entretien,
      candidature: candidatures.find(c => c.id === entretien.candidatureId)
    }));
  } catch (error) {
    console.error('Erreur récupération entretiens candidat:', error);
    throw error;
  }
};

/**
 * Obtenir les entretiens par statut
 */
export const getEntretiensByStatut = async (statut) => {
  const response = await api.get(`/entretiens/statut/${statut}`);
  return response.data;
};

/**
 * Obtenir les entretiens d'aujourd'hui
 */
export const getEntretiensAujourdhui = async () => {
  const response = await api.get('/entretiens/aujourdhui');
  return response.data;
};

/**
 * Obtenir les entretiens à venir
 */
export const getEntretiensAVenir = async () => {
  const response = await api.get('/entretiens/a-venir');
  return response.data;
};

/**
 * Obtenir les entretiens passés
 */
export const getEntretiensPasses = async () => {
  const response = await api.get('/entretiens/passes');
  return response.data;
};

/**
 * Obtenir les entretiens par période
 */
export const getEntretiensByPeriode = async (debut, fin) => {
  const response = await api.get('/entretiens/periode', {
    params: { debut, fin }
  });
  return response.data;
};

/**
 * Obtenir les entretiens avec pagination
 */
export const getEntretiensPaginated = async (page = 0, size = 10) => {
  const response = await api.get('/entretiens/paginated', {
    params: { page, size }
  });
  return response.data;
};

// ==================== ACTIONS ====================

/**
 * Changer le statut d'un entretien
 */
export const changerStatut = async (id, nouveauStatut) => {
  const response = await api.patch(`/entretiens/${id}/statut`, null, {
    params: { nouveauStatut }
  });
  return response.data;
};

/**
 * Ajouter une évaluation
 */
export const ajouterEvaluation = async (id, evaluation) => {
  const response = await api.post(`/entretiens/${id}/evaluations`, evaluation);
  return response.data;
};

/**
 * Obtenir les statistiques
 */
export const getStatistics = async () => {
  const response = await api.get('/entretiens/statistics');
  return response.data;
};

// ==================== UTILITAIRES ====================

/**
 * Traduire le type d'entretien
 */
export const getTypeLabel = (type) => {
  const labels = {
    ENTRETIEN_RH: 'Entretien RH',
    ENTRETIEN_TECHNIQUE: 'Entretien Technique',
    ENTRETIEN_MANAGER: 'Entretien Manager',
    ENTRETIEN_FINAL: 'Entretien Final',
    TEST_TECHNIQUE: 'Test Technique',
    ASSESSMENT_CENTER: 'Assessment Center',
    AUTRE: 'Autre'
  };
  return labels[type] || type;
};

/**
 * Traduire le statut
 */
export const getStatutLabel = (statut) => {
  const labels = {
    PLANIFIE: 'Planifié',
    CONFIRME: 'Confirmé',
    EN_COURS: 'En cours',
    TERMINE: 'Terminé',
    EVALUE: 'Évalué',
    ANNULE: 'Annulé',
    REPORTE: 'Reporté'
  };
  return labels[statut] || statut;
};

/**
 * Obtenir la couleur du badge selon le statut
 */
export const getStatutColor = (statut) => {
  const colors = {
    PLANIFIE: '#3b82f6',
    CONFIRME: '#10b981',
    EN_COURS: '#f59e0b',
    TERMINE: '#6b7280',
    EVALUE: '#8b5cf6',
    ANNULE: '#ef4444',
    REPORTE: '#f97316'
  };
  return colors[statut] || 'default';
};

/**
 * Traduire le type de lieu
 */
export const getTypeLieuLabel = (typeLieu) => {
  const labels = {
    PRESENTIEL: 'Présentiel',
    VISIO: 'Visioconférence',
    TELEPHONIQUE: 'Téléphonique'
  };
  return labels[typeLieu] || typeLieu;
};

/**
 * Obtenir l'icône du type de lieu
 */
export const getTypeLieuIcon = (typeLieu) => {
  const icons = {
    PRESENTIEL: '🏢',
    VISIO: '💻',
    TELEPHONIQUE: '📞'
  };
  return icons[typeLieu] || '📍';
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
 * Formater l'heure
 */
export const formatHeure = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculer la durée formatée
 */
export const formatDuree = (minutes) => {
  if (!minutes) return '';
  
  const heures = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (heures > 0 && mins > 0) {
    return `${heures}h${mins}`;
  } else if (heures > 0) {
    return `${heures}h`;
  } else {
    return `${mins}min`;
  }
};

/**
 * Vérifier si l'entretien est aujourd'hui
 */
export const estAujourdhui = (date) => {
  if (!date) return false;
  
  const d = new Date(date);
  const today = new Date();
  
  return d.toDateString() === today.toDateString();
};

/**
 * Vérifier si l'entretien est passé
 */
export const estPasse = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Obtenir le temps avant l'entretien
 */
export const getTempsAvant = (date) => {
  if (!date) return '';
  
  const maintenant = new Date();
  const debut = new Date(date);
  const diffMs = debut - maintenant;
  
  if (diffMs < 0) return 'Passé';
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHeures = Math.floor(diffMs / (1000 * 60 * 60));
  const diffJours = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffJours > 0) {
    return `Dans ${diffJours} jour${diffJours > 1 ? 's' : ''}`;
  } else if (diffHeures > 0) {
    return `Dans ${diffHeures}h`;
  } else if (diffMinutes > 0) {
    return `Dans ${diffMinutes}min`;
  } else {
    return 'Imminent';
  }
};

export default {
  // CRUD
  createEntretien,
  getAllEntretiens,
  getEntretienById,
  updateEntretien,
  deleteEntretien,
  
  // Recherche
  getEntretiensByCandidature,
  getEntretiensByCandidat,
  getEntretiensByStatut,
  getEntretiensAujourdhui,
  getEntretiensAVenir,
  getEntretiensPasses,
  getEntretiensByPeriode,
  getEntretiensPaginated,
  
  // Actions
  changerStatut,
  ajouterEvaluation,
  getStatistics,
  
  // Utilitaires
  getTypeLabel,
  getStatutLabel,
  getStatutColor,
  getTypeLieuLabel,
  getTypeLieuIcon,
  formatDate,
  formatHeure,
  formatDuree,
  estAujourdhui,
  estPasse,
  getTempsAvant
};