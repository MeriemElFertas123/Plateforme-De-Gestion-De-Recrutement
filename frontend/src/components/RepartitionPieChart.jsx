import { Card, Spin } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CHART_COLORS, getStatutLabel } from '../services/AnalyticsService';

function RepartitionPieChart({ data, loading, title, nameKey = 'statut', valueKey = 'nombre' }) {
  if (loading) {
    return (
      <Card title={title}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin />
        </div>
      </Card>
    );
  }

  // Formater les données pour le graphique
  const chartData = data.map(item => ({
    name: getStatutLabel(item[nameKey]),
    value: item[valueKey]
  }));

  // Label personnalisé
  const renderLabel = (entry) => {
    const percent = ((entry.value / data.reduce((sum, item) => sum + item[valueKey], 0)) * 100).toFixed(1);
    return `${entry.name}: ${percent}%`;
  };

  return (
    <Card title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default RepartitionPieChart;