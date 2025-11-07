import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Space,
  message,
  Typography,
  Alert,
  Progress,
  Divider,
  Row,
  Col
} from 'antd';
import {
  ArrowLeftOutlined,
  SendOutlined,
  UploadOutlined,
  FileTextOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { createCandidature } from '../services/candidatureService';
import { getOffreById } from '../services/offreService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function CandidatureForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [offre, setOffre] = useState(null);
  const [loadingOffre, setLoadingOffre] = useState(true);
  const [cvFile, setCvFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { offreId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadOffre();
  }, [offreId]);

  const loadOffre = async () => {
    setLoadingOffre(true);
    try {
      const data = await getOffreById(offreId);
      setOffre(data);
    } catch (error) {
      message.error('Offre non trouvée');
      navigate('/offres');
    }
    setLoadingOffre(false);
  };

  const onFinish = async (values) => {
    if (!cvFile) {
      message.warning('Veuillez joindre votre CV');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Créer FormData
      const formData = new FormData();
      formData.append('offreId', offreId);
      formData.append('nom', values.nom);
      formData.append('prenom', values.prenom);
      formData.append('email', values.email);
      formData.append('telephone', values.telephone);
      formData.append('lettreMotivation', values.lettreMotivation || '');
      formData.append('cv', cvFile);

      // Simuler progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await createCandidature(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      message.success('Candidature envoyée avec succès ! 🎉');
      
      setTimeout(() => {
        navigate('/offres');
      }, 2000);

    } catch (error) {
      message.error(error.response?.data?.error || 'Erreur lors de l\'envoi de la candidature');
      console.error(error);
      setUploadProgress(0);
    }

    setLoading(false);
  };

  // Gestion du fichier CV
  const handleFileChange = ({ file }) => {
    if (file.status === 'removed') {
      setCvFile(null);
      return;
    }

    const isValidType = 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isValidType) {
      message.error('Seuls les fichiers PDF et DOCX sont acceptés');
      return;
    }

    const isValidSize = file.size / 1024 / 1024 < 5; // 5MB

    if (!isValidSize) {
      message.error('Le fichier doit faire moins de 5MB');
      return;
    }

    setCvFile(file.originFileObj || file);
  };

  if (loadingOffre) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>Chargement...</Text>
      </div>
    );
  }

  if (!offre) {
    return null;
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`/offres/${offreId}`)}
          style={{ marginBottom: 16 }}
        >
          Retour à l'offre
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          Postuler à : {offre.titre}
        </Title>
      </Card>

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Informations sur l'offre */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>Entreprise</Text>
                <Text>{offre.createurNom || 'Entreprise'}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>Localisation</Text>
                <Text>{offre.localisation}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>Type de contrat</Text>
                <Text>{offre.typeContrat}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>Département</Text>
                <Text>{offre.departement || 'Non spécifié'}</Text>
              </div>
            </Col>
          </Row>
          {offre.competencesRequises && offre.competencesRequises.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Compétences recherchées :</Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {offre.competencesRequises.map((competence, index) => (
                  <span 
                    key={index}
                    style={{
                      background: '#e6f7ff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: '1px solid #91d5ff'
                    }}
                  >
                    {competence}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Alerte info */}
        <Alert
          message="Conseils pour votre candidature"
          description={
            <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
              <Col xs={24} sm={12}>
                <Text>✓ Assurez-vous que votre CV est à jour</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text>✓ Mettez en avant vos compétences correspondantes</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text>✓ Personnalisez votre lettre de motivation</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text>✓ Formats acceptés : PDF, DOCX (max 5MB)</Text>
              </Col>
            </Row>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {/* Formulaire */}
        <Card title={<><UserOutlined /> Vos informations</>}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            {/* Informations personnelles - Ligne 1 */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Nom"
                  name="nom"
                  rules={[
                    { required: true, message: 'Le nom est obligatoire' },
                    { min: 2, message: 'Minimum 2 caractères' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />}
                    placeholder="Votre nom"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Prénom"
                  name="prenom"
                  rules={[
                    { required: true, message: 'Le prénom est obligatoire' },
                    { min: 2, message: 'Minimum 2 caractères' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />}
                    placeholder="Votre prénom"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Informations personnelles - Ligne 2 */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'L\'email est obligatoire' },
                    { type: 'email', message: 'Email invalide' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />}
                    placeholder="votre.email@example.com"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Téléphone"
                  name="telephone"
                  rules={[
                    { required: true, message: 'Le téléphone est obligatoire' },
                    { pattern: /^[0-9]{10}$/, message: 'Format: 0612345678' }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />}
                    placeholder="0612345678"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            {/* CV et Lettre de motivation côte à côte */}
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={<Text strong>CV *</Text>}
                  extra="PDF, DOCX - Max 5MB"
                  required
                >
                  <Upload
                    accept=".pdf,.doc,.docx"
                    maxCount={1}
                    onChange={handleFileChange}
                    beforeUpload={() => false}
                    onRemove={() => setCvFile(null)}
                  >
                    <Button icon={<UploadOutlined />} size="large" block>
                      {cvFile ? `✓ ${cvFile.name}` : 'Joindre votre CV'}
                    </Button>
                  </Upload>
                  {cvFile && (
                    <Text type="success" style={{ marginTop: 8, display: 'block', fontSize: '12px' }}>
                      ✓ Fichier sélectionné : {cvFile.name} ({(cvFile.size / 1024).toFixed(2)} KB)
                    </Text>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Lettre de Motivation (optionnel)"
                  name="lettreMotivation"
                  extra="Maximum 2000 caractères"
                >
                  <TextArea
                    rows={4}
                    placeholder="Expliquez pourquoi vous êtes le candidat idéal..."
                    showCount
                    maxLength={2000}
                    style={{ resize: 'vertical' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Progression upload */}
            {loading && uploadProgress > 0 && (
              <div style={{ marginBottom: 24 }}>
                <Text>Envoi en cours...</Text>
                <Progress percent={uploadProgress} status="active" />
              </div>
            )}

            {/* Actions */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Row gutter={16} justify="end" align="middle">
                <Col>
                  <Button 
                    onClick={() => navigate(`/offres/${offreId}`)}
                    disabled={loading}
                    size="large"
                  >
                    Annuler
                  </Button>
                </Col>
                <Col>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SendOutlined />}
                    loading={loading}
                    size="large"
                    style={{ minWidth: 200 }}
                  >
                    Envoyer ma candidature
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Card>

        {/* Note RGPD */}
        <Card style={{ marginTop: 16, background: '#fafafa' }} size="small">
          <Text type="secondary" style={{ fontSize: 12 }}>
            <FileTextOutlined /> En soumettant ce formulaire, vous acceptez que vos données personnelles 
            soient utilisées dans le cadre de ce processus de recrutement conformément au RGPD.
          </Text>
        </Card>
      </div>
    </div>
  );
}

export default CandidatureForm;