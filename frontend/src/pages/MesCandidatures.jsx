import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MesCandidatures.css";

export default function MesCandidatures() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("TOUTES");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      
      // Vérifier que l'userId existe
      if (!user?.userId) {
        throw new Error("Utilisateur non connecté");
      }

      const response = await fetch(
        `http://localhost:8080/api/candidatures/candidat/${user.userId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Vérifier si la réponse est OK
      if (!response.ok) {
        if (response.status === 404) {
          // Endpoint non trouvé - initialiser avec tableau vide
          console.warn("Endpoint non trouvé, initialisation avec tableau vide");
          setCandidatures([]);
          return;
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // S'assurer que data est un tableau
      if (Array.isArray(data)) {
        setCandidatures(data);
      } else {
        console.warn("La réponse n'est pas un tableau:", data);
        setCandidatures([]);
      }

    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setError(error.message);
      setCandidatures([]); // S'assurer que c'est un tableau
    } finally {
      setLoading(false);
    }
  };

  // Dans MesCandidatures.js - remplacer getStatutLabel et getStatutColor
const getStatutLabel = (statut) => {
  const labels = {
    NOUVEAU: "Nouveau",
    EN_REVISION: "En révision",
    PRESELECTIONNE: "Présélectionné",
    ENTRETIEN_RH: "Entretien RH",
    TEST_TECHNIQUE: "Test technique",
    ENTRETIEN_FINAL: "Entretien final",
    OFFRE_ENVOYEE: "Offre envoyée",
    ACCEPTE: "Accepté",
    REFUSE: "Refusé",
    RETIRE: "Retiré"
  };
  return labels[statut] || statut;
};

const getStatutColor = (statut) => {
  const colors = {
    NOUVEAU: "#3b82f6",
    EN_REVISION: "#f59e0b",
    PRESELECTIONNE: "#8b5cf6",
    ENTRETIEN_RH: "#ec4899",
    TEST_TECHNIQUE: "#d946ef",
    ENTRETIEN_FINAL: "#a855f7",
    OFFRE_ENVOYEE: "#84cc16",
    ACCEPTE: "#10b981",
    REFUSE: "#ef4444",
    RETIRE: "#6b7280"
  };
  return colors[statut] || "#6b7280";
};

const getStatutIcon = (statut) => {
  const icons = {
    NOUVEAU: "fa-file-alt",
    EN_REVISION: "fa-spinner",
    PRESELECTIONNE: "fa-user-check",
    ENTRETIEN_RH: "fa-handshake",
    TEST_TECHNIQUE: "fa-code",
    ENTRETIEN_FINAL: "fa-star",
    OFFRE_ENVOYEE: "fa-envelope",
    ACCEPTE: "fa-check-circle",
    REFUSE: "fa-times-circle",
    RETIRE: "fa-ban"
  };
  return icons[statut] || "fa-file-alt";
};

  // S'assurer que filteredCandidatures est toujours un tableau
  const filteredCandidatures = Array.isArray(candidatures) 
    ? (filter === "TOUTES" 
        ? candidatures 
        : candidatures.filter((c) => c.statut === filter))
    : [];

  // Calcul des stats avec vérification
  const stats = {
    total: Array.isArray(candidatures) ? candidatures.length : 0,
    enAttente: Array.isArray(candidatures) ? candidatures.filter((c) => c.statut === "EN_ATTENTE").length : 0,
    enCours: Array.isArray(candidatures) ? candidatures.filter((c) => c.statut === "EN_COURS").length : 0,
    entretien: Array.isArray(candidatures) ? candidatures.filter((c) => c.statut === "ENTRETIEN").length : 0,
    acceptees: Array.isArray(candidatures) ? candidatures.filter((c) => c.statut === "ACCEPTE").length : 0,
    refusees: Array.isArray(candidatures) ? candidatures.filter((c) => c.statut === "REFUSE").length : 0
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin fa-3x"></i>
        <p>Chargement de vos candidatures...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle fa-3x"></i>
        <h3>Erreur de chargement</h3>
        <p>{error}</p>
        <button onClick={fetchCandidatures} className="btn-primary">
          <i className="fas fa-redo"></i>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="mes-candidatures">
      {/* Header */}
      <div className="header">
        <h1>
          <i className="fas fa-folder-open"></i>
          Mes Candidatures
        </h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/candidat/offres")}
        >
          <i className="fas fa-plus"></i>
          Nouvelle candidature
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setFilter("TOUTES")}>
          <div className="stat-icon gray">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => setFilter("EN_ATTENTE")}>
          <div className="stat-icon orange">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.enAttente}</h3>
            <p>En attente</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => setFilter("EN_COURS")}>
          <div className="stat-icon blue">
            <i className="fas fa-spinner"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.enCours}</h3>
            <p>En cours</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => setFilter("ENTRETIEN")}>
          <div className="stat-icon purple">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.entretien}</h3>
            <p>Entretiens</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => setFilter("ACCEPTE")}>
          <div className="stat-icon green">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.acceptees}</h3>
            <p>Acceptées</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => setFilter("REFUSE")}>
          <div className="stat-icon red">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.refusees}</h3>
            <p>Refusées</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters">
        <button
          className={`filter-btn ${filter === "TOUTES" ? "active" : ""}`}
          onClick={() => setFilter("TOUTES")}
        >
          Toutes ({stats.total})
        </button>
        <button
          className={`filter-btn ${filter === "EN_ATTENTE" ? "active" : ""}`}
          onClick={() => setFilter("EN_ATTENTE")}
        >
          En attente ({stats.enAttente})
        </button>
        <button
          className={`filter-btn ${filter === "EN_COURS" ? "active" : ""}`}
          onClick={() => setFilter("EN_COURS")}
        >
          En cours ({stats.enCours})
        </button>
        <button
          className={`filter-btn ${filter === "ENTRETIEN" ? "active" : ""}`}
          onClick={() => setFilter("ENTRETIEN")}
        >
          Entretiens ({stats.entretien})
        </button>
        <button
          className={`filter-btn ${filter === "ACCEPTE" ? "active" : ""}`}
          onClick={() => setFilter("ACCEPTE")}
        >
          Acceptées ({stats.acceptees})
        </button>
        <button
          className={`filter-btn ${filter === "REFUSE" ? "active" : ""}`}
          onClick={() => setFilter("REFUSE")}
        >
          Refusées ({stats.refusees})
        </button>
      </div>

      {/* Liste des candidatures */}
      {filteredCandidatures.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-inbox fa-3x"></i>
          <p>
            {filter === "TOUTES"
              ? "Vous n'avez pas encore de candidatures"
              : `Aucune candidature ${getStatutLabel(filter).toLowerCase()}`}
          </p>
          <button
            className="btn-secondary"
            onClick={() => navigate("/candidat/offres")}
          >
            <i className="fas fa-briefcase"></i>
            Consulter les offres
          </button>
        </div>
      ) : (
        <div className="candidatures-list">
          {filteredCandidatures.map((candidature) => (
            <div
              key={candidature.id}
              className="candidature-card"
              onClick={() =>
                navigate(`/candidat/mes-candidatures/${candidature.id}`)
              }
            >
              <div className="candidature-header">
                <div className="candidature-icon">
                  <i className={`fas ${getStatutIcon(candidature.statut)}`}></i>
                </div>
                <div className="candidature-info">
                  <h3>{candidature.offre?.titre || "Titre non disponible"}</h3>
                  <div className="candidature-meta">
                    <span>
                      <i className="fas fa-map-marker-alt"></i>
                      {candidature.offre?.localisation || "Localisation non précisée"}
                    </span>
                    <span>
                      <i className="fas fa-calendar"></i>
                      Postulé le{" "}
                      {candidature.datePostulation 
                        ? new Date(candidature.datePostulation).toLocaleDateString("fr-FR")
                        : "Date inconnue"}
                    </span>
                  </div>
                </div>
                <div
                  className="candidature-statut"
                  style={{
                    backgroundColor: getStatutColor(candidature.statut)
                  }}
                >
                  {getStatutLabel(candidature.statut)}
                </div>
              </div>

              {candidature.lettreMotivation && (
                <p className="candidature-lettre">
                  {candidature.lettreMotivation.substring(0, 120)}...
                </p>
              )}

              <div className="candidature-actions">
                <button className="btn-details">
                  <i className="fas fa-eye"></i>
                  Voir les détails
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}