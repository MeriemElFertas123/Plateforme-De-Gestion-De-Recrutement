import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Space,
  message,
  Row,
  Col,
  Typography,
  Spin,
  Alert
} from 'antd';
import dayjs from 'dayjs';
import { createEntretien, updateEntretien, getEntretienById } from '../services/entretienService';
import { getAllCandidatures } from '../services/candidatureService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function EntretienForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [candidatures, setCandidatures] = useState([]);
  const [entretien, setEntretien] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    loadCandidatures();
    if (isEdit) {
      loadEntretien();
    }
  }, [id]);

  const loadCandidatures = async () => {
    try {
      const data = await getAllCandidatures();
      // Filtrer les candidatures actives
      const actives = data.filter(c => 
        !['REFUSE', 'RETIRE'].includes(c.statut)
      );
      setCandidatures(actives);
    } catch (error) {
      message.error('Erreur lors du chargement des candidatures');
    }
  };

  const loadEntretien = async () => {
    setLoadingData(true);
    try {
      const data = await getEntretienById(id);
      setEntretien(data);
      
      // Pré-remplir le formulaire
      form.setFieldsValue({
        candidatureId: data.candidatureId,
        titre: data.titre,
        description: data.description,
        type: data.type,
        dateDebut: data.dateDebut ? dayjs(data.dateDebut) : null,
        dureeMinutes: data.dureeMinutes,
        typeLieu: data.typeLieu,
        lieu: data.lieu,
        salle: data.salle,
        interviewersNoms: data.interviewersNoms,
        statut: data.statut
      });
    } catch (error) {
      message.error('Erreur lors du chargement de l\'entretien');
      navigate('/entretiens');
    }
    setLoadingData(false);
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const entretienData = {
        ...values,
        dateDebut: values.dateDebut ? values.dateDebut.format('YYYY-MM-DDTHH:mm:ss') : null
      };

      if (isEdit) {
        await updateEntretien(id, entretienData);
        message.success('Entretien mis à jour avec succès !');
      } else {
        await createEntretien(entretienData);
        message.success('Entretien planifié avec succès !');
      }

      navigate('/entretiens');
    } catch (error) {
      message.error(error.response?.data?.error || 'Erreur lors de la sauvegarde');
      console.error(error);
    }

    setLoading(false);
  };

  if (loadingData) {
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

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button 
            icon={<i className="fas fa-arrow-left"></i>}
            onClick={() => navigate('/entretiens')}
          >
            Retour
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
            {isEdit ? 'Modifier l\'Entretien' : 'Planifier un Entretien'}
          </Title>
        </Space>
      </Card>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            type: 'ENTRETIEN_RH',
            dureeMinutes: 60,
            typeLieu: 'VISIO',
            statut: 'PLANIFIE'
          }}
        >
          {/* Candidature */}
          <Card title={<><i className="fas fa-user" style={{ marginRight: '8px' }}></i>Candidat</>} style={{ marginBottom: 24 }}>
            <Form.Item
              label="Candidature"
              name="candidatureId"
              rules={[{ required: true, message: 'La candidature est obligatoire' }]}
            >
              <Select
                placeholder="Sélectionnez une candidature"
                showSearch
                size="large"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                disabled={isEdit}
              >
                {candidatures.map(c => (
                  <Option key={c.id} value={c.id}>
                    {c.candidatPrenom} {c.candidatNom} - {c.offreTitre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Card>

          {/* Informations de l'entretien */}
          <Card title={<><i className="fas fa-clipboard-list" style={{ marginRight: '8px' }}></i>Informations</>} style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              {/* Titre */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Titre"
                  name="titre"
                  rules={[
                    { required: true, message: 'Le titre est obligatoire' },
                    { min: 5, message: 'Minimum 5 caractères' }
                  ]}
                >
                  <Input 
                    placeholder="Ex: Entretien RH - Développeur React"
                    size="large"
                  />
                </Form.Item>
              </Col>

              {/* Type */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Type d'entretien"
                  name="type"
                  rules={[{ required: true, message: 'Le type est obligatoire' }]}
                >
                  <Select size="large">
                    <Option value="ENTRETIEN_RH"><i className="fas fa-users" style={{ marginRight: '8px' }}></i>Entretien RH</Option>
                    <Option value="ENTRETIEN_TECHNIQUE"><i className="fas fa-code" style={{ marginRight: '8px' }}></i>Entretien Technique</Option>
                    <Option value="ENTRETIEN_MANAGER"><i className="fas fa-user-tie" style={{ marginRight: '8px' }}></i>Entretien Manager</Option>
                    <Option value="ENTRETIEN_FINAL"><i className="fas fa-flag-checkered" style={{ marginRight: '8px' }}></i>Entretien Final</Option>
                    <Option value="TEST_TECHNIQUE"><i className="fas fa-laptop-code" style={{ marginRight: '8px' }}></i>Test Technique</Option>
                    <Option value="ASSESSMENT_CENTER"><i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>Assessment Center</Option>
                    <Option value="AUTRE"><i className="fas fa-ellipsis-h" style={{ marginRight: '8px' }}></i>Autre</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Description */}
              <Col xs={24}>
                <Form.Item
                  label="Description / Ordre du jour"
                  name="description"
                >
                  <TextArea
                    rows={4}
                    placeholder="Décrivez l'objectif de l'entretien, les sujets à aborder..."
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Date et durée */}
          <Card title={<><i className="fas fa-clock" style={{ marginRight: '8px' }}></i>Planification</>} style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              {/* Date et heure */}
              <Col xs={24} md={16}>
                <Form.Item
                  label="Date et Heure de début"
                  name="dateDebut"
                  rules={[{ required: true, message: 'La date est obligatoire' }]}
                >
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="DD/MM/YYYY HH:mm"
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Sélectionnez la date et l'heure"
                  />
                </Form.Item>
              </Col>

              {/* Durée */}
              <Col xs={24} md={8}>
                <Form.Item
                  label="Durée (minutes)"
                  name="dureeMinutes"
                  rules={[{ required: true, message: 'La durée est obligatoire' }]}
                >
                  <InputNumber
                    min={15}
                    max={480}
                    step={15}
                    size="large"
                    style={{ width: '100%' }}
                    addonAfter="min"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Lieu */}
          <Card title={<><i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>Lieu</>} style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              {/* Type de lieu */}
              <Col xs={24} md={8}>
                <Form.Item
                  label="Type de lieu"
                  name="typeLieu"
                  rules={[{ required: true, message: 'Le type de lieu est obligatoire' }]}
                >
                  <Select size="large">
                    <Option value="PRESENTIEL"><i className="fas fa-building" style={{ marginRight: '8px' }}></i>Présentiel</Option>
                    <Option value="VISIO"><i className="fas fa-video" style={{ marginRight: '8px' }}></i>Visioconférence</Option>
                    <Option value="TELEPHONIQUE"><i className="fas fa-phone" style={{ marginRight: '8px' }}></i>Téléphonique</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Lieu/Lien */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Adresse / Lien de visio / Numéro"
                  name="lieu"
                  rules={[{ required: true, message: 'Le lieu est obligatoire' }]}
                >
                  <Input 
                    placeholder="Ex: https://meet.google.com/abc-defg-hij"
                    size="large"
                  />
                </Form.Item>
              </Col>

              {/* Salle */}
              <Col xs={24} md={4}>
                <Form.Item
                  label="Salle"
                  name="salle"
                >
                  <Input 
                    placeholder="Ex: B201"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Participants */}
          <Card title={<><i className="fas fa-users" style={{ marginRight: '8px' }}></i>Interviewers</>} style={{ marginBottom: 24 }}>
            <Form.Item
              label="Noms des interviewers"
              name="interviewersNoms"
              tooltip="Ajoutez les noms des personnes qui participeront à l'entretien"
            >
              <Select
                mode="tags"
                size="large"
                placeholder="Ex: Marie Dupont, Jean Martin"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Alert
              message="Astuce"
              description="Tapez un nom et appuyez sur Entrée pour l'ajouter. Vous pouvez en ajouter plusieurs."
              type="info"
              showIcon
              icon={<i className="fas fa-lightbulb"></i>}
            />
          </Card>

          {/* Statut (seulement en édition) */}
          {isEdit && (
            <Card title={<><i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>Statut</>} style={{ marginBottom: 24 }}>
              <Form.Item
                label="Statut de l'entretien"
                name="statut"
              >
                <Select size="large">
                  <Option value="PLANIFIE"><i className="fas fa-calendar" style={{ marginRight: '8px' }}></i>Planifié</Option>
                  <Option value="CONFIRME"><i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>Confirmé</Option>
                  <Option value="EN_COURS"><i className="fas fa-spinner" style={{ marginRight: '8px' }}></i>En cours</Option>
                  <Option value="TERMINE"><i className="fas fa-flag-checkered" style={{ marginRight: '8px' }}></i>Terminé</Option>
                  <Option value="EVALUE"><i className="fas fa-star" style={{ marginRight: '8px' }}></i>Évalué</Option>
                  <Option value="ANNULE"><i className="fas fa-times-circle" style={{ marginRight: '8px' }}></i>Annulé</Option>
                  <Option value="REPORTE"><i className="fas fa-calendar-plus" style={{ marginRight: '8px' }}></i>Reporté</Option>
                </Select>
              </Form.Item>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<i className="fas fa-save" style={{ marginRight: '8px' }}></i>}
                loading={loading}
                size="large"
              >
                {isEdit ? 'Enregistrer les Modifications' : 'Planifier l\'Entretien'}
              </Button>
              <Button 
                onClick={() => navigate('/entretiens')}
                size="large"
              >
                Annuler
              </Button>
            </Space>
          </Card>
        </Form>
      </div>
    </div>
  );
}

export default EntretienForm;