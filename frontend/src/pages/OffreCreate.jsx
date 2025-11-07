import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
  Tag
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { createOffre } from '../services/offreService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function OffreCreate() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [competencesInput, setCompetencesInput] = useState('');
  const [competencesSouhaitees, setCompetencesSouhaitees] = useState('');
  const navigate = useNavigate();

  // Soumettre le formulaire
  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Convertir les compétences (string séparé par virgules → array)
      const offreData = {
        ...values,
        competencesRequises: values.competencesRequises || [],
        competencesSouhaitees: values.competencesSouhaitees || [],
        avantages: values.avantages || []
      };

      const response = await createOffre(offreData);
      message.success('Offre créée avec succès !');
      navigate(`/offres/${response.id}`);
    } catch (error) {
      message.error('Erreur lors de la création de l\'offre');
      console.error(error);
    }

    setLoading(false);
  };

  // Sauvegarder en brouillon
  const saveDraft = () => {
    form.validateFields()
      .then(values => {
        onFinish(values);
      })
      .catch(() => {
        message.warning('Veuillez remplir les champs obligatoires');
      });
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/offres')}>
            Retour
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            Créer une Offre d'Emploi
          </Title>
        </Space>
      </Card>

      {/* Formulaire */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          teletravailPossible: false,
          typeContrat: 'CDI',
          experienceRequise: 0
        }}
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
                  placeholder="Décrivez le poste en détail : missions, responsabilités, environnement de travail..."
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
                <Select
                  size="large"
                  showSearch
                  placeholder="Sélectionnez une ville"
                >
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
              <Form.Item
                label="Département"
                name="departement"
              >
                <Select
                  size="large"
                  placeholder="Sélectionnez un département"
                  allowClear
                >
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
            {/* Compétences requises */}
            <Col xs={24}>
              <Form.Item
                label="Compétences Requises"
                name="competencesRequises"
                rules={[{ required: true, message: 'Au moins une compétence requise' }]}
              >
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Ex: Java, React, MongoDB (Appuyez sur Entrée pour ajouter)"
                  style={{ width: '100%' }}
                >
                  <Option value="Java">Java</Option>
                  <Option value="Spring Boot">Spring Boot</Option>
                  <Option value="React">React</Option>
                  <Option value="Angular">Angular</Option>
                  <Option value="Vue.js">Vue.js</Option>
                  <Option value="Node.js">Node.js</Option>
                  <Option value="Python">Python</Option>
                  <Option value="MongoDB">MongoDB</Option>
                  <Option value="PostgreSQL">PostgreSQL</Option>
                  <Option value="Docker">Docker</Option>
                  <Option value="Kubernetes">Kubernetes</Option>
                  <Option value="AWS">AWS</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Compétences souhaitées */}
            <Col xs={24}>
              <Form.Item
                label="Compétences Souhaitées (Bonus)"
                name="competencesSouhaitees"
              >
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Compétences qui seraient un plus"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Section 3 : Expérience et Formation */}
        <Card title="🎓 Expérience & Formation" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            {/* Expérience requise */}
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

            {/* Niveau d'études */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Niveau d'Études Requis"
                name="niveauEtudesRequis"
              >
                <Select size="large" placeholder="Sélectionnez un niveau" allowClear>
                  <Option value="BAC">Baccalauréat</Option>
                  <Option value="BAC_PLUS_2">Bac +2</Option>
                  <Option value="BAC_PLUS_3">Bac +3 (Licence)</Option>
                  <Option value="BAC_PLUS_5">Bac +5 (Master)</Option>
                  <Option value="DOCTORAT">Doctorat</Option>
                  <Option value="AUCUN">Aucun diplôme requis</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Section 4 : Rémunération */}
        <Card title="💰 Rémunération" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Salaire Minimum (Annuel Brut)"
                name="salaireMin"
              >
                <InputNumber
                  min={0}
                  step={1000}
                  style={{ width: '100%' }}
                  size="large"
                  addonAfter="€"
                  placeholder="Ex: 40000"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Salaire Maximum (Annuel Brut)"
                name="salaireMax"
              >
                <InputNumber
                  min={0}
                  step={1000}
                  style={{ width: '100%' }}
                  size="large"
                  addonAfter="€"
                  placeholder="Ex: 55000"
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
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...field}
                      rules={[{ required: true, message: 'Saisissez un avantage' }]}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <Input placeholder="Ex: Tickets restaurant, Mutuelle..." size="large" />
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

        {/* Section 6 : Processus de Recrutement */}
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
                          <Input placeholder="Détails de l'étape" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'ordre']}
                          label="Ordre"
                          initialValue={index + 1}
                        >
                          <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                  >
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
              loading={loading}
              size="large"
            >
              Créer l'Offre
            </Button>
            <Button 
              onClick={saveDraft}
              icon={<SaveOutlined />}
              size="large"
            >
              Sauvegarder en Brouillon
            </Button>
            <Button 
              onClick={() => navigate('/offres')}
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

export default OffreCreate;