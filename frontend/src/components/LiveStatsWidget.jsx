import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Badge, Space, Typography } from 'antd';
import { 
  getStatistics as getCandidaturesStats
} from '../services/candidatureService';
import { 
  getEntretiensAujourdhui
} from '../services/entretienService';

const { Text } = Typography;

function LiveStatsWidget() {
  const [stats, setStats] = useState({
    candidaturesNouvelles: 0,
    entretiensAujourdhui: 0,
    entretiensEnCours: 0,
    candidaturesEnRevision: 0
  });

  useEffect(() => {
    loadStats();
    // Actualiser toutes les 30 secondes
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const [candidaturesData, entretiensData] = await Promise.all([
        getCandidaturesStats(),
        getEntretiensAujourdhui()
      ]);

      setStats({
        candidaturesNouvelles: candidaturesData.NOUVEAU || 0,
        entretiensAujourdhui: entretiensData.length || 0,
        entretiensEnCours: entretiensData.filter(e => e.statut === 'EN_COURS').length || 0,
        candidaturesEnRevision: candidaturesData.EN_REVISION || 0
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  return (
    <Card 
      title={
        <Space>
          <Badge status="processing" />
          <span>
            <i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>
            Statistiques en Temps Réel
          </span>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nouvelles Candidatures"
              value={stats.candidaturesNouvelles}
              prefix={<i className="fas fa-user-plus"></i>}
              valueStyle={{ color: '#1890ff', fontSize: 24 }}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              À traiter
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Entretiens Aujourd'hui"
              value={stats.entretiensAujourdhui}
              prefix={<i className="fas fa-calendar-day"></i>}
              valueStyle={{ color: '#52c41a', fontSize: 24 }}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              Planifiés
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="En Cours"
              value={stats.entretiensEnCours}
              prefix={<i className="fas fa-clock"></i>}
              valueStyle={{ color: '#faad14', fontSize: 24 }}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              Entretiens actifs
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="En Révision"
              value={stats.candidaturesEnRevision}
              prefix={<i className="fas fa-search"></i>}
              valueStyle={{ color: '#722ed1', fontSize: 24 }}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              Candidatures
            </Text>
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: 8, textAlign: 'right' }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          <i className="fas fa-sync-alt" style={{ marginRight: '4px' }}></i>
          Mise à jour automatique toutes les 30s
        </Text>
      </div>
    </Card>
  );
}

export default LiveStatsWidget;