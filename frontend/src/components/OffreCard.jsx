import { Card, Tag, Space, Typography, Button, Tooltip, Popconfirm, message } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { 
  deleteOffre, 
  publierOffre,
  getStatutLabel,
  getStatutColor,
  getTypeContratLabel,
  formatSalaire,
  getJoursRestants,
  formatDate
} from '../services/offreService';

const { Title, Text, Paragraph } = Typography;

function OffreCard({ offre, onUpdate }) {
  const navigate = useNavigate();

  // Supprimer une offre
  const handleDelete = async () => {
    try {
      await deleteOffre(offre.id);
      message.success('Offre supprimée avec succès');
      if (onUpdate) onUpdate(); // Rafraîchir la liste
    } catch (error) {
      message.error('Erreur lors de la suppression');
      console.error(error);
    }
  };

  // Publier une offre
  const handlePublish = async () => {
    try {
      await publierOffre(offre.id);
      message.success('Offre publiée avec succès !');
      if (onUpdate) onUpdate();
    } catch (error) {
      message.error('Erreur lors de la publication');
      console.error(error);
    }
  };

  // Calculer les jours restants
  const joursRestants = getJoursRestants(offre.dateExpiration);

  return (
    <Card
      hoverable
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      actions={[
        <Tooltip title="Voir le détail">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/offres/${offre.id}`)}
          >
            Détail
          </Button>
        </Tooltip>,
        <Tooltip title="Modifier">
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/offres/edit/${offre.id}`)}
          />
        </Tooltip>,
        <Popconfirm
          title="Supprimer cette offre ?"
          description="Cette action est irréversible."
          onConfirm={handleDelete}
          okText="Oui"
          cancelText="Non"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ]}
    >
      <div style={{ flex: 1 }}>
        {/* Header avec Statut */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <Title 
              level={4} 
              style={{ margin: 0, marginBottom: 4, cursor: 'pointer' }}
              onClick={() => navigate(`/offres/${offre.id}`)}
            >
              {offre.titre}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {offre.reference}
            </Text>
          </div>
          
          <Tag color={getStatutColor(offre.statut)} style={{ marginLeft: 8 }}>
            {getStatutLabel(offre.statut)}
          </Tag>
        </div>

        {/* Description */}
        <Paragraph 
          ellipsis={{ rows: 3 }}
          style={{ marginBottom: 16, color: '#666' }}
        >
          {offre.description}
        </Paragraph>

        {/* Informations principales */}
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          {/* Type de contrat et Localisation */}
          <div>
            <Tag color="blue" icon={<FileTextOutlined />}>
              {getTypeContratLabel(offre.typeContrat)}
            </Tag>
            <Tag icon={<EnvironmentOutlined />}>
              {offre.localisation}
            </Tag>
            {offre.teletravailPossible && (
              <Tag color="green">Télétravail</Tag>
            )}
          </div>

          {/* Salaire */}
          {offre.salaireMin && (
            <div>
              <DollarOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              <Text strong style={{ color: '#52c41a' }}>
                {formatSalaire(offre.salaireMin, offre.salaireMax)}
              </Text>
            </div>
          )}

          {/* Expérience requise */}
          {offre.experienceRequise && (
            <div>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              <Text type="secondary">
                {offre.experienceRequise} an{offre.experienceRequise > 1 ? 's' : ''} d'expérience
              </Text>
            </div>
          )}

          {/* Compétences (3 premières) */}
          {offre.competencesRequises && offre.competencesRequises.length > 0 && (
            <div>
              <Space size={4} wrap>
                {offre.competencesRequises.slice(0, 3).map((comp, index) => (
                  <Tag key={index} color="purple" style={{ fontSize: 11 }}>
                    {comp}
                  </Tag>
                ))}
                {offre.competencesRequises.length > 3 && (
                  <Tag style={{ fontSize: 11 }}>
                    +{offre.competencesRequises.length - 3}
                  </Tag>
                )}
              </Space>
            </div>
          )}

          {/* Statistiques */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            paddingTop: 12,
            borderTop: '1px solid #f0f0f0'
          }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <EyeOutlined /> {offre.nombreVues} vues
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <TeamOutlined /> {offre.nombreCandidatures} candidatures
            </Text>
          </div>

          {/* Date d'expiration */}
          {offre.dateExpiration && joursRestants !== null && (
            <div style={{ marginTop: 8 }}>
              {joursRestants > 0 ? (
                <Text type={joursRestants <= 7 ? 'warning' : 'secondary'} style={{ fontSize: 12 }}>
                  ⏰ Expire dans {joursRestants} jour{joursRestants > 1 ? 's' : ''}
                </Text>
              ) : (
                <Text type="danger" style={{ fontSize: 12 }}>
                  ⚠️ Expirée
                </Text>
              )}
            </div>
          )}

          {/* Bouton Publier si brouillon */}
          {offre.statut === 'BROUILLON' && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />}
              onClick={handlePublish}
              block
              style={{ marginTop: 12 }}
            >
              Publier cette offre
            </Button>
          )}
        </Space>

        {/* Créateur */}
        <div style={{ 
          marginTop: 12, 
          paddingTop: 12, 
          borderTop: '1px solid #f0f0f0' 
        }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Par {offre.createurNom} • {formatDate(offre.dateCreation)}
          </Text>
        </div>
      </div>
    </Card>
  );
}

export default OffreCard;