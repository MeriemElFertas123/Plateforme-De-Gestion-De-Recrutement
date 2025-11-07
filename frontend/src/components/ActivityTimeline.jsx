import { Card, Timeline, Tag, Typography, Spin, Empty } from 'antd';
import { 
  UserAddOutlined, 
  CalendarOutlined,
  FileTextOutlined 
} from '@ant-design/icons';
import { formatDateForChart } from '../services/AnalyticsService';

const { Text } = Typography;

function ActivityTimeline({ data, loading, title = '🕐 Activité Récente' }) {
  if (loading) {
    return (
      <Card title={title}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title={title}>
        <Empty description="Aucune activité récente" />
      </Card>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'CANDIDATURE':
        return <UserAddOutlined />;
      case 'ENTRETIEN':
        return <CalendarOutlined />;
      case 'OFFRE':
        return <FileTextOutlined />;
      default:
        return null;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'CANDIDATURE':
        return 'blue';
      case 'ENTRETIEN':
        return 'green';
      case 'OFFRE':
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <Card title={title}>
      <Timeline
        items={data.map((item, index) => ({
          dot: getIcon(item.type),
          color: getColor(item.type),
          children: (
            <div key={index}>
              <div>
                <Tag color={getColor(item.type)}>{item.type}</Tag>
              </div>
              <Text>{item.description}</Text>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {formatDateForChart(item.date)}
                </Text>
              </div>
            </div>
          )
        }))}
      />
    </Card>
  );
}

export default ActivityTimeline;