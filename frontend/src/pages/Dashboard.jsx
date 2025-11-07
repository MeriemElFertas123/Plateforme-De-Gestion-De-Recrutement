import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';
// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    offresActives: 0,
    totalOffres: 0,
    candidaturesEnAttente: 0,
    totalCandidatures: 0,
    entretiensAVenir: 0,
    totalEntretiens: 0,
    candidatsUniques: 0,
    tauxConversion: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier la corruption des données
  useEffect(() => {
    const checkDataCorruption = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          console.log('✅ Données utilisateur valides:', parsed);
          return true;
        }
      } catch (e) {
        console.error('❌ Données utilisateur corrompues:', e);
        // Nettoyer les données corrompues
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return false;
      }
      return true;
    };

    if (!checkDataCorruption()) {
      setError('Données de session corrompues. Veuillez vous reconnecter.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    fetchStatistics();
  }, [navigate]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      console.log('🔄 Début du chargement des statistiques...');

      let offres = [];
      let candidatures = [];
      let entretiens = [];

      // Chargement des offres
      try {
        console.log('📤 Requête offres...');
        const offresRes = await api.get('/offres');
        offres = offresRes.data || [];
        console.log('✅ Offres chargées:', offres.length, offres);
      } catch (offreError) {
        console.warn('⚠️ Erreur chargement offres:', offreError.message);
        offres = [];
      }

      // Chargement des candidatures
      try {
        console.log('📤 Requête candidatures...');
        const candidaturesRes = await api.get('/candidatures');
        candidatures = candidaturesRes.data || [];
        console.log('✅ Candidatures chargées:', candidatures.length, candidatures);
      } catch (candidatureError) {
        console.warn('⚠️ Erreur chargement candidatures:', candidatureError.message);
        candidatures = [];
      }

      // Chargement des entretiens
      try {
        console.log('📤 Requête entretiens...');
        const entretiensRes = await api.get('/entretiens');
        entretiens = entretiensRes.data || [];
        console.log('✅ Entretiens chargés:', entretiens.length, entretiens);
      } catch (entretienError) {
        console.warn('⚠️ Erreur chargement entretiens:', entretienError.message);
        entretiens = [];
      }

      // Calcul des statistiques
      const offresActives = offres.filter(o => 
        o.statut === 'PUBLIEE' || o.statut === 'OUVERTE'
      ).length;

      const candidaturesEnAttente = candidatures.filter(c => 
        c.statut === 'EN_ATTENTE'
      ).length;
      
      const candidatsUniques = new Set(candidatures.map(c => c.email)).size;

      const now = new Date();
      const entretiensAVenir = entretiens.filter(e => {
        try {
          return e.dateHeure && new Date(e.dateHeure) > now;
        } catch {
          return false;
        }
      }).length;

      const candidaturesAcceptees = candidatures.filter(c => 
        c.statut === 'ACCEPTE'
      ).length;
      
      const tauxConversion = candidatures.length > 0 
        ? Math.round((candidaturesAcceptees / candidatures.length) * 100) 
        : 0;

      setStats({
        offresActives,
        totalOffres: offres.length,
        candidaturesEnAttente,
        totalCandidatures: candidatures.length,
        entretiensAVenir,
        totalEntretiens: entretiens.length,
        candidatsUniques,
        tauxConversion
      });

      console.log('📈 Statistiques finales:', {
        offresActives,
        totalOffres: offres.length,
        candidaturesEnAttente,
        totalCandidatures: candidatures.length,
        entretiensAVenir,
        totalEntretiens: entretiens.length,
        candidatsUniques,
        tauxConversion
      });

    } catch (error) {
      console.error('❌ Erreur générale:', error);
      setError(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, subtitle, color, onClick }) => (
    <div className="stat-card" onClick={onClick} style={{ borderTopColor: color }}>
      <div className="stat-icon" style={{ backgroundColor: `${color}15`, color }}>
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-value" style={{ color }}>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            value
          )}
        </div>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  const QuickAction = ({ icon, label, onClick, color }) => (
    <button className="quick-action" onClick={onClick} style={{ borderColor: color }}>
      <div className="action-icon" style={{ color }}>
        <i className={`fas fa-${icon}`}></i>
      </div>
      <span>{label}</span>
    </button>
  );

  // Si données corrompues
  if (error && error.includes('corrompues')) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <i className="fas fa-database"></i>
          <h2>Données de session corrompues</h2>
          <p>Vos données de connexion sont endommagées.</p>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="btn-primary"
          >
            <i className="fas fa-sign-in-alt"></i>
            Se reconnecter
          </button>
        </div>
      </div>
    );
  }

  // Erreur générale
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Erreur</h2>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={fetchStatistics} className="btn-primary">
              <i className="fas fa-redo"></i>
              Réessayer
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary">
              <i className="fas fa-sign-in-alt"></i>
              Reconnexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-title">
            <i className="fas fa-chart-line"></i>
            Bienvenue, {user?.prenom || 'Utilisateur'} !
          </h1>
          <p className="welcome-subtitle">
            Voici un aperçu de vos activités de recrutement
          </p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="btn-secondary"
            title="Nettoyer le cache"
          >
            <i className="fas fa-broom"></i>
            Nettoyer
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="stats-grid">
        <StatCard
          icon="briefcase"
          title="Offres Actives"
          value={stats.offresActives}
          subtitle={`sur ${stats.totalOffres} offres totales`}
          color="#1890ff"
          onClick={() => navigate('/offres')}
        />
        <StatCard
          icon="users"
          title="Candidatures"
          value={stats.totalCandidatures}
          subtitle={`${stats.candidaturesEnAttente} en attente`}
          color="#52c41a"
          onClick={() => navigate('/candidatures')}
        />
        <StatCard
          icon="calendar-alt"
          title="Entretiens"
          value={stats.entretiensAVenir}
          subtitle={`sur ${stats.totalEntretiens} planifiés`}
          color="#faad14"
          onClick={() => navigate('/entretiens')}
        />
        <StatCard
          icon="user-tie"
          title="Candidats"
          value={stats.candidatsUniques}
          subtitle={`${stats.tauxConversion}% taux de conversion`}
          color="#722ed1"
          onClick={() => navigate('/candidatures')}
        />
      </div>

      {/* Actions rapides */}
      <div className="quick-actions-section">
        <h2 className="section-title">
          <i className="fas fa-bolt"></i>
          Actions Rapides
        </h2>
        <div className="quick-actions-grid">
          <QuickAction
            icon="plus-circle"
            label="Créer une Offre"
            onClick={() => navigate('/offres/create')}
            color="#1890ff"
          />
          <QuickAction
            icon="columns"
            label="Vue Kanban"
            onClick={() => navigate('/candidatures/kanban')}
            color="#52c41a"
          />
          <QuickAction
            icon="calendar-plus"
            label="Planifier Entretien"
            onClick={() => navigate('/entretiens/create')}
            color="#faad14"
          />
          <QuickAction
            icon="chart-bar"
            label="Analytics"
            onClick={() => navigate('/analytics')}
            color="#722ed1"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;