import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Space,
  message,
  Typography,
  Statistic,
  Tabs,
  Avatar,
  Tooltip,
  Popconfirm,
  Badge,
  Select
} from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  HomeOutlined
} from '@ant-design/icons';
import {
  getAllEntretiens,
  getEntretiensAujourdhui,
  getEntretiensAVenir,
  getEntretiensPasses,
  deleteEntretien,
  changerStatut,
  getStatistics,
  getTypeLabel,
  getStatutLabel,
  getStatutColor,
  getTypeLieuIcon,
  formatDate,
  formatHeure,
  formatDuree,
  getTempsAvant,
  estAujourdhui,
  estPasse
} from '../services/entretienService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

function EntretiensList() {
  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('tous');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [entretiensData, statsData] = await Promise.all([
        getAllEntretiens(),
        getStatistics()
      ]);
      setEntretiens(entretiensData);
      setStats(statsData);
    } catch (error) {
      message.error('Erreur lors du chargement des entretiens');
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntretien(id);
      message.success('Entretien supprimé');
      loadData();
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleChangeStatut = async (id, nouveauStatut) => {
    try {
      await changerStatut(id, nouveauStatut);
      message.success('Statut mis à jour');
      loadData();
    } catch (error) {
      message.error('Erreur lors du changement de statut');
    }
  };

  // Filtrer selon l'onglet actif
  const getEntretiensFiltres = () => {
    switch (activeTab) {
      case 'aujourdhui':
        return entretiens.filter(e => estAujourdhui(e.dateDebut));
      case 'a-venir':
        return entretiens.filter(e => !estPasse(e.dateDebut));
      case 'passes':
        return entretiens.filter(e => estPasse(e.dateDebut));
      default:
        return entretiens;
    }
  };

  const entretiensFiltres = getEntretiensFiltres();

  // Obtenir l'icône du type de lieu
  const getLieuIcon = (typeLieu) => {
    switch (typeLieu) {
      case 'PRESENTIEL':
        return <HomeOutlined />;
      case 'VISIO':
        return <VideoCameraOutlined />;
      case 'TELEPHONIQUE':
        return <PhoneOutlined />;
      default:
        return <EnvironmentOutlined />;
    }
  };

  // Colonnes du tableau
  const columns = [
    {
      title: 'Date & Heure',
      key: 'date',
      width: 180,
      render: (record) => {
        const isToday = estAujourdhui(record.dateDebut);
        const isPast = estPasse(record.dateDebut);
        
        return (
          <div>
            <div>
              <Text strong={isToday} type={isPast ? 'secondary' : undefined}>
                {formatDate(record.dateDebut).split(' à ')[0]}
              </Text>
            </div>
            <div>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatHeure(record.dateDebut)} ({formatDuree(record.dureeMinutes)})
              </Text>
            </div>
            {!isPast && (
              <div>
                <Tag color="blue" style={{ fontSize: 10, marginTop: 4 }}>
                  {getTempsAvant(record.dateDebut)}
                </Tag>
              </div>
            )}
          </div>
        );
      },
      sorter: (a, b) => new Date(a.dateDebut) - new Date(b.dateDebut),
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Candidat',
      key: 'candidat',
      width: 200,
      render: (record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div>
              <Text strong>
                {record.candidatPrenom} {record.candidatNom}
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.offreTitre}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type) => (
        <Tag color="purple">{getTypeLabel(type)}</Tag>
      ),
      filters: [
        { text: 'Entretien RH', value: 'ENTRETIEN_RH' },
        { text: 'Entretien Technique', value: 'ENTRETIEN_TECHNIQUE' },
        { text: 'Entretien Manager', value: 'ENTRETIEN_MANAGER' },
        { text: 'Entretien Final', value: 'ENTRETIEN_FINAL' },
        { text: 'Test Technique', value: 'TEST_TECHNIQUE' }
      ],
      onFilter: (value, record) => record.type === value
    },
    {
      title: 'Lieu',
      key: 'lieu',
      width: 120,
      render: (record) => (
        <Space>
          {getLieuIcon(record.typeLieu)}
          <Text>{record.typeLieu === 'PRESENTIEL' ? 'Présentiel' : record.typeLieu === 'VISIO' ? 'Visio' : 'Tél'}</Text>
        </Space>
      )
    },
    {
      title: 'Statut',
      key: 'statut',
      width: 150,
      render: (record) => (
        <Select
          value={record.statut}
          style={{ width: '100%' }}
          size="small"
          onChange={(value) => handleChangeStatut(record.id, value)}
        >
          <Option value="PLANIFIE">📋 Planifié</Option>
          <Option value="CONFIRME">✅ Confirmé</Option>
          <Option value="EN_COURS">⏳ En cours</Option>
          <Option value="TERMINE">✔️ Terminé</Option>
          <Option value="EVALUE">⭐ Évalué</Option>
          <Option value="ANNULE">❌ Annulé</Option>
          <Option value="REPORTE">📅 Reporté</Option>
        </Select>
      )
    },
    {
      title: 'Interviewers',
      dataIndex: 'interviewersNoms',
      key: 'interviewers',
      width: 150,
      render: (noms) => (
        <div>
          {noms && noms.length > 0 ? (
            <>
              <Text style={{ fontSize: 12 }}>{noms[0]}</Text>
              {noms.length > 1 && (
                <div>
                  <Tag style={{ fontSize: 10 }}>+{noms.length - 1}</Tag>
                </div>
              )}
            </>
          ) : (
            <Text type="secondary" style={{ fontSize: 12 }}>Non assigné</Text>
          )}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (record) => (
        <Space>
          <Tooltip title="Voir le détail">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/entretiens/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/entretiens/edit/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Supprimer cet entretien ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={2} style={{ margin: 0 }}>
            <CalendarOutlined /> Entretiens
          </Title>
          <Space>
            <Button
                icon={<CalendarOutlined />}
                onClick={() => navigate('/entretiens/calendar')}
            >
                Vue Calendrier
            </Button>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/entretiens/create')}
            >
                Planifier un Entretien
            </Button>
            <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
            >
                Actualiser
            </Button>
            </Space>
        </div>

        {/* Statistiques */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total"
                value={stats.TOTAL || 0}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Aujourd'hui"
                value={stats.AUJOURDHUI || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="À venir"
                value={stats.A_VENIR || 0}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Confirmés"
                value={stats.CONFIRME || 0}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Onglets et Tableau */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                Tous les entretiens
                <Badge count={entretiens.length} showZero style={{ marginLeft: 8 }} />
              </span>
            } 
            key="tous"
          />
          <TabPane 
            tab={
              <span>
                Aujourd'hui
                <Badge count={entretiens.filter(e => estAujourdhui(e.dateDebut)).length} style={{ marginLeft: 8 }} />
              </span>
            } 
            key="aujourdhui"
          />
          <TabPane 
            tab={
              <span>
                À venir
                <Badge count={entretiens.filter(e => !estPasse(e.dateDebut)).length} style={{ marginLeft: 8 }} />
              </span>
            } 
            key="a-venir"
          />
          <TabPane 
            tab="Passés" 
            key="passes"
          />
        </Tabs>

        <Table
          columns={columns}
          dataSource={entretiensFiltres}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total : ${total} entretiens`
          }}
          scroll={{ x: 1200 }}
          rowClassName={(record) => {
            if (estAujourdhui(record.dateDebut)) return 'row-today';
            if (estPasse(record.dateDebut)) return 'row-past';
            return '';
          }}
        />
      </Card>

      <style jsx>{`
        .row-today {
          background-color: #fff7e6 !important;
        }
        .row-past {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

export default EntretiensList;