import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Switch,
  Space,
  message,
  Row,
  Col,
  Typography,
  Spin,
  Alert
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { getOffreById, updateOffre } from '../services/offreService';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function OffreEdit() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [offre, setOffre] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Charger l'offre au démarrage
  useEffect(() => {
    loadOffre();
  }, [id]);

  const loadOffre = async () => {
    setLoading(true);
    try {
      const data = await getOffreById(id);
      setOffre(data);
      
      // Pré-remplir le formulaire
      form.setFieldsValue({
        titre: data.titre,
        description: data.description,
        typeContrat: data.typeContrat,
        localisation: data.localisation,
        departement: data.departement,
        teletravailPossible: data.teletravailPossible,
        competencesRequises: data.competencesRequises || [],
        competencesSouhaitees: data.competencesSouhaitees || [],
        experienceRequise: data.experienceRequise,
        niveauEtudesRequis: data.niveauEtudesRequis,
        salaireMin: data.salaireMin,
        salaireMax: data.salaireMax,
        avantages: data.avantages || [],
        etapesRecrutement: data.etapesRecrutement || []
      });
    } catch (error) {
      message.error('Erreur lors du chargement de l\'offre');
      console.error(error);
    }
    setLoading(false);
  };

  // Soumettre les modifications
  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const offreData = {
        ...values,
        competencesRequises: values.competencesRequises || [],
        competencesSouhaitees: values.competencesSouhaitees || [],
        avantages: values.avantages || [],
        etapesRecrutement: values.etapesRecrutement || []
      };

      const response = await updateOffre(id, offreData);
      message.success('Offre modifiée avec succès !');
      navigate(`/offres/${id}`);
    } catch (error) {
      message.error(error.response?.data?.error || 'Erreur lors de la modification');
      console.error(error);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" tip="Chargement de l'offre..." />
      </div>
    );
  }

  if (!offre) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Offre non trouvée"
          description="L'offre que vous cherchez n'existe pas ou a été supprimée."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/offres')}>
            Retour
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            Modifier l'Offre : {offre.titre}
          </Title>
        </Space>
      </Card>

      {/* Formulaire */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {/* Section 1 : Informations Générales */}
        <Card title="📋 Informations Générales" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            {/* Titre */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Titre du Poste"
                name="titre"
                rules={[
                  { required: true, message: 'Le titre est obligatoire' },
                  { min: 5, message: 'Minimum 5 caractères' },
                  { max: 200, message: 'Maximum 200 caractères' }
                ]}
              >
                <Input 
                  placeholder="Ex: Développeur Full Stack Senior"
                  size="large"
                />
              </Form.Item>
            </Col>

            {/* Type de contrat */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Type de Contrat"
                name="typeContrat"
                rules={[{ required: true, message: 'Le type de contrat est obligatoire' }]}
              >
                <Select size="large">
                  <Option value="CDI">CDI</Option>
                  <Option value="CDD">CDD</Option>
                  <Option value="STAGE">Stage</Option>
                  <Option value="ALTERNANCE">Alternance</Option>
                  <Option value="FREELANCE">Freelance</Option>
                  <Option value="INTERIM">Intérim</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Description */}
            <Col xs={24}>
              <Form.Item
                label="Description du Poste"
                name="description"
                rules={[
                  { required: true, message: 'La description est obligatoire' },
                  { min: 50, message: 'Minimum 50 caractères' }
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Décrivez le poste en détail..."
                  showCount
                  maxLength={2000}
                />
              </Form.Item>
            </Col>

            {/* Localisation */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Localisation"
                name="localisation"
                rules={[{ required: true, message: 'La localisation est obligatoire' }]}
              >
                <Select size="large" showSearch>
                  <Option value="Paris">Paris</Option>
                  <Option value="Lyon">Lyon</Option>
                  <Option value="Marseille">Marseille</Option>
                  <Option value="Toulouse">Toulouse</Option>
                  <Option value="Bordeaux">Bordeaux</Option>
                  <Option value="Lille">Lille</Option>
                  <Option value="Nantes">Nantes</Option>
                  <Option value="Remote">Remote</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Département */}
            <Col xs={24} md={12}>
              <Form.Item label="Département" name="departement">
                <Select size="large" allowClear>
                  <Option value="Informatique">Informatique</Option>
                  <Option value="RH">Ressources Humaines</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Commercial">Commercial</Option>
                  <Option value="Finance">Finance</Option>
                  <Option value="Juridique">Juridique</Option>
                  <Option value="Production">Production</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Télétravail */}
            <Col xs={24}>
              <Form.Item
                label="Télétravail Possible"
                name="teletravailPossible"
                valuePropName="checked"
              >
                <Switch checkedChildren="Oui" unCheckedChildren="Non" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Section 2 : Compétences */}
        <Card title="💡 Compétences" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Compétences Requises"
                name="competencesRequises"
                rules={[{ required: true, message: 'Au moins une compétence requise' }]}
              >
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Ex: Java, React, MongoDB"
                  style={{ width: '100%' }}
                >
                  <Option value="Java">Java</Option>
                  <Option value="Spring Boot">Spring Boot</Option>
                  <Option value="React">React</Option>
                  <Option value="Angular">Angular</Option>
                  <Option value="Node.js">Node.js</Option>
                  <Option value="Python">Python</Option>
                  <Option value="MongoDB">MongoDB</Option>
                  <Option value="Docker">Docker</Option>
                  <Option value="AWS">AWS</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Compétences Souhaitées"
                name="competencesSouhaitees"
              >
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Compétences bonus"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Section 3 : Expérience et Formation */}
        <Card title="🎓 Expérience & Formation" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Années d'Expérience Requises"
                name="experienceRequise"
              >
                <InputNumber
                  min={0}
                  max={20}
                  style={{ width: '100%' }}
                  size="large"
                  addonAfter="ans"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Niveau d'Études Requis"
                name="niveauEtudesRequis"
              >
                <Select size="large" allowClear>
                  <Option value="BAC">Baccalauréat</Option>
                  <Option value="BAC_PLUS_2">Bac +2</Option>
                  <Option value="BAC_PLUS_3">Bac +3</Option>
                  <Option value="BAC_PLUS_5">Bac +5</Option>
                  <Option value="DOCTORAT">Doctorat</Option>
                  <Option value="AUCUN">Aucun</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Section 4 : Rémunération */}
        <Card title="💰 Rémunération" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Salaire Minimum" name="salaireMin">
                <InputNumber
                  min={0}
                  step={1000}
                  style={{ width: '100%' }}
                  size="large"
                  addonAfter="€"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Salaire Maximum" name="salaireMax">
                <InputNumber
                  min={0}
                  step={1000}
                  style={{ width: '100%' }}
                  size="large"
                  addonAfter="€"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Section 5 : Avantages */}
        <Card title="🎁 Avantages" style={{ marginBottom: 24 }}>
          <Form.List name="avantages">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...field}
                      rules={[{ required: true, message: 'Saisissez un avantage' }]}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <Input placeholder="Ex: Tickets restaurant" size="large" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Ajouter un Avantage
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        {/* Section 6 : Étapes de Recrutement */}
        <Card title="🔄 Étapes de Recrutement" style={{ marginBottom: 24 }}>
          <Form.List name="etapesRecrutement">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card 
                    key={field.key} 
                    size="small" 
                    style={{ marginBottom: 16 }}
                    extra={<MinusCircleOutlined onClick={() => remove(field.name)} />}
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'nom']}
                          label="Nom de l'étape"
                          rules={[{ required: true, message: 'Nom requis' }]}
                        >
                          <Input placeholder="Ex: Entretien RH" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'description']}
                          label="Description"
                        >
                          <Input placeholder="Détails" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'ordre']}
                          label="Ordre"
                        >
                          <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Ajouter une Étape
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        {/* Actions */}
        <Card>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<CheckCircleOutlined />}
              loading={submitting}
              size="large"
            >
              Enregistrer les Modifications
            </Button>
            <Button 
              onClick={() => navigate(`/offres/${id}`)}
              size="large"
            >
              Annuler
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
}

export default OffreEdit;