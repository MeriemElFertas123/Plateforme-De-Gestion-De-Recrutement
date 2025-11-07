import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './KanbanBoard.css';

function KanbanBoard() {
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState(null);

  const colonnes = [
    { id: 'EN_ATTENTE', titre: 'En Attente', icon: 'clock', color: '#6b7280' },
    { id: 'EN_COURS', titre: 'En Cours', icon: 'spinner', color: '#3b82f6' },
    { id: 'ENTRETIEN', titre: 'Entretien', icon: 'calendar-check', color: '#f59e0b' },
    { id: 'ACCEPTE', titre: 'Accepté', icon: 'check-circle', color: '#10b981' },
    { id: 'REFUSE', titre: 'Refusé', icon: 'times-circle', color: '#ef4444' }
  ];

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/candidatures', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidatures(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, candidature) => {
    setDraggedCard(candidature);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, nouveauStatut) => {
    e.preventDefault();
    
    if (!draggedCard || draggedCard.statut === nouveauStatut) {
      setDraggedCard(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/candidatures/${draggedCard.id}`,
        { ...draggedCard, statut: nouveauStatut },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mettre à jour l'état local
      setCandidatures(prev =>
        prev.map(c =>
          c.id === draggedCard.id ? { ...c, statut: nouveauStatut } : c
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setDraggedCard(null);
    }
  };

  const getCandidaturesByStatut = (statut) => {
    return candidatures.filter(c => c.statut === statut);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large"></div>
        <p>Chargement du tableau Kanban...</p>
      </div>
    );
  }

  return (
    <div className="kanban-container">
      {/* Header */}
      <div className="kanban-header">
        <div>
          <h1 className="kanban-title">
            <i className="fas fa-columns"></i>
            Tableau Kanban
          </h1>
          <p className="kanban-subtitle">
            Glissez-déposez les candidatures pour changer leur statut
          </p>
        </div>
        <div className="kanban-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/candidatures')}
          >
            <i className="fas fa-list"></i>
            Vue Liste
          </button>
          <button 
            className="btn-primary"
            onClick={fetchCandidatures}
          >
            <i className="fas fa-sync-alt"></i>
            Actualiser
          </button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="kanban-stats">
        {colonnes.map(col => {
          const count = getCandidaturesByStatut(col.id).length;
          return (
            <div key={col.id} className="stat-badge" style={{ borderColor: col.color }}>
              <i className={`fas fa-${col.icon}`} style={{ color: col.color }}></i>
              <span className="stat-count" style={{ color: col.color }}>{count}</span>
              <span className="stat-label">{col.titre}</span>
            </div>
          );
        })}
      </div>

      {/* Board Kanban */}
      <div className="kanban-board">
        {colonnes.map(colonne => {
          const cards = getCandidaturesByStatut(colonne.id);
          return (
            <div 
              key={colonne.id} 
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, colonne.id)}
            >
              {/* En-tête de colonne */}
              <div className="column-header" style={{ backgroundColor: `${colonne.color}15` }}>
                <div className="column-title">
                  <i className={`fas fa-${colonne.icon}`} style={{ color: colonne.color }}></i>
                  <span>{colonne.titre}</span>
                </div>
                <span className="column-count" style={{ backgroundColor: colonne.color }}>
                  {cards.length}
                </span>
              </div>

              {/* Zone de drop */}
              <div className="column-content">
                {cards.length === 0 ? (
                  <div className="empty-column">
                    <i className="fas fa-inbox"></i>
                    <p>Aucune candidature</p>
                  </div>
                ) : (
                  cards.map(candidature => (
                    <div
                      key={candidature.id}
                      className="kanban-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidature)}
                      onClick={() => navigate(`/candidatures/${candidature.id}`)}
                    >
                      <div className="card-header">
                        <h3 className="card-name">
                          <i className="fas fa-user"></i>
                          {candidature.nom} {candidature.prenom}
                        </h3>
                        <span className="card-date">
                          {formatDate(candidature.dateCandidature)}
                        </span>
                      </div>

                      <div className="card-body">
                        <div className="card-info">
                          <i className="fas fa-envelope"></i>
                          <span>{candidature.email}</span>
                        </div>
                        {candidature.telephone && (
                          <div className="card-info">
                            <i className="fas fa-phone"></i>
                            <span>{candidature.telephone}</span>
                          </div>
                        )}
                        {candidature.offreEmploi && (
                          <div className="card-offre">
                            <i className="fas fa-briefcase"></i>
                            <span>{candidature.offreEmploi.titre}</span>
                          </div>
                        )}
                      </div>

                      <div className="card-footer">
                        <div className="card-tags">
                          {candidature.competences?.slice(0, 2).map((comp, idx) => (
                            <span key={idx} className="card-tag">
                              {comp}
                            </span>
                          ))}
                          {candidature.competences?.length > 2 && (
                            <span className="card-tag-more">
                              +{candidature.competences.length - 2}
                            </span>
                          )}
                        </div>
                        <button 
                          className="card-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/candidatures/${candidature.id}`);
                          }}
                        >
                          <i className="fas fa-external-link-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KanbanBoard;