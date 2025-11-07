import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveStatsWidget from '../components/LiveStatsWidget';
import {
  Row,
  Col,
  Button,
  Space,
  message,
  Typography,
  Spin,
  Card
} from 'antd';
import {
  getDashboardStats,
  getEvolutionCandidatures,
  getRepartitionParStatut,
  getTopOffres,
  getRepartitionEntretiens,
  getSourcesCandidatures,
  getDistributionScores,
  getActiviteRecente,
  getSourceLabel,
  getTypeEntretienLabel
} from '../services/AnalyticsService';
import StatsCard from '../components/StatsCard';
import EvolutionChart from '../components/EvolutionChart';
import RepartitionPieChart from '../components/RepartitionPieChart';
import BarChartComponent from '../components/BarChartComponent';
import ActivityTimeline from '../components/ActivityTimeline';
import TopOffresTable from '../components/TopOffresTable';

const { Title } = Typography;

function DashboardAnalytics() {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({});
  const [evolutionData, setEvolutionData] = useState([]);
  const [repartitionData, setRepartitionData] = useState([]);
  const [topOffresData, setTopOffresData] = useState([]);
  const [entretiensData, setEntretiensData] = useState([]);
  const [sourcesData, setSourcesData] = useState([]);
  const [scoresData, setScoresData] = useState([]);
  const [activitesData, setActivitesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        stats,
        evolution,
        repartition,
        topOffres,
        entretiens,
        sources,
        scores,
        activites
      ] = await Promise.all([
        getDashboardStats(),
        getEvolutionCandidatures(),
        getRepartitionParStatut(),
        getTopOffres(),
        getRepartitionEntretiens(),
        getSourcesCandidatures(),
        getDistributionScores(),
        getActiviteRecente(10)
      ]);

      setDashboardStats(stats);
      setEvolutionData(evolution);
      setRepartitionData(repartition);
      setTopOffresData(topOffres);
      setEntretiensData(entretiens);
      setSourcesData(sources);
      
      // Formater les scores pour le graphique
      const scoresFormatted = Object.entries(scores).map(([range, count]) => ({
        range,
        count
      }));
      setScoresData(scoresFormatted);
      
      setActivitesData(activites);
    } catch (error) {
      message.error('Erreur lors du chargement des données');
      console.error(error);
    }
    setLoading(false);
  };

  // Formater les sources pour le graphique
  const sourcesFormatted = sourcesData.map(item => ({
    ...item,
    source: getSourceLabel(item.source)
  }));

  // Formater les entretiens pour le graphique
  const entretiensFormatted = entretiensData.map(item => ({
    ...item,
    type: getTypeEntretienLabel(item.type)
  }));

  if (loading && Object.keys(dashboardStats).length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" tip="Chargement du tableau de bord..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
            Tableau de Bord Analytics
          </Title>
          <Button 
            icon={<i className="fas fa-redo" style={{ marginRight: '8px' }}></i>}
            onClick={loadAllData}
            loading={loading}
          >
            Actualiser
          </Button>
        </div>
      </div>

      {/* Widget Temps Réel */}
      <div style={{ marginBottom: 24 }}>
        <LiveStatsWidget />
      </div>

      {/* Statistiques principales */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Offres"
            value={dashboardStats.totalOffres || 0}
            prefix={<i className="fas fa-file-alt"></i>}
            valueStyle={{ color: '#1890ff' }}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Offres Publiées"
            value={dashboardStats.offresPubliees || 0}
            prefix={<i className="fas fa-file-alt"></i>}
            valueStyle={{ color: '#52c41a' }}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Candidatures"
            value={dashboardStats.totalCandidatures || 0}
            prefix={<i className="fas fa-users"></i>}
            valueStyle={{ color: '#722ed1' }}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Entretiens"
            value={dashboardStats.totalEntretiens || 0}
            prefix={<i className="fas fa-calendar-alt"></i>}
            valueStyle={{ color: '#fa8c16' }}
            loading={loading}
          />
        </Col>
      </Row>

      {/* KPIs */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Candidatures (30j)"
            value={dashboardStats.candidaturesRecentes || 0}
            prefix={<i className="fas fa-user-plus"></i>}
            valueStyle={{ color: '#13c2c2' }}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Entretiens à venir"
            value={dashboardStats.entretiensAVenir || 0}
            prefix={<i className="fas fa-calendar-check"></i>}
            valueStyle={{ color: '#faad14' }}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Taux de Conversion"
            value={dashboardStats.tauxConversion || 0}
            suffix="%"
            valueStyle={{ 
              color: dashboardStats.tauxConversion >= 10 ? '#52c41a' : '#faad14' 
            }}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Temps Moyen Recrutement"
            value={dashboardStats.tempsMoyenRecrutement || 0}
            suffix=" jours"
            valueStyle={{ 
              color: dashboardStats.tempsMoyenRecrutement <= 30 ? '#52c41a' : '#ff4d4f' 
            }}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Évolution et Répartition */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <EvolutionChart
            data={evolutionData}
            loading={loading}
            title={<><i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>Évolution des Candidatures (12 mois)</>}
          />
        </Col>
        <Col xs={24} lg={8}>
          <RepartitionPieChart
            data={repartitionData}
            loading={loading}
            title={<><i className="fas fa-chart-pie" style={{ marginRight: '8px' }}></i>Répartition par Statut</>}
          />
        </Col>
      </Row>

      {/* Top Offres */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <TopOffresTable
            data={topOffresData}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Sources et Entretiens */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <BarChartComponent
            data={sourcesFormatted}
            loading={loading}
            title={<><i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>Sources de Candidatures</>}
            xKey="source"
            yKey="nombre"
            yLabel="Nombre"
            color="#722ed1"
          />
        </Col>
        <Col xs={24} lg={12}>
          <BarChartComponent
            data={entretiensFormatted}
            loading={loading}
            title={<><i className="fas fa-bullseye" style={{ marginRight: '8px' }}></i>Types d'Entretiens</>}
            xKey="type"
            yKey="nombre"
            yLabel="Nombre"
            color="#13c2c2"
          />
        </Col>
      </Row>

      {/* Distribution Scores */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <BarChartComponent
            data={scoresData}
            loading={loading}
            title={<><i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>Distribution des Scores de Matching</>}
            xKey="range"
            yKey="count"
            yLabel="Nombre de candidatures"
            color="#faad14"
          />
        </Col>
        <Col xs={24} lg={12}>
          <ActivityTimeline
            data={activitesData}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Raccourcis */}
      <Card title={<><i className="fas fa-rocket" style={{ marginRight: '8px' }}></i>Accès Rapide</>}>
        <Space wrap>
          <Button 
            type="primary"
            icon={<i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>}
            onClick={() => navigate('/offres')}
          >
            Gérer les Offres
          </Button>
          <Button 
            icon={<i className="fas fa-users" style={{ marginRight: '8px' }}></i>}
            onClick={() => navigate('/candidatures')}
          >
            Candidatures
          </Button>
          <Button 
            icon={<i className="fas fa-columns" style={{ marginRight: '8px' }}></i>}
            onClick={() => navigate('/candidatures/kanban')}
          >
            Pipeline Kanban
          </Button>
          <Button 
            icon={<i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>}
            onClick={() => navigate('/entretiens')}
          >
            Entretiens
          </Button>
          <Button 
            icon={<i className="fas fa-user-tie" style={{ marginRight: '8px' }}></i>}
            onClick={() => navigate('/candidatures')}
          >
            Candidats
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default DashboardAnalytics;