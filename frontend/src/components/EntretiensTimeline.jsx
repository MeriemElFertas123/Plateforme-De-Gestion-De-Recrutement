import { useState, useEffect } from 'react';
import { Timeline, Tag, Button, Space, Typography, Spin, Empty } from 'antd';
import { EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  getEntretiensByCandidature,
  getTypeLabel,
  getStatutColor,
  formatDate,
  getTempsAvant
} from '../services/entretienService';

const { Text } = Typography;

function EntretiensTimeline({ candidatureId }) {
  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEntretiens();
  }, [candidatureId]);

  const loadEntretiens = async () => {
    setLoading(true);
    try {
      const data = await getEntretiensByCandidature(candidatureId);
      setEntretiens(data);
    } catch (error) {
      console.error('Erreur chargement entretiens:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <Spin size="small" />;
  }

  if (entretiens.length === 0) {
    return (
      <Empty 
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Aucun entretien planifié"
      >
        <Button 
          type="primary" 
          size="small"
          icon={<CalendarOutlined />}
          onClick={() => navigate(`/entretiens/create?candidatureId=${candidatureId}`)}
        >
          Planifier un Entretien
        </Button>
      </Empty>
    );
  }

  return (
    <Timeline
      items={entretiens.map((entretien, index) => ({
        color: getStatutColor(entretien.statut),
        children: (
          <div key={index}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div>
                <Tag color="purple">{getTypeLabel(entretien.type)}</Tag>
                <Tag color={getStatutColor(entretien.statut)}>
                  {entretien.statut}
                </Tag>
              </div>
              
              <Text strong>{entretien.titre}</Text>
              
              <Text type="secondary" style={{ fontSize: 12 }}>
                📅 {formatDate(entretien.dateDebut)}
              </Text>
              
              {!entretien.dateFin && (
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {getTempsAvant(entretien.dateDebut)}
                </Text>
              )}

              <Button 
                type="link" 
                size="small" 
                icon={<EyeOutlined />}
                onClick={() => navigate(`/entretiens/${entretien.id}`)}
                style={{ paddingLeft: 0 }}
              >
                Voir le détail
              </Button>
            </Space>
          </div>
        )
      }))}
    />
  );
}

export default EntretiensTimeline;