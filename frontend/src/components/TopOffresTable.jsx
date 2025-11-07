import { Card, Table, Tag, Typography, Progress, Spin } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

function TopOffresTable({ data, loading, title = '🏆 Top Offres' }) {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Rang',
      key: 'rang',
      width: 60,
      render: (text, record, index) => (
        <Tag color={index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#cd7f32' : 'default'}>
          #{index + 1}
        </Tag>
      )
    },
    {
      title: 'Offre',
      dataIndex: 'titre',
      key: 'titre',
      render: (titre, record) => (
        <Text 
          strong 
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/offres/${record.id}`)}
        >
          {titre}
        </Text>
      )
    },
    {
      title: 'Candidatures',
      dataIndex: 'nombreCandidatures',
      key: 'nombreCandidatures',
      width: 120,
      render: (nombre) => (
        <Tag color="blue">{nombre}</Tag>
      )
    },
    {
      title: 'Vues',
      dataIndex: 'nombreVues',
      key: 'nombreVues',
      width: 100,
      render: (nombre) => (
        <Text type="secondary">{nombre}</Text>
      )
    },
    {
      title: 'Taux',
      dataIndex: 'tauxConversion',
      key: 'tauxConversion',
      width: 120,
      render: (taux) => (
        <div>
          <Progress 
            percent={taux} 
            size="small" 
            format={(percent) => `${percent}%`}
            strokeColor={taux >= 5 ? '#52c41a' : taux >= 3 ? '#faad14' : '#ff4d4f'}
          />
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <Card title={title}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin />
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} extra={<TrophyOutlined style={{ fontSize: 20, color: '#faad14' }} />}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        size="small"
      />
    </Card>
  );
}

export default TopOffresTable;