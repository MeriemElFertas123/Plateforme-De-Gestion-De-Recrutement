import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./CandidatDashboard.css";

export default function CandidatDashboard() {
  const [stats, setStats] = useState({
    offresDisponibles: 0,
    candidaturesEnCours: 0,
    entretiensAPlanifier: 0,
    candidaturesAcceptees: 0,
    candidaturesRefusees: 0
  });
  const [recentOffres, setRecentOffres] = useState([]);
  const [mesCandidatures, setMesCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Récupérer les offres disponibles
      const offresRes = await fetch("http://localhost:8080/api/offres", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const offres = await offresRes.json();

      // Récupérer mes candidatures
      const candidaturesRes = await fetch(
        `http://localhost:8080/api/candidatures/candidat/${user.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const candidatures = await candidaturesRes.json();

      // Calculer les statistiques
      setStats({
        offresDisponibles: offres.filter((o) => o.statut === "OUVERTE").length,
        candidaturesEnCours: candidatures.filter(
          (c) => c.statut === "EN_ATTENTE" || c.statut === "EN_COURS"
        ).length,
        entretiensAPlanifier: candidatures.filter(
          (c) => c.statut === "ENTRETIEN"
        ).length,
        candidaturesAcceptees: candidatures.filter((c) => c.statut === "ACCEPTE")
          .length,
        candidaturesRefusees: candidatures.filter((c) => c.statut === "REFUSE")
          .length
      });

      // Offres récentes (les 3 dernières)
      setRecentOffres(
        offres
          .filter((o) => o.statut === "OUVERTE")
          .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
          .slice(0, 3)
      );

      // Mes candidatures récentes
      setMesCandidatures(
        candidatures
          .sort((a, b) => new Date(b.datePostulation) - new Date(a.datePostulation))
          .slice(0, 5)
      );
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    const colors = {
      EN_ATTENTE: "#f59e0b",
      EN_COURS: "#3b82f6",
      ENTRETIEN: "#8b5cf6",
      ACCEPTE: "#10b981",
      REFUSE: "#ef4444"
    };
    return colors[statut] || "#6b7280";
  };

  const getStatutLabel = (statut) => {
    const labels = {
      EN_ATTENTE: "En attente",
      EN_COURS: "En cours",
      ENTRETIEN: "Entretien",
      ACCEPTE: "Acceptée",
      REFUSE: "Refusée"
    };
    return labels[statut] || statut;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin fa-3x"></i>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="candidat-dashboard">
      {/* Bannière de bienvenue */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>👋 Bonjour {user?.nom} !</h1>
          <p>Bienvenue sur votre espace candidat</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate("/candidat/offres")}
        >
          <i className="fas fa-search"></i>
          Voir les offres
        </button>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card blue" onClick={() => navigate("/candidat/offres")}>
          <div className="stat-icon">
            <i className="fas fa-briefcase"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.offresDisponibles}</h3>
            <p>Offres disponibles</p>
          </div>
        </div>

        <div className="stat-card orange" onClick={() => navigate("/candidat/mes-candidatures")}>
          <div className="stat-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.candidaturesEnCours}</h3>
            <p>Candidatures en cours</p>
          </div>
        </div>

        <div className="stat-card purple" onClick={() => navigate("/candidat/mes-entretiens")}>
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.entretiensAPlanifier}</h3>
            <p>Entretiens planifiés</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.candidaturesAcceptees}</h3>
            <p>Candidatures acceptées</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Offres récentes */}
        <div className="section-card">
          <div className="section-header">
            <h2>
              <i className="fas fa-fire"></i>
              Offres récentes
            </h2>
            <button
              className="btn-link"
              onClick={() => navigate("/candidat/offres")}
            >
              Voir toutes <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          {recentOffres.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox fa-3x"></i>
              <p>Aucune offre disponible</p>
            </div>
          ) : (
            <div className="offres-grid">
              {recentOffres.map((offre) => (
                <div
                  key={offre.id}
                  className="offre-card"
                  onClick={() => navigate(`/candidat/offres/${offre.id}`)}
                >
                  <div className="offre-header">
                    <h3>{offre.titre}</h3>
                    <span className="offre-type">{offre.typeContrat}</span>
                  </div>
                  <div className="offre-details">
                    <p>
                      <i className="fas fa-map-marker-alt"></i>
                      {offre.localisation}
                    </p>
                    <p>
                      <i className="fas fa-euro-sign"></i>
                      {offre.salaire ? `${offre.salaire}€` : "Non spécifié"}
                    </p>
                  </div>
                  <p className="offre-description">
                    {offre.description?.substring(0, 100)}...
                  </p>
                  <button className="btn-postuler">
                    <i className="fas fa-paper-plane"></i>
                    Postuler
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mes candidatures récentes */}
        <div className="section-card">
          <div className="section-header">
            <h2>
              <i className="fas fa-folder-open"></i>
              Mes candidatures récentes
            </h2>
            <button
              className="btn-link"
              onClick={() => navigate("/candidat/mes-candidatures")}
            >
              Voir toutes <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          {mesCandidatures.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-file-alt fa-3x"></i>
              <p>Aucune candidature</p>
              <button
                className="btn-secondary"
                onClick={() => navigate("/candidat/offres")}
              >
                Commencer à postuler
              </button>
            </div>
          ) : (
            <div className="candidatures-list">
              {mesCandidatures.map((candidature) => (
                <div
                  key={candidature.id}
                  className="candidature-item"
                  onClick={() =>
                    navigate(`/candidat/mes-candidatures/${candidature.id}`)
                  }
                >
                  <div className="candidature-info">
                    <h3>{candidature.offre?.titre}</h3>
                    <p>
                      <i className="fas fa-calendar"></i>
                      Postulé le{" "}
                      {new Date(candidature.datePostulation).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                  <span
                    className="candidature-statut"
                    style={{
                      backgroundColor: getStatutColor(candidature.statut)
                    }}
                  >
                    {getStatutLabel(candidature.statut)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}