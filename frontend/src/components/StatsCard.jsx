import { Card, Statistic, Typography, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

function StatsCard({ 
  title, 
  value, 
  prefix, 
  suffix, 
  trend, 
  trendValue,
  valueStyle,
  loading = false
}) {
  return (
    <Card loading={loading}>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={valueStyle || { color: '#1890ff' }}
      />
      {trend && (
        <Space style={{ marginTop: 8 }}>
          {trend === 'up' && (
            <>
              <ArrowUpOutlined style={{ color: '#52c41a' }} />
              <Text style={{ color: '#52c41a', fontSize: 12 }}>
                +{trendValue}% ce mois
              </Text>
            </>
          )}
          {trend === 'down' && (
            <>
              <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
              <Text style={{ color: '#ff4d4f', fontSize: 12 }}>
                -{trendValue}% ce mois
              </Text>
            </>
          )}
          {trend === 'neutral' && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Stable
            </Text>
          )}
        </Space>
      )}
    </Card>
  );
}

export default StatsCard;