import api from './api';

/**
 * Service pour gérer les analytics
 */

// ==================== ENDPOINTS ====================

/**
 * Obtenir les statistiques du dashboard
 */
export const getDashboardStats = async () => {
  const response = await api.get('/analytics/dashboard');
  return response.data;
};

/**
 * Obtenir l'évolution des candidatures (12 mois)
 */
export const getEvolutionCandidatures = async () => {
  const response = await api.get('/analytics/evolution-candidatures');
  return response.data;
};

/**
 * Obtenir la répartition par statut
 */
export const getRepartitionParStatut = async () => {
  const response = await api.get('/analytics/repartition-statut');
  return response.data;
};

/**
 * Obtenir le top 5 des offres
 */
export const getTopOffres = async () => {
  const response = await api.get('/analytics/top-offres');
  return response.data;
};

/**
 * Obtenir la répartition des entretiens par type
 */
export const getRepartitionEntretiens = async () => {
  const response = await api.get('/analytics/repartition-entretiens');
  return response.data;
};

/**
 * Obtenir les sources de candidatures
 */
export const getSourcesCandidatures = async () => {
  const response = await api.get('/analytics/sources-candidatures');
  return response.data;
};

/**
 * Obtenir la distribution des scores
 */
export const getDistributionScores = async () => {
  const response = await api.get('/analytics/distribution-scores');
  return response.data;
};

/**
 * Obtenir les statistiques des entretiens
 */
export const getStatsEntretiens = async () => {
  const response = await api.get('/analytics/stats-entretiens');
  return response.data;
};

/**
 * Obtenir la performance des recruteurs
 */
export const getPerformanceRecruteurs = async () => {
  const response = await api.get('/analytics/performance-recruteurs');
  return response.data;
};

/**
 * Obtenir l'activité récente
 */
export const getActiviteRecente = async (limit = 10) => {
  const response = await api.get('/analytics/activite-recente', {
    params: { limit }
  });
  return response.data;
};

// ==================== UTILITAIRES ====================

/**
 * Formater un grand nombre
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Formater un pourcentage
 */
export const formatPercentage = (value) => {
  return `${Math.round(value * 100) / 100}%`;
};

/**
 * Obtenir la couleur selon le statut
 */
export const getStatutColor = (statut) => {
  const colors = {
    NOUVEAU: '#1890ff',
    EN_REVISION: '#13c2c2',
    PRESELECTIONNE: '#722ed1',
    ENTRETIEN_RH: '#fa8c16',
    TEST_TECHNIQUE: '#faad14',
    ENTRETIEN_FINAL: '#fadb14',
    OFFRE_ENVOYEE: '#a0d911',
    ACCEPTE: '#52c41a',
    REFUSE: '#ff4d4f',
    RETIRE: '#8c8c8c'
  };
  return colors[statut] || '#1890ff';
};

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
 * Traduire le type d'entretien
 */
export const getTypeEntretienLabel = (type) => {
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
 * Calculer la tendance (hausse/baisse)
 */
export const calculateTrend = (current, previous) => {
  if (previous === 0) return { value: 0, direction: 'neutral' };
  
  const diff = current - previous;
  const percentage = (diff / previous) * 100;
  
  return {
    value: Math.abs(Math.round(percentage)),
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral'
  };
};

/**
 * Palette de couleurs pour graphiques
 */
export const CHART_COLORS = [
  '#1890ff', // Bleu
  '#52c41a', // Vert
  '#faad14', // Orange
  '#722ed1', // Violet
  '#13c2c2', // Cyan
  '#fa8c16', // Orange foncé
  '#eb2f96', // Rose
  '#a0d911', // Lime
  '#2f54eb', // Bleu foncé
  '#fa541c'  // Rouge orangé
];

/**
 * Formater la date pour les graphiques
 */
export const formatDateForChart = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export default {
  // Endpoints
  getDashboardStats,
  getEvolutionCandidatures,
  getRepartitionParStatut,
  getTopOffres,
  getRepartitionEntretiens,
  getSourcesCandidatures,
  getDistributionScores,
  getStatsEntretiens,
  getPerformanceRecruteurs,
  getActiviteRecente,
  
  // Utilitaires
  formatNumber,
  formatPercentage,
  getStatutColor,
  getStatutLabel,
  getSourceLabel,
  getTypeEntretienLabel,
  calculateTrend,
  CHART_COLORS,
  formatDateForChart
};
