import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./InterviewerDashboard.css";

export default function InterviewerDashboard() {
  const [stats, setStats] = useState({
    entretiensAujourdhui: 0,
    entretiensASemaine: 0,
    entretiensTotal: 0,
    candidatsAEvaluer: 0,
    evaluationsEnAttente: 0,
    evaluationsTerminees: 0
  });
  const [prochainEntretiens, setProchainEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [user]); // Ajoutez user comme dépendance

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🔥 CORRECTION : Utilisez user.userId au lieu de user.id
      if (!user || !user.userId) {
        console.warn("Utilisateur non connecté ou ID manquant");
        setError("Utilisateur non connecté");
        return;
      }

      const token = localStorage.getItem("token");
      
      // Récupérer les entretiens de l'interviewer
      const entretiensRes = await fetch(
        `http://localhost:8080/api/entretiens/interviewer/${user.userId}`, // 🔥 user.userId
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!entretiensRes.ok) {
        throw new Error(`Erreur HTTP: ${entretiensRes.status}`);
      }

      const entretiens = await entretiensRes.json();

      // Calculer les statistiques
      const aujourdhui = new Date().toDateString();
      const dansSemaine = new Date();
      dansSemaine.setDate(dansSemaine.getDate() + 7);

      const entretiensAujourdhui = entretiens.filter(
        (e) => e.dateEntretien && new Date(e.dateEntretien).toDateString() === aujourdhui
      ).length;

      const entretiensASemaine = entretiens.filter((e) => {
        if (!e.dateEntretien) return false;
        const date = new Date(e.dateEntretien);
        return date >= new Date() && date <= dansSemaine;
      }).length;

      // Trier et prendre les 5 prochains entretiens
      const prochains = entretiens
        .filter((e) => e.dateEntretien && new Date(e.dateEntretien) >= new Date())
        .sort((a, b) => new Date(a.dateEntretien) - new Date(b.dateEntretien))
        .slice(0, 5);

      setStats({
        entretiensAujourdhui,
        entretiensASemaine,
        entretiensTotal: entretiens.length,
        candidatsAEvaluer: entretiens.filter((e) => e.statut === "PLANIFIE").length,
        evaluationsEnAttente: entretiens.filter((e) => e.statut === "TERMINE" && !e.evaluation).length,
        evaluationsTerminees: entretiens.filter((e) => e.evaluation).length
      });

      setProchainEntretiens(prochains);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setError("Erreur lors du chargement des données");
      
      // Données par défaut en cas d'erreur
      setStats({
        entretiensAujourdhui: 0,
        entretiensASemaine: 0,
        entretiensTotal: 0,
        candidatsAEvaluer: 0,
        evaluationsEnAttente: 0,
        evaluationsTerminees: 0
      });
      setProchainEntretiens([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date non définie";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Date invalide";
    }
  };

  const getStatutColor = (statut) => {
    const colors = {
      PLANIFIE: "#3b82f6",
      EN_COURS: "#f59e0b",
      TERMINE: "#10b981",
      ANNULE: "#ef4444",
      CONFIRME: "#8b5cf6",
      REPORTE: "#6b7280"
    };
    return colors[statut] || "#6b7280";
  };

  // Affichage d'erreur
  if (error) {
    return (
      <div className="interviewer-dashboard">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle fa-3x"></i>
          <h2>Erreur de chargement</h2>
          <p>{error}</p>
          <button 
            className="btn-primary" 
            onClick={fetchDashboardData}
          >
            <i className="fas fa-redo"></i>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin fa-3x"></i>
        <p>Chargement de vos entretiens...</p>
      </div>
    );
  }

  return (
    <div className="interviewer-dashboard">
      {/* Message de bienvenue */}
      <div className="welcome-card">
        <div className="welcome-content">
          <h1>
            <i className="fas fa-hand-wave" style={{ marginRight: '10px' }}></i>
            Bonjour, {user?.prenom || user?.nom || "Interviewer"} !
          </h1>
          <p>Voici un aperçu de vos entretiens et évaluations</p>
        </div>
        <div className="welcome-actions">
          <button
            className="btn-primary"
            onClick={() => navigate("/interviewer/entretiens")}
          >
            <i className="fas fa-calendar-alt"></i>
            Voir mes entretiens
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/interviewer/evaluations")}
          >
            <i className="fas fa-clipboard-check"></i>
            Mes évaluations
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.entretiensAujourdhui}</h3>
            <p>Entretiens aujourd'hui</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <i className="fas fa-calendar-week"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.entretiensASemaine}</h3>
            <p>Cette semaine</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <i className="fas fa-user-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.candidatsAEvaluer}</h3>
            <p>Candidats à évaluer</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.evaluationsTerminees}</h3>
            <p>Évaluations terminées</p>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.evaluationsEnAttente}</h3>
            <p>Évaluations en attente</p>
          </div>
        </div>

        <div className="stat-card gray">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.entretiensTotal}</h3>
            <p>Total des entretiens</p>
          </div>
        </div>
      </div>

      {/* Prochains entretiens */}
      <div className="section-card">
        <div className="section-header">
          <h2>
            <i className="fas fa-clock"></i>
            Prochains Entretiens
          </h2>
          <button
            className="btn-link"
            onClick={() => navigate("/interviewer/entretiens")}
          >
            Voir tous <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        {prochainEntretiens.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-calendar-times fa-3x"></i>
            <p>Aucun entretien planifié</p>
            <button 
              className="btn-primary"
              onClick={() => navigate("/interviewer/entretiens")}
            >
              <i className="fas fa-plus"></i>
              Voir tous les entretiens
            </button>
          </div>
        ) : (
          <div className="entretiens-list">
            {prochainEntretiens.map((entretien) => (
              <div
                key={entretien.id}
                className="entretien-card"
                onClick={() => navigate(`/interviewer/entretiens/${entretien.id}`)}
              >
                <div className="entretien-date">
                  <i className="fas fa-calendar-alt"></i>
                  <span>{formatDate(entretien.dateEntretien)}</span>
                </div>
                <div className="entretien-details">
                  <h3>
                    {entretien.candidature?.candidat?.prenom || "Prénom"} {entretien.candidature?.candidat?.nom || "Nom"}
                  </h3>
                  <p>
                    <i className="fas fa-briefcase"></i>
                    {entretien.candidature?.offre?.titre || "Poste non spécifié"}
                  </p>
                  <p>
                    <i className="fas fa-map-marker-alt"></i>
                    {entretien.lieu || "Lieu non spécifié"}
                  </p>
                </div>
                <div
                  className="entretien-status"
                  style={{ backgroundColor: getStatutColor(entretien.statut) }}
                >
                  {entretien.statut ? entretien.statut.replace("_", " ") : "N/A"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h2>
          <i className="fas fa-bolt"></i>
          Actions Rapides
        </h2>
        <div className="actions-grid">
          <button
            className="action-btn"
            onClick={() => navigate("/interviewer/candidatures")}
          >
            <i className="fas fa-users"></i>
            <span>Voir les candidats</span>
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/interviewer/evaluations")}
          >
            <i className="fas fa-clipboard-list"></i>
            <span>Créer une évaluation</span>
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/interviewer/calendar")}
          >
            <i className="fas fa-calendar"></i>
            <span>Mon calendrier</span>
          </button>
          <button
            className="action-btn"
            onClick={fetchDashboardData}
          >
            <i className="fas fa-sync-alt"></i>
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Debug info (optionnel) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>Debug:</strong> User ID: {user?.userId} | Role: {user?.role}
        </div>
      )}
    </div>
  );
}