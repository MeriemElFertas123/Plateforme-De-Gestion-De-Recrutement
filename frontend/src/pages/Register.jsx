import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Space, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserAddOutlined, BankOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

function Register() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    
    const result = await register(values);
    
    if (result.success) {
      message.success('Inscription réussie ! Bienvenue 🎉');
      navigate('/dashboard');
    } else {
      message.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: 500, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: '10px'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <UserAddOutlined style={{ fontSize: 48, color: '#667eea', marginBottom: 16 }} />
            <Title level={2} style={{ margin: 0 }}>Inscription</Title>
            <Text type="secondary">Créez votre compte</Text>
          </div>

          {/* Formulaire */}
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Space direction="horizontal" size="middle" style={{ width: '100%' }}>
              <Form.Item
                name="prenom"
                rules={[{ required: true, message: 'Prénom requis' }]}
                style={{ flex: 1, marginBottom: 16 }}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Prénom" 
                />
              </Form.Item>

              <Form.Item
                name="nom"
                rules={[{ required: true, message: 'Nom requis' }]}
                style={{ flex: 1, marginBottom: 16 }}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Nom" 
                />
              </Form.Item>
            </Space>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Email requis' },
                { type: 'email', message: 'Email invalide' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Mot de passe requis' },
                { min: 6, message: 'Au moins 6 caractères' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Mot de passe" 
              />
            </Form.Item>

            <Form.Item
              name="telephone"
              rules={[{ required: false }]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="Téléphone (optionnel)" 
              />
            </Form.Item>

            <Form.Item
              name="departement"
              rules={[{ required: false }]}
            >
              <Input 
                prefix={<BankOutlined />} 
                placeholder="Département (optionnel)" 
              />
            </Form.Item>

            <Form.Item
              name="role"
              initialValue="RECRUTEUR"
            >
              <Select placeholder="Sélectionnez un rôle">
                <Option value="RECRUTEUR">Recruteur</Option>
                <Option value="CANDIDAT">Candidat</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                style={{ height: 45 }}
              >
                S'inscrire
              </Button>
            </Form.Item>
          </Form>

          {/* Lien vers Login */}
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Déjà un compte ?{' '}
              <Link to="/login" style={{ fontWeight: 'bold' }}>
                Se connecter
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}

export default Register;