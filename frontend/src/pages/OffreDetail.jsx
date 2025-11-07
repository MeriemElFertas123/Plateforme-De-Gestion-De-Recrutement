import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SendOutlined } from '@ant-design/icons';
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Space,
  Typography,
  Divider,
  Spin,
  Alert,
  Descriptions,
  Timeline,
  Statistic,
  message,
  Popconfirm
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  TeamOutlined,
  FileTextOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import {
  getOffreById,
  deleteOffre,
  publierOffre,
  archiverOffre,
  marquerCommePourvue,
  getStatutLabel,
  getStatutColor,
  getTypeContratLabel,
  formatSalaire,
  formatDate,
  getJoursRestants
} from '../services/offreService';

const { Title, Text, Paragraph } = Typography;

function OffreDetail() {
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadOffre();
  }, [id]);

  const loadOffre = async () => {
    setLoading(true);
    try {
      const data = await getOffreById(id);
      setOffre(data);
    } catch (error) {
      message.error('Erreur lors du chargement de l\'offre');
      console.error(error);
    }
    setLoading(false);
  };

  // Supprimer
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteOffre(id);
      message.success('Offre supprimée');
      navigate('/offres');
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
    setActionLoading(false);
  };

  // Publier
  const handlePublish = async () => {
    setActionLoading(true);
    try {
      await publierOffre(id);
      message.success('Offre publiée !');
      loadOffre();
    } catch (error) {
      message.error('Erreur lors de la publication');
    }
    setActionLoading(false);
  };

  // Archiver
  const handleArchive = async () => {
    setActionLoading(true);
    try {
      await archiverOffre(id);
      message.success('Offre archivée');
      loadOffre();
    } catch (error) {
      message.error('Erreur');
    }
    setActionLoading(false);
  };

  // Marquer pourvue
  const handleMarkPourvue = async () => {
    setActionLoading(true);
    try {
      await marquerCommePourvue(id);
      message.success('Offre marquée comme pourvue');
      loadOffre();
    } catch (error) {
      message.error('Erreur');
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" tip="Chargement..." />
      </div>
    );
  }

  if (!offre) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Offre non trouvée"
          type="error"
          showIcon
        />
      </div>
    );
  }

  const joursRestants = getJoursRestants(offre.dateExpiration);

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Space direction="vertical">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/offres')}
            >
              Retour à la liste
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              {offre.titre}
            </Title>
            <Space>
              <Text type="secondary">{offre.reference}</Text>
              <Tag color={getStatutColor(offre.statut)}>
                {getStatutLabel(offre.statut)}
              </Tag>
            </Space>
          </Space>

          <Space wrap>
            {offre.statut === 'BROUILLON' && (
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />}
                onClick={handlePublish}
                loading={actionLoading}
              >
                Publier
              </Button>
            )}
           
            {offre.statut === 'PUBLIEE' && (
                <Button 
                  type="primary"
                  size="large"
                  icon={<SendOutlined />}
                  onClick={() => navigate(`/offres/${id}/postuler`)}
                >
                  Postuler à cette offre
                </Button>
            )}
            
            <Popconfirm
              title="Supprimer cette offre ?"
              onConfirm={handleDelete}
              okText="Oui"
              cancelText="Non"
            >
             
            </Popconfirm>
          </Space>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Colonne Gauche */}
        <Col xs={24} lg={16}>
          {/* Description */}
          <Card title="📝 Description" style={{ marginBottom: 16 }}>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              {offre.description}
            </Paragraph>
          </Card>

          {/* Compétences */}
          <Card title="💡 Compétences" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Compétences Requises :</Text>
              <div style={{ marginTop: 8 }}>
                <Space wrap>
                  {offre.competencesRequises?.map((comp, index) => (
                    <Tag key={index} color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                      {comp}
                    </Tag>
                  ))}
                </Space>
              </div>
            </div>

            {offre.competencesSouhaitees?.length > 0 && (
              <div>
                <Text strong>Compétences Souhaitées :</Text>
                <div style={{ marginTop: 8 }}>
                  <Space wrap>
                    {offre.competencesSouhaitees.map((comp, index) => (
                      <Tag key={index} color="purple" style={{ fontSize: 14, padding: '4px 12px' }}>
                        {comp}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </div>
            )}
          </Card>

          {/* Avantages */}
          {offre.avantages?.length > 0 && (
            <Card title="🎁 Avantages" style={{ marginBottom: 16 }}>
              <ul>
                {offre.avantages.map((avantage, index) => (
                  <li key={index} style={{ fontSize: 15, marginBottom: 8 }}>
                    {avantage}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Processus de Recrutement */}
          {offre.etapesRecrutement?.length > 0 && (
            <Card title="🔄 Processus de Recrutement">
              <Timeline
                items={offre.etapesRecrutement
                  .sort((a, b) => a.ordre - b.ordre)
                  .map((etape) => ({
                    children: (
                      <div>
                        <Text strong>{etape.nom}</Text>
                        {etape.description && (
                          <div><Text type="secondary">{etape.description}</Text></div>
                        )}
                      </div>
                    )
                  }))}
              />
            </Card>
          )}
        </Col>

        {/* Colonne Droite */}
        <Col xs={24} lg={8}>
          {/* Statistiques */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Vues"
                  value={offre.nombreVues}
                  prefix={<EyeOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Candidatures"
                  value={offre.nombreCandidatures}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
            </Row>
          </Card>

          {/* Informations Principales */}
          <Card title="ℹ️ Informations" style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item 
                label={<><FileTextOutlined /> Type</>}
              >
                <Tag color="blue">{getTypeContratLabel(offre.typeContrat)}</Tag>
              </Descriptions.Item>

              <Descriptions.Item 
                label={<><EnvironmentOutlined /> Localisation</>}
              >
                {offre.localisation}
              </Descriptions.Item>

              {offre.departement && (
                <Descriptions.Item label="Département">
                  {offre.departement}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Télétravail">
                {offre.teletravailPossible ? (
                  <Tag color="green">Possible</Tag>
                ) : (
                  <Tag>Non</Tag>
                )}
              </Descriptions.Item>

              {offre.experienceRequise && (
                <Descriptions.Item 
                  label={<><ClockCircleOutlined /> Expérience</>}
                >
                  {offre.experienceRequise} an{offre.experienceRequise > 1 ? 's' : ''}
                </Descriptions.Item>
              )}

              {offre.niveauEtudesRequis && (
                <Descriptions.Item 
                  label={<><TrophyOutlined /> Niveau d'études</>}
                >
                  {offre.niveauEtudesRequis.replace('_', ' ')}
                </Descriptions.Item>
              )}

              {(offre.salaireMin || offre.salaireMax) && (
                <Descriptions.Item 
                  label={<><DollarOutlined /> Salaire</>}
                >
                  <Text strong style={{ color: '#52c41a' }}>
                    {formatSalaire(offre.salaireMin, offre.salaireMax)}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Dates */}
          <Card title="📅 Dates" style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item 
                label={<><CalendarOutlined /> Création</>}
              >
                {formatDate(offre.dateCreation)}
              </Descriptions.Item>

              {offre.datePublication && (
                <Descriptions.Item label="Publication">
                  {formatDate(offre.datePublication)}
                </Descriptions.Item>
              )}

              {offre.dateExpiration && (
                <Descriptions.Item label="Expiration">
                  {formatDate(offre.dateExpiration)}
                  {joursRestants !== null && joursRestants > 0 && (
                    <div style={{ marginTop: 4 }}>
                      <Tag color={joursRestants <= 7 ? 'warning' : 'default'}>
                        {joursRestants} jour{joursRestants > 1 ? 's' : ''} restant{joursRestants > 1 ? 's' : ''}
                      </Tag>
                    </div>
                  )}
                  {joursRestants !== null && joursRestants <= 0 && (
                    <div style={{ marginTop: 4 }}>
                      <Tag color="error">Expirée</Tag>
                    </div>
                  )}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Dernière modification">
                {formatDate(offre.dateModification)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Créateur */}
          <Card>
            <Space direction="vertical">
              <Text type="secondary">Créée par</Text>
              <Space>
                <UserOutlined style={{ fontSize: 24 }} />
                <div>
                  <div><Text strong>{offre.createurNom}</Text></div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatDate(offre.dateCreation)}
                  </Text>
                </div>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OffreDetail;