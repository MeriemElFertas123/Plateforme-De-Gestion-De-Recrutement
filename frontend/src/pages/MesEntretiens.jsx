import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./MesEntretiens.css";
import entretienService from "../services/entretienService";
export default function MesEntretiens() {
  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEntretiens();
  }, []);

  const fetchEntretiens = async () => {
    try {
      const token = localStorage.getItem("token");
      // Récupérer les candidatures du candidat
      const candidaturesRes = await fetch(
        `http://localhost:8080/api/candidatures/candidat/${user.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const candidatures = await candidaturesRes.json();

      // Récupérer les entretiens liés à ces candidatures
      const entretiensPromises = candidatures.map(async (candidature) => {
        const entretiensRes = await fetch(
          `http://localhost:8080/api/entretiens/candidature/${candidature.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = await entretiensRes.json();
        return data.map((e) => ({ ...e, candidature }));
      });

      const allEntretiens = await Promise.all(entretiensPromises);
      const flatEntretiens = allEntretiens.flat();

      // Trier par date
      flatEntretiens.sort(
        (a, b) => new Date(a.dateEntretien) - new Date(b.dateEntretien)
      );

      setEntretiens(flatEntretiens);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    const colors = {
      PLANIFIE: "#3b82f6",
      EN_COURS: "#f59e0b",
      TERMINE: "#10b981",
      ANNULE: "#ef4444"
    };
    return colors[statut] || "#6b7280";
  };

  const getStatutLabel = (statut) => {
    const labels = {
      PLANIFIE: "Planifié",
      EN_COURS: "En cours",
      TERMINE: "Terminé",
      ANNULE: "Annulé"
    };
    return labels[statut] || statut;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  const upcomingEntretiens = entretiens.filter((e) =>
    isUpcoming(e.dateEntretien)
  );
  const pastEntretiens = entretiens.filter((e) => !isUpcoming(e.dateEntretien));

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin fa-3x"></i>
        <p>Chargement de vos entretiens...</p>
      </div>
    );
  }

  return (
    <div className="mes-entretiens">
      {/* Header */}
      <div className="header">
        <h1>
          <i className="fas fa-calendar-check"></i>
          Mes Entretiens
        </h1>
        <div className="stats">
          <span className="stat-badge upcoming">
            {upcomingEntretiens.length} à venir
          </span>
          <span className="stat-badge past">
            {pastEntretiens.length} passés
          </span>
        </div>
      </div>

      {entretiens.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-calendar-times fa-3x"></i>
          <p>Vous n'avez pas encore d'entretiens planifiés</p>
          <p className="empty-subtitle">
            Les entretiens apparaîtront ici lorsque les recruteurs les
            programmeront
          </p>
        </div>
      ) : (
        <>
          {/* Entretiens à venir */}
          {upcomingEntretiens.length > 0 && (
            <div className="section">
              <h2 className="section-title">
                <i className="fas fa-clock"></i>
                Entretiens à venir
              </h2>
              <div className="entretiens-list">
                {upcomingEntretiens.map((entretien) => (
                  <div key={entretien.id} className="entretien-card upcoming">
                    <div className="entretien-header">
                      <div className="entretien-icon">
                        <i className="fas fa-calendar-day"></i>
                      </div>
                      <div className="entretien-info">
                        <h3>{entretien.candidature.offre?.titre}</h3>
                        <p className="entretien-date">
                          <i className="fas fa-clock"></i>
                          {formatDate(entretien.dateEntretien)}
                        </p>
                      </div>
                      <div
                        className="entretien-statut"
                        style={{
                          backgroundColor: getStatutColor(entretien.statut)
                        }}
                      >
                        {getStatutLabel(entretien.statut)}
                      </div>
                    </div>

                    <div className="entretien-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{entretien.lieu || "Lieu non précisé"}</span>
                      </div>
                      {entretien.interviewer && (
                        <div className="detail-item">
                          <i className="fas fa-user-tie"></i>
                          <span>
                            Interviewer : {entretien.interviewer.nom}{" "}
                            {entretien.interviewer.prenom}
                          </span>
                        </div>
                      )}
                    </div>

                    {entretien.commentaires && (
                      <div className="entretien-commentaires">
                        <i className="fas fa-comment-dots"></i>
                        <p>{entretien.commentaires}</p>
                      </div>
                    )}

                    <div className="entretien-actions">
                      <button className="btn-primary">
                        <i className="fas fa-info-circle"></i>
                        Détails de la candidature
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entretiens passés */}
          {pastEntretiens.length > 0 && (
            <div className="section">
              <h2 className="section-title">
                <i className="fas fa-history"></i>
                Entretiens passés
              </h2>
              <div className="entretiens-list">
                {pastEntretiens.map((entretien) => (
                  <div key={entretien.id} className="entretien-card past">
                    <div className="entretien-header">
                      <div className="entretien-icon">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="entretien-info">
                        <h3>{entretien.candidature.offre?.titre}</h3>
                        <p className="entretien-date">
                          <i className="fas fa-calendar"></i>
                          {formatDate(entretien.dateEntretien)}
                        </p>
                      </div>
                      <div
                        className="entretien-statut"
                        style={{
                          backgroundColor: getStatutColor(entretien.statut)
                        }}
                      >
                        {getStatutLabel(entretien.statut)}
                      </div>
                    </div>

                    <div className="entretien-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{entretien.lieu || "Lieu non précisé"}</span>
                      </div>
                    </div>

                    {entretien.evaluation && (
                      <div className="entretien-evaluation">
                        <i className="fas fa-star"></i>
                        <p>Évaluation disponible</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}