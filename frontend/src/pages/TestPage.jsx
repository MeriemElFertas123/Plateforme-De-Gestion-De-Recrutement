import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, Button, Space, Typography, Alert, Spin } from 'antd';

const { Title, Text } = Typography;

function TestPage() {
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testHello = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/test/hello');
      setMessage(response.data.message);
    } catch (err) {
      setError('Erreur: ' + err.message);
    }
    setLoading(false);
  };

  const testHealth = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/test/health');
      setHealth(response.data);
    } catch (err) {
      setError('Erreur: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    testHello();
    testHealth();
  }, []);

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <Title>🚀 Test Communication Backend ↔ Frontend</Title>
      
      {loading && <Spin size="large" />}
      
      {error && <Alert type="error" message={error} style={{ marginBottom: 20 }} />}
      
      <Card title="Test Hello" style={{ marginBottom: 20 }}>
        <Text strong>Message du backend : </Text>
        <Text>{message || 'Chargement...'}</Text>
      </Card>

      <Card title="Test Health">
        {health && (
          <Space direction="vertical">
            <Text><strong>Status:</strong> {health.status}</Text>
            <Text><strong>Service:</strong> {health.service}</Text>
            <Text><strong>Database:</strong> {health.database}</Text>
            <Text><strong>Users Count:</strong> {health.usersCount}</Text>
          </Space>
        )}
      </Card>

      <Space style={{ marginTop: 20 }}>
        <Button type="primary" onClick={testHello}>
          Tester Hello
        </Button>
        <Button onClick={testHealth}>
          Tester Health
        </Button>
      </Space>
    </div>
  );
}

export default TestPage;