import { Card, Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../services/AnalyticsService';

function BarChartComponent({ 
  data, 
  loading, 
  title, 
  xKey, 
  yKey, 
  yLabel = 'Valeur',
  color = CHART_COLORS[0] 
}) {
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
    <Card title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill={color} name={yLabel} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default BarChartComponent;