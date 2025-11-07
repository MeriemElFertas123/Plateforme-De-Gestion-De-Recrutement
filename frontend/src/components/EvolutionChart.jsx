import { Card, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function EvolutionChart({ data, loading, title }) {
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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#1890ff" 
            strokeWidth={2}
            name="Total"
          />
          <Line 
            type="monotone" 
            dataKey="acceptees" 
            stroke="#52c41a" 
            strokeWidth={2}
            name="Acceptées"
          />
          <Line 
            type="monotone" 
            dataKey="refusees" 
            stroke="#ff4d4f" 
            strokeWidth={2}
            name="Refusées"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default EvolutionChart;