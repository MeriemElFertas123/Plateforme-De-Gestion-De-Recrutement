import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EntretiensTimeline from '../components/EntretiensTimeline';
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Space,
  Typography,
  Spin,
  Alert,
  Descriptions,
  Timeline,
  Progress,
  Avatar,
  Input,
  message,
  Popconfirm,
  Divider,
  Form,
  Select
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CommentOutlined,
  SendOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LinkedinOutlined,
  GithubOutlined
} from '@ant-design/icons';
import {
  getCandidatureById,
  deleteCandidature,
  changerStatut,
  ajouterCommentaire,
  getStatutLabel,
  getStatutColor,
  getScoreColor,
  formatDate
} from '../services/candidatureService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function CandidatureDetail() {
  const [candidature, setCandidature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [commentForm] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadCandidature();
  }, [id]);

  const loadCandidature = async () => {
    setLoading(true);
    try {
      const data = await getCandidatureById(id);
      setCandidature(data);
    } catch (error) {
      message.error('Candidature non trouvée');
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteCandidature(id);
      message.success('Candidature supprimée');
      navigate('/candidatures');
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
    setActionLoading(false);
  };

  const handleChangeStatut = async (nouveauStatut) => {
    setActionLoading(true);
    try {
      await changerStatut(id, nouveauStatut, 'Changement de statut');
      message.success('Statut mis à jour');
      loadCandidature();
    } catch (error) {
      message.error('Erreur lors du changement de statut');
    }
    setActionLoading(false);
  };

  const handleAddComment = async (values) => {
    try {
      await ajouterCommentaire(id, values.contenu, values.prive || false);
      message.success('Commentaire ajouté');
      commentForm.resetFields();
      loadCandidature();
    } catch (error) {
      message.error('Erreur lors de l\'ajout du commentaire');
    }
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

  if (!candidature) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="Candidature non trouvée" type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Space direction="vertical">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/candidatures')}
            >
              Retour à la liste
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              {candidature.candidatPrenom} {candidature.candidatNom}
            </Title>
            <Space>
              <Tag color={getStatutColor(candidature.statut)}>
                {getStatutLabel(candidature.statut)}
              </Tag>
              <Text type="secondary">
                Candidature du {formatDate(candidature.datePostulation)}
              </Text>
            </Space>
          </Space>

          <Space wrap>
            <Select
              value={candidature.statut}
              style={{ width: 200 }}
              onChange={handleChangeStatut}
              loading={actionLoading}
            >
              <Option value="NOUVEAU">🆕 Nouveau</Option>
              <Option value="EN_REVISION">👁️ En révision</Option>
              <Option value="PRESELECTIONNE">⭐ Présélectionné</Option>
              <Option value="ENTRETIEN_RH">💼 Entretien RH</Option>
              <Option value="TEST_TECHNIQUE">🔧 Test technique</Option>
              <Option value="ENTRETIEN_FINAL">🎯 Entretien final</Option>
              <Option value="OFFRE_ENVOYEE">📨 Offre envoyée</Option>
              <Option value="ACCEPTE">✅ Accepté</Option>
              <Option value="REFUSE">❌ Refusé</Option>
            </Select>
            
            <Popconfirm
              title="Supprimer cette candidature ?"
              onConfirm={handleDelete}
              okText="Oui"
              cancelText="Non"
            >
              <Button danger icon={<DeleteOutlined />} loading={actionLoading}>
                Supprimer
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Colonne Gauche */}
        <Col xs={24} lg={16}>
          {/* Score de matching */}
          <Card style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Score de Correspondance</Text>
              <Progress
                percent={candidature.scoreMatching}
                strokeColor={getScoreColor(candidature.scoreMatching)}
                format={(percent) => `${percent}%`}
              />
              <Text type="secondary">
                {candidature.scoreMatching >= 80 && '🎯 Excellent profil !'}
                {candidature.scoreMatching >= 60 && candidature.scoreMatching < 80 && '✅ Bon profil'}
                {candidature.scoreMatching >= 40 && candidature.scoreMatching < 60 && '⚠️ Profil moyen'}
                {candidature.scoreMatching < 40 && '❌ Profil peu correspondant'}
              </Text>
            </Space>
          </Card>

          {/* Informations Candidat */}
          <Card title={<><UserOutlined /> Informations du Candidat</>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label={<><MailOutlined /> Email</>}>
                <a href={`mailto:${candidature.candidatEmail}`}>
                  {candidature.candidatEmail}
                </a>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Lettre de motivation */}
          {candidature.lettreMotivation && (
            <Card title={<><FileTextOutlined /> Lettre de Motivation</>} style={{ marginBottom: 16 }}>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                {candidature.lettreMotivation}
              </Paragraph>
            </Card>
          )}

          {/* Commentaires */}
          <Card title={<><CommentOutlined /> Commentaires Internes</>}>
            {/* Ajouter un commentaire */}
            <Form
              form={commentForm}
              onFinish={handleAddComment}
              layout="vertical"
              style={{ marginBottom: 24 }}
            >
              <Form.Item
                name="contenu"
                rules={[{ required: true, message: 'Le commentaire est obligatoire' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Ajouter un commentaire..."
                />
              </Form.Item>
              <Form.Item name="prive" valuePropName="checked">
                <Space>
                  <input type="checkbox" id="prive" />
                  <label htmlFor="prive">Commentaire privé (non visible par le candidat)</label>
                </Space>
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Ajouter un commentaire
              </Button>
            </Form>

            <Divider />

            {/* Liste des commentaires */}
            {candidature.commentaires && candidature.commentaires.length > 0 ? (
              <Timeline
                items={candidature.commentaires.map((comment, index) => ({
                  color: comment.prive ? 'red' : 'blue',
                  children: (
                    <div key={index}>
                      <Space>
                        <Text strong>{comment.auteurNom}</Text>
                        {comment.prive && <Tag color="red">Privé</Tag>}
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatDate(comment.date)}
                        </Text>
                      </Space>
                      <Paragraph style={{ marginTop: 8 }}>
                        {comment.contenu}
                      </Paragraph>
                    </div>
                  )
                }))}
              />
            ) : (
              <Text type="secondary">Aucun commentaire pour le moment</Text>
            )}
          </Card>
        </Col>

        {/* Colonne Droite */}
        <Col xs={24} lg={8}>
          {/* Offre associée */}
          <Card 
            title={<><FileTextOutlined /> Offre</>}
            style={{ marginBottom: 16 }}
            extra={
              <Button 
                type="link" 
                size="small"
                onClick={() => navigate(`/offres/${candidature.offreId}`)}
              >
                Voir l'offre
              </Button>
            }
          >
            <Title level={5}>{candidature.offreTitre}</Title>
          </Card>

          {/* Source */}
          <Card style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Source">
                {candidature.source || 'Site carrière'}
              </Descriptions.Item>
              <Descriptions.Item label="Date de postulation">
                {formatDate(candidature.datePostulation)}
              </Descriptions.Item>
              <Descriptions.Item label="Dernière action">
                {formatDate(candidature.dateDerniereAction || candidature.datePostulation)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          {/* Entretiens */}
<Card 
  title={<><CalendarOutlined /> Entretiens</>}
  style={{ marginBottom: 16 }}
  extra={
    <Button 
      type="link" 
      size="small"
      onClick={() => navigate(`/entretiens/create?candidatureId=${id}`)}
    >
      Planifier
    </Button>
  }
>
  <EntretiensTimeline candidatureId={id} />
</Card>
          {/* Historique des statuts */}
          <Card title={<><CalendarOutlined /> Historique</>}>
            {candidature.historique && candidature.historique.length > 0 ? (
              <Timeline
                items={candidature.historique.map((h, index) => ({
                  color: getStatutColor(h.nouveauStatut),
                  children: (
                    <div key={index}>
                      <Tag color={getStatutColor(h.nouveauStatut)}>
                        {getStatutLabel(h.nouveauStatut)}
                      </Tag>
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {formatDate(h.date)}
                        </Text>
                      </div>
                      {h.commentaire && (
                        <div style={{ marginTop: 4 }}>
                          <Text style={{ fontSize: 12 }}>{h.commentaire}</Text>
                        </div>
                      )}
                      <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Par {h.auteurNom}
                        </Text>
                      </div>
                    </div>
                  )
                }))}
              />
            ) : (
              <Text type="secondary">Pas d'historique</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CandidatureDetail;