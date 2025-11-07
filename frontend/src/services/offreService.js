import api from './api';

/**
 * Service pour gérer les offres d'emploi
 */

// ==================== CRUD DE BASE ====================

/**
 * Créer une nouvelle offre
 */
export const createOffre = async (offreData) => {
  const response = await api.post('/offres', offreData);
  return response.data;
};

/**
 * Obtenir toutes les offres
 */
export const getAllOffres = async () => {
  const response = await api.get('/offres');
  return response.data;
};

/**
 * Obtenir une offre par ID
 */
export const getOffreById = async (id) => {
  const response = await api.get(`/offres/${id}`);
  return response.data;
};

/**
 * Mettre à jour une offre
 */
export const updateOffre = async (id, offreData) => {
  const response = await api.put(`/offres/${id}`, offreData);
  return response.data;
};

/**
 * Supprimer une offre
 */
export const deleteOffre = async (id) => {
  const response = await api.delete(`/offres/${id}`);
  return response.data;
};

// ==================== RECHERCHE & FILTRAGE ====================

/**
 * Obtenir les offres avec pagination
 */
export const getOffresPaginated = async (page = 0, size = 10, sortBy = 'dateCreation') => {
  const response = await api.get('/offres/paginated', {
    params: { page, size, sortBy }
  });
  return response.data;
};

/**
 * Rechercher des offres par mot-clé
 */
export const searchOffres = async (keyword, page = 0, size = 10) => {
  const response = await api.get('/offres/search', {
    params: { keyword, page, size }
  });
  return response.data;
};

/**
 * Filtrer les offres
 */
export const filterOffres = async (filters) => {
  const response = await api.get('/offres/filter', {
    params: filters // { statut, typeContrat, departement, localisation }
  });
  return response.data;
};

/**
 * Rechercher par compétences
 */
export const searchByCompetences = async (competences) => {
  const response = await api.post('/offres/search/competences', competences);
  return response.data;
};

// ==================== PAR STATUT ====================

/**
 * Obtenir les offres par statut
 */
export const getOffresByStatut = async (statut) => {
  const response = await api.get(`/offres/statut/${statut}`);
  return response.data;
};

/**
 * Obtenir les offres actives
 */
export const getOffresActives = async () => {
  const response = await api.get('/offres/actives');
  return response.data;
};

/**
 * Obtenir mes offres (créées par l'utilisateur connecté)
 */
export const getMesOffres = async () => {
  const response = await api.get('/offres/mes-offres');
  return response.data;
};

// ==================== GESTION DE STATUT ====================

/**
 * Publier une offre
 */
export const publierOffre = async (id) => {
  const response = await api.patch(`/offres/${id}/publier`);
  return response.data;
};

/**
 * Archiver une offre
 */
export const archiverOffre = async (id) => {
  const response = await api.patch(`/offres/${id}/archiver`);
  return response.data;
};

/**
 * Marquer une offre comme pourvue
 */
export const marquerCommePourvue = async (id) => {
  const response = await api.patch(`/offres/${id}/pourvue`);
  return response.data;
};

// ==================== STATISTIQUES ====================

/**
 * Obtenir les statistiques d'une offre
 */
export const getOffreStats = async (id) => {
  const response = await api.get(`/offres/${id}/stats`);
  return response.data;
};

/**
 * Obtenir le nombre d'offres par statut
 */
export const getOffresCountByStatut = async () => {
  const response = await api.get('/offres/statistics/count-by-statut');
  return response.data;
};

/**
 * Vérifier les offres expirées
 */
export const checkExpiredOffres = async () => {
  const response = await api.post('/offres/check-expired');
  return response.data;
};

// ==================== UTILITAIRES ====================

/**
 * Formater le salaire pour l'affichage
 */
export const formatSalaire = (min, max, devise = 'EUR') => {
  const symbol = devise === 'EUR' ? '€' : devise === 'USD' ? '$' : devise;
  
  if (min && max) {
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${symbol}`;
  } else if (min) {
    return `À partir de ${min.toLocaleString()} ${symbol}`;
  } else if (max) {
    return `Jusqu'à ${max.toLocaleString()} ${symbol}`;
  }
  
  return 'Non spécifié';
};

/**
 * Traduire le type de contrat
 */
export const getTypeContratLabel = (typeContrat) => {
  const labels = {
    CDI: 'CDI',
    CDD: 'CDD',
    STAGE: 'Stage',
    ALTERNANCE: 'Alternance',
    FREELANCE: 'Freelance',
    INTERIM: 'Intérim'
  };
  return labels[typeContrat] || typeContrat;
};

/**
 * Traduire le statut de l'offre
 */
export const getStatutLabel = (statut) => {
  const labels = {
    BROUILLON: 'Brouillon',
    PUBLIEE: 'Publiée',
    EXPIREE: 'Expirée',
    POURVUE: 'Pourvue',
    ARCHIVEE: 'Archivée'
  };
  return labels[statut] || statut;
};

/**
 * Obtenir la couleur du badge selon le statut
 */
export const getStatutColor = (statut) => {
  const colors = {
    BROUILLON: 'default',
    PUBLIEE: 'success',
    EXPIREE: 'warning',
    POURVUE: 'processing',
    ARCHIVEE: 'default'
  };
  return colors[statut] || 'default';
};

/**
 * Calculer le nombre de jours restants
 */
export const getJoursRestants = (dateExpiration) => {
  if (!dateExpiration) return null;
  
  const today = new Date();
  const expiration = new Date(dateExpiration);
  const diffTime = expiration - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Formater la date pour l'affichage
 */
export const formatDate = (date) => {
  if (!date) return 'Non spécifié';
  
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default {
  // CRUD
  createOffre,
  getAllOffres,
  getOffreById,
  updateOffre,
  deleteOffre,
  
  // Recherche
  getOffresPaginated,
  searchOffres,
  filterOffres,
  searchByCompetences,
  
  // Statut
  getOffresByStatut,
  getOffresActives,
  getMesOffres,
  publierOffre,
  archiverOffre,
  marquerCommePourvue,
  
  // Stats
  getOffreStats,
  getOffresCountByStatut,
  checkExpiredOffres,
  
  // Utilitaires
  formatSalaire,
  getTypeContratLabel,
  getStatutLabel,
  getStatutColor,
  getJoursRestants,
  formatDate
};
