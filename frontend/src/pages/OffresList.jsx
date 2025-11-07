import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OffreCard from '../components/OffreCard';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Spin, 
  Empty, 
  message,
  Space,
  Typography,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { 
  getAllOffres, 
  getOffresActives,
  getMesOffres
} from '../services/offreService';

const { Title } = Typography;
const { Option } = Select;

function OffresList() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('ALL');
  const [filterTypeContrat, setFilterTypeContrat] = useState('ALL');
  const [filterLocalisation, setFilterLocalisation] = useState('ALL');
  const [filterDepartement, setFilterDepartement] = useState('ALL');
  const [filterSalaireMin, setFilterSalaireMin] = useState(0);
  const [filterTeletravail, setFilterTeletravail] = useState(false);
  const navigate = useNavigate();

  // Charger les offres au démarrage
  useEffect(() => {
    loadOffres();
  }, []);

  const loadOffres = async () => {
    setLoading(true);
    try {
      const data = await getAllOffres();
      setOffres(data);
    } catch (error) {
      message.error('Erreur lors du chargement des offres');
    }
    setLoading(false);
  };

  const loadOffresActives = async () => {
    setLoading(true);
    try {
      const data = await getOffresActives();
      setOffres(data);
      setFilterStatut('PUBLIEE');
      message.success('Offres actives chargées');
    } catch (error) {
      message.error('Erreur lors du chargement');
    }
    setLoading(false);
  };

  const loadMesOffres = async () => {
    setLoading(true);
    try {
      const data = await getMesOffres();
      setOffres(data);
      message.success('Vos offres chargées');
    } catch (error) {
      message.error('Erreur lors du chargement');
    }
    setLoading(false);
  };

  // Filtrer les offres
  const filteredOffres = offres.filter(offre => {
    const matchSearch = searchTerm === '' || 
      offre.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.localisation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.competencesRequises?.some(comp => 
        comp.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchStatut = filterStatut === 'ALL' || offre.statut === filterStatut;
    const matchTypeContrat = filterTypeContrat === 'ALL' || offre.typeContrat === filterTypeContrat;
    const matchLocalisation = filterLocalisation === 'ALL' || offre.localisation === filterLocalisation;
    const matchDepartement = filterDepartement === 'ALL' || offre.departement === filterDepartement;
    const matchSalaire = filterSalaireMin === 0 || (offre.salaireMin && offre.salaireMin >= filterSalaireMin);
    const matchTeletravail = !filterTeletravail || offre.teletravailPossible === true;

    return matchSearch && matchStatut && matchTypeContrat && matchLocalisation && 
           matchDepartement && matchSalaire && matchTeletravail;
  });

  const stats = {
    total: offres.length,
    publiees: offres.filter(o => o.statut === 'PUBLIEE').length,
    brouillons: offres.filter(o => o.statut === 'BROUILLON').length,
    pourvues: offres.filter(o => o.statut === 'POURVUE').length
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={2} style={{ margin: 0 }}>
            <FileTextOutlined /> Offres d'Emploi
          </Title>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadOffres}>
              Actualiser
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/offres/create')}>
              Créer une Offre
            </Button>
          </Space>
        </div>

        {/* Statistiques */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}><Card><Statistic title="Total" value={stats.total} /></Card></Col>
          <Col span={6}><Card><Statistic title="Publiées" value={stats.publiees} valueStyle={{ color: '#52c41a' }}/></Card></Col>
          <Col span={6}><Card><Statistic title="Brouillons" value={stats.brouillons} valueStyle={{ color: '#faad14' }}/></Card></Col>
          <Col span={6}><Card><Statistic title="Pourvues" value={stats.pourvues} valueStyle={{ color: '#1890ff' }}/></Card></Col>
        </Row>

        {/* Filtres */}
        <Card>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Input
              placeholder="Rechercher par titre, description, localisation..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              allowClear
            />

            <Space wrap>
              <Select
                style={{ width: 180 }}
                value={filterStatut}
                onChange={setFilterStatut}
              >
                <Option value="ALL">Tous les statuts</Option>
                <Option value="BROUILLON">Brouillon</Option>
                <Option value="PUBLIEE">Publiée</Option>
                <Option value="EXPIREE">Expirée</Option>
                <Option value="POURVUE">Pourvue</Option>
                <Option value="ARCHIVEE">Archivée</Option>
              </Select>

              <Select
                style={{ width: 180 }}
                value={filterTypeContrat}
                onChange={setFilterTypeContrat}
              >
                <Option value="ALL">Tous les contrats</Option>
                <Option value="CDI">CDI</Option>
                <Option value="CDD">CDD</Option>
                <Option value="STAGE">Stage</Option>
                <Option value="ALTERNANCE">Alternance</Option>
                <Option value="FREELANCE">Freelance</Option>
              </Select>

              <Select
                style={{ width: 180 }}
                value={filterLocalisation}
                onChange={setFilterLocalisation}
              >
                <Option value="ALL">Toutes les villes</Option>
                <Option value="Paris">Paris</Option>
                <Option value="Lyon">Lyon</Option>
                <Option value="Marseille">Marseille</Option>
              </Select>

              <Select
                style={{ width: 180 }}
                value={filterDepartement}
                onChange={setFilterDepartement}
              >
                <Option value="ALL">Tous les départements</Option>
                <Option value="Informatique">Informatique</Option>
                <Option value="RH">Ressources Humaines</Option>
                <Option value="Marketing">Marketing</Option>
              </Select>

              <Button onClick={loadOffresActives}>Offres Actives</Button>
              <Button onClick={loadMesOffres}>Mes Offres</Button>
            </Space>
          </Space>
        </Card>
      </div>

      {/* Liste des Offres */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Chargement des offres..." />
        </div>
      ) : filteredOffres.length === 0 ? (
        <Card><Empty description="Aucune offre trouvée" /></Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredOffres.map(offre => (
            <Col xs={24} sm={12} lg={8} key={offre.id}>
              <OffreCard offre={offre} onUpdate={loadOffres} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default OffresList;
