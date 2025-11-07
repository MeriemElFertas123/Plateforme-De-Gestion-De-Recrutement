import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Space,
  message,
  Typography,
  Tag,
  Modal,
  Descriptions,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  EyeOutlined
} from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import {
  getAllEntretiens,
  getStatutColor,
  getTypeLabel,
  formatDate,
  formatHeure,
  formatDuree
} from '../services/entretienService';

const { Title, Text } = Typography;

function EntretiensCalendar() {
  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntretien, setSelectedEntretien] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadEntretiens();
  }, []);

  const loadEntretiens = async () => {
    setLoading(true);
    try {
      const data = await getAllEntretiens();
      setEntretiens(data);
    } catch (error) {
      message.error('Erreur lors du chargement des entretiens');
      console.error(error);
    }
    setLoading(false);
  };

  // Convertir les entretiens en événements FullCalendar
  const events = entretiens.map(entretien => ({
    id: entretien.id,
    title: `${entretien.candidatPrenom} ${entretien.candidatNom} - ${getTypeLabel(entretien.type)}`,
    start: entretien.dateDebut,
    end: entretien.dateFin,
    backgroundColor: getEventColor(entretien.statut),
    borderColor: getEventColor(entretien.statut),
    extendedProps: {
      entretien: entretien
    }
  }));

  // Obtenir la couleur selon le statut
  function getEventColor(statut) {
    const colors = {
      PLANIFIE: '#1890ff',
      CONFIRME: '#52c41a',
      EN_COURS: '#faad14',
      TERMINE: '#722ed1',
      EVALUE: '#13c2c2',
      ANNULE: '#ff4d4f',
      REPORTE: '#fa8c16'
    };
    return colors[statut] || '#1890ff';
  }

  // Clic sur un événement
  const handleEventClick = (clickInfo) => {
    const entretien = clickInfo.event.extendedProps.entretien;
    setSelectedEntretien(entretien);
    setModalVisible(true);
  };

  // Clic sur une date (créer un nouvel entretien)
  const handleDateClick = (dateClickInfo) => {
    // Naviguer vers le formulaire avec la date pré-remplie
    navigate('/entretiens/create', { 
      state: { dateDebut: dateClickInfo.dateStr } 
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" tip="Chargement du calendrier..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button 
              icon={<UnorderedListOutlined />}
              onClick={() => navigate('/entretiens')}
            >
              Vue Liste
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              📅 Calendrier des Entretiens
            </Title>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/entretiens/create')}
            >
              Planifier
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadEntretiens}
            >
              Actualiser
            </Button>
          </Space>
        </div>
      </Card>

      {/* Calendrier */}
      <Card>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={frLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          buttonText={{
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour'
          }}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          nowIndicator={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
        />

        {/* Légende */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
          <Text strong>Légende : </Text>
          <Space wrap style={{ marginTop: 8 }}>
            <Tag color="#1890ff">Planifié</Tag>
            <Tag color="#52c41a">Confirmé</Tag>
            <Tag color="#faad14">En cours</Tag>
            <Tag color="#722ed1">Terminé</Tag>
            <Tag color="#13c2c2">Évalué</Tag>
            <Tag color="#ff4d4f">Annulé</Tag>
            <Tag color="#fa8c16">Reporté</Tag>
          </Space>
        </div>
      </Card>

      {/* Modal Détails */}
      <Modal
        title={
          selectedEntretien ? (
            <Space>
              <span>{selectedEntretien.titre}</span>
              <Tag color={getStatutColor(selectedEntretien.statut)}>
                {selectedEntretien.statut}
              </Tag>
            </Space>
          ) : ''
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            Fermer
          </Button>,
          <Button 
            key="view" 
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setModalVisible(false);
              navigate(`/entretiens/${selectedEntretien.id}`);
            }}
          >
            Voir le détail
          </Button>
        ]}
        width={600}
      >
        {selectedEntretien && (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Candidat">
              <Text strong>
                {selectedEntretien.candidatPrenom} {selectedEntretien.candidatNom}
              </Text>
            </Descriptions.Item>
            
            <Descriptions.Item label="Offre">
              {selectedEntretien.offreTitre}
            </Descriptions.Item>

            <Descriptions.Item label="Type">
              <Tag color="purple">{getTypeLabel(selectedEntretien.type)}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Date et Heure">
              {formatDate(selectedEntretien.dateDebut)}
            </Descriptions.Item>

            <Descriptions.Item label="Durée">
              {formatDuree(selectedEntretien.dureeMinutes)}
            </Descriptions.Item>

            <Descriptions.Item label="Lieu">
              {selectedEntretien.typeLieu} - {selectedEntretien.lieu}
            </Descriptions.Item>

            {selectedEntretien.interviewersNoms && selectedEntretien.interviewersNoms.length > 0 && (
              <Descriptions.Item label="Interviewers">
                {selectedEntretien.interviewersNoms.join(', ')}
              </Descriptions.Item>
            )}

            {selectedEntretien.description && (
              <Descriptions.Item label="Description">
                {selectedEntretien.description}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default EntretiensCalendar;