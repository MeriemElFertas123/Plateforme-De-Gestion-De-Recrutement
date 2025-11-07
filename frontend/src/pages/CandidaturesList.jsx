import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Input,
  Select,
  Space,
  message,
  Typography,
  Statistic,
  Progress,
  Avatar,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  TrophyOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import {
  getAllCandidatures,
  filterCandidatures,
  deleteCandidature,
  changerStatut,
  getStatistics,
  getStatutLabel,
  getStatutColor,
  getScoreColor,
  formatDate,
  getTempsEcoule
} from '../services/candidatureService';

const { Title, Text } = Typography;
const { Option } = Select;

function CandidaturesList() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('ALL');
  const [filterScore, setFilterScore] = useState(0);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadCandidatures();
    loadStatistics();
  }, []);

  const loadCandidatures = async () => {
    setLoading(true);
    try {
      const data = await getAllCandidatures();
      setCandidatures(data);
    } catch (error) {
      message.error('Erreur lors du chargement des candidatures');
      console.error(error);
    }
    setLoading(false);
  };

  const loadStatistics = async () => {
    try {
      const data = await getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCandidature(id);
      message.success('Candidature supprimée');
      loadCandidatures();
      loadStatistics();
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleChangeStatut = async (id, nouveauStatut) => {
    try {
      await changerStatut(id, nouveauStatut);
      message.success('Statut mis à jour');
      loadCandidatures();
      loadStatistics();
    } catch (error) {
      message.error('Erreur lors du changement de statut');
    }
  };

  // Filtrer les candidatures
  const filteredCandidatures = candidatures.filter(candidature => {
    const matchSearch = searchTerm === '' ||
      candidature.candidatNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidature.candidatPrenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidature.candidatEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidature.offreTitre?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatut = filterStatut === 'ALL' || candidature.statut === filterStatut;
    const matchScore = candidature.scoreMatching >= filterScore;

    return matchSearch && matchStatut && matchScore;
  });

  // Colonnes du tableau
  const columns = [
    {
      title: 'Candidat',
      key: 'candidat',
      render: (record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div>
              <Text strong>
                {record.candidatPrenom} {record.candidatNom}
              </Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <MailOutlined /> {record.candidatEmail}
              </Text>
            </div>
          </div>
        </Space>
      ),
      width: 250
    },
    {
      title: 'Offre',
      dataIndex: 'offreTitre',
      key: 'offre',
      render: (titre, record) => (
        <div>
          <Text>{titre}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {getTempsEcoule(record.datePostulation)}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'Score',
      key: 'score',
      render: (record) => (
        <Tooltip title={`${record.scoreMatching}% de correspondance`}>
          <Progress
            percent={record.scoreMatching}
            strokeColor={getScoreColor(record.scoreMatching)}
            size="small"
            style={{ width: 100 }}
          />
        </Tooltip>
      ),
      width: 120
    },
    {
      title: 'Statut',
      key: 'statut',
      render: (record) => (
        <Select
          value={record.statut}
          style={{ width: 180 }}
          size="small"
          onChange={(value) => handleChangeStatut(record.id, value)}
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
      ),
      width: 200
    },
    {
      title: 'Date',
      dataIndex: 'datePostulation',
      key: 'date',
      render: (date) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatDate(date)}
        </Text>
      ),
      width: 180
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space>
          <Tooltip title="Voir le détail">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/candidatures/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Supprimer cette candidature ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
      width: 100
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={2} style={{ margin: 0 }}>
            <UserOutlined /> Candidatures
          </Title>
          <Button icon={<ReloadOutlined />} onClick={loadCandidatures}>
            Actualiser
          </Button>
        </div>

        {/* Statistiques */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total"
                value={stats.TOTAL || 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Nouveaux"
                value={stats.NOUVEAU || 0}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="En Cours"
                value={(stats.EN_REVISION || 0) + (stats.PRESELECTIONNE || 0) + (stats.ENTRETIEN_RH || 0)}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Acceptés"
                value={stats.ACCEPTE || 0}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filtres */}
        <Card>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Input
              placeholder="Rechercher par nom, email, offre..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              allowClear
            />

            <Space>
              <Select
                style={{ width: 200 }}
                placeholder="Statut"
                value={filterStatut}
                onChange={setFilterStatut}
              >
                <Option value="ALL">Tous les statuts</Option>
                <Option value="NOUVEAU">Nouveau</Option>
                <Option value="EN_REVISION">En révision</Option>
                <Option value="PRESELECTIONNE">Présélectionné</Option>
                <Option value="ENTRETIEN_RH">Entretien RH</Option>
                <Option value="TEST_TECHNIQUE">Test technique</Option>
                <Option value="ENTRETIEN_FINAL">Entretien final</Option>
                <Option value="ACCEPTE">Accepté</Option>
                <Option value="REFUSE">Refusé</Option>
              </Select>

              <div>
                <Text>Score minimum : {filterScore}%</Text>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={filterScore}
                  onChange={(e) => setFilterScore(parseInt(e.target.value))}
                  style={{ width: 200, marginLeft: 12 }}
                />
              </div>
            </Space>
          </Space>
        </Card>
      </div>

      {/* Tableau */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredCandidatures}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total : ${total} candidatures`
          }}
        />
      </Card>
    </div>
  );
}

export default CandidaturesList;