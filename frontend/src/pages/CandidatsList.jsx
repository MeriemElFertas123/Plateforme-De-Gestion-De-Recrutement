import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./CandidatsList.css";

export default function CandidatsList() {
  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompetence, setFilterCompetence] = useState("");

  useEffect(() => {
    fetchCandidats();
  }, []);

  const fetchCandidats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/candidats");
      setCandidats(response.data);
      setError("");
    } catch (err) {
      console.error("Erreur:", err);
      setError("Impossible de charger les candidats");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les candidats
  const candidatsFiltres = candidats.filter((candidat) => {
    const matchNom = 
      candidat.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidat.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidat.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCompetence = 
      !filterCompetence || 
      candidat.competences?.some(comp => 
        comp.toLowerCase().includes(filterCompetence.toLowerCase())
      );
    
    return matchNom && matchCompetence;
  });

  // Extraire toutes les compétences uniques
  const toutesCompetences = [...new Set(
    candidats.flatMap(c => c.competences || [])
  )].sort();

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin fa-3x"></i>
        <p>Chargement des candidats...</p>
      </div>
    );
  }

  return (
    <div className="candidats-container">
      {/* Header */}
      <div className="candidats-header">
        <div className="header-left">
          <h1>
            <i className="fas fa-users"></i>
            Base de Candidats
          </h1>
          <p className="subtitle">
            {candidats.length} candidat{candidats.length > 1 ? "s" : ""} dans la base
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-btn"
              onClick={() => setSearchTerm("")}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="filter-group">
          <i className="fas fa-code"></i>
          <select
            value={filterCompetence}
            onChange={(e) => setFilterCompetence(e.target.value)}
          >
            <option value="">Toutes les compétences</option>
            {toutesCompetences.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || filterCompetence) && (
          <button
            className="reset-filters-btn"
            onClick={() => {
              setSearchTerm("");
              setFilterCompetence("");
            }}
          >
            <i className="fas fa-redo"></i>
            Réinitialiser
          </button>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="stats-cards">
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <div>
            <div className="stat-value">{candidats.length}</div>
            <div className="stat-label">Total Candidats</div>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-filter"></i>
          <div>
            <div className="stat-value">{candidatsFiltres.length}</div>
            <div className="stat-label">Résultats filtrés</div>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-code"></i>
          <div>
            <div className="stat-value">{toutesCompetences.length}</div>
            <div className="stat-label">Compétences uniques</div>
          </div>
        </div>
      </div>

      {/* Liste des candidats */}
      {candidatsFiltres.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-user-slash fa-3x"></i>
          <h3>Aucun candidat trouvé</h3>
          <p>Aucun candidat ne correspond à vos critères de recherche.</p>
        </div>
      ) : (
        <div className="candidats-grid">
          {candidatsFiltres.map((candidat) => (
            <div key={candidat.id} className="candidat-card">
              {/* Avatar */}
              <div className="candidat-avatar">
                {candidat.prenom?.[0]}{candidat.nom?.[0]}
              </div>

              {/* Infos principales */}
              <div className="candidat-info">
                <h3 className="candidat-name">
                  {candidat.prenom} {candidat.nom}
                </h3>
                <div className="candidat-email">
                  <i className="fas fa-envelope"></i>
                  {candidat.email}
                </div>
                {candidat.telephone && (
                  <div className="candidat-phone">
                    <i className="fas fa-phone"></i>
                    {candidat.telephone}
                  </div>
                )}
              </div>

              {/* Compétences */}
              {candidat.competences && candidat.competences.length > 0 && (
                <div className="candidat-competences">
                  <div className="competences-label">
                    <i className="fas fa-code"></i>
                    Compétences
                  </div>
                  <div className="competences-tags">
                    {candidat.competences.slice(0, 5).map((comp, idx) => (
                      <span key={idx} className="competence-tag">
                        {comp}
                      </span>
                    ))}
                    {candidat.competences.length > 5 && (
                      <span className="competence-tag more">
                        +{candidat.competences.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Statistiques */}
              <div className="candidat-stats">
                <div className="stat-item">
                  <i className="fas fa-file-alt"></i>
                  <span>
                    {candidat.nombreCandidatures || 0} candidature
                    {candidat.nombreCandidatures > 1 ? "s" : ""}
                  </span>
                </div>
                {candidat.cvUrl && (
                  <div className="stat-item">
                    <i className="fas fa-file-pdf"></i>
                    <a 
                      href={candidat.cvUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="cv-link"
                    >
                      Voir CV
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="candidat-actions">
                <Link
                  to={`/candidats/${candidat.id}`}
                  className="btn-view"
                >
                  <i className="fas fa-eye"></i>
                  Voir le profil
                </Link>
              </div>

              {/* Date d'inscription */}
              {candidat.dateInscription && (
                <div className="candidat-date">
                  <i className="fas fa-calendar-plus"></i>
                  Inscrit le {new Date(candidat.dateInscription).toLocaleDateString("fr-FR")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}