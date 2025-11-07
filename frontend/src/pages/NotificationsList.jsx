import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function NotificationsList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [message, setMessage] = useState(null);

  const isRecruiter = user?.role === 'RECRUTEUR';

  // États pour les formulaires d'envoi
  const [emailForms, setEmailForms] = useState({
    test: { email: '', nom: '' },
    candidatureRecue: { candidatEmail: '', candidatNom: '', offreTitre: '', candidatureId: '' },
    invitationEntretien: { 
      candidatEmail: '', 
      candidatNom: '', 
      offreTitre: '', 
      typeEntretien: 'Entretien RH',
      dateEntretien: '', 
      heureEntretien: '', 
      lieu: '', 
      lien: '',
      entretienId: '' 
    },
    rappelEntretien: { 
      candidatEmail: '', 
      candidatNom: '', 
      offreTitre: '', 
      dateEntretien: '', 
      heureEntretien: '', 
      lieu: '',
      entretienId: '' 
    },
    acceptation: { candidatEmail: '', candidatNom: '', offreTitre: '', candidatureId: '' }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const notifResponse = await api.get('/notifications/recent');
      setNotifications(notifResponse.data);

      if (isRecruiter) {
        const statsResponse = await api.get('/notifications/statistics');
        setStatistics(statsResponse.data);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (type, data) => {
    setSendingEmail(true);
    setMessage(null);

    try {
      let endpoint = '';
      switch(type) {
        case 'test':
          endpoint = '/notifications/test';
          break;
        case 'candidatureRecue':
          endpoint = '/notifications/candidature-recue';
          break;
        case 'invitationEntretien':
          endpoint = '/notifications/invitation-entretien';
          break;
        case 'rappelEntretien':
          endpoint = '/notifications/rappel-entretien';
          break;
        case 'acceptation':
          endpoint = '/notifications/acceptation';
          break;
        default:
          throw new Error('Type d\'email inconnu');
      }

      await api.post(endpoint, data);
      setMessage({ type: 'success', text: `✅ Email envoyé avec succès à ${data.candidatEmail || data.email}` });
      
      // Réinitialiser le formulaire
      setEmailForms(prev => ({
        ...prev,
        [type]: type === 'test' 
          ? { email: '', nom: '' }
          : type === 'candidatureRecue'
          ? { candidatEmail: '', candidatNom: '', offreTitre: '', candidatureId: '' }
          : type === 'invitationEntretien'
          ? { candidatEmail: '', candidatNom: '', offreTitre: '', typeEntretien: 'Entretien RH', dateEntretien: '', heureEntretien: '', lieu: '', lien: '', entretienId: '' }
          : type === 'rappelEntretien'
          ? { candidatEmail: '', candidatNom: '', offreTitre: '', dateEntretien: '', heureEntretien: '', lieu: '', entretienId: '' }
          : { candidatEmail: '', candidatNom: '', offreTitre: '', candidatureId: '' }
      }));

      // Recharger les notifications
      await loadData();
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${error.response?.data?.error || 'Erreur lors de l\'envoi'}` });
    } finally {
      setSendingEmail(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'CANDIDATURE_RECUE': <i className="fas fa-file-alt"></i>,
      'INVITATION_ENTRETIEN': <i className="fas fa-calendar-alt"></i>,
      'RAPPEL_ENTRETIEN': <i className="fas fa-bell"></i>,
      'ACCEPTATION': <i className="fas fa-trophy"></i>,
      'REFUS': <i className="fas fa-times-circle"></i>
    };
    return icons[type] || <i className="fas fa-envelope"></i>;
  };

  const getStatutBadge = (statut) => {
    const badges = {
      'ENVOYE': { label: 'Envoyé', color: '#52c41a', icon: 'check-circle' },
      'EN_ATTENTE': { label: 'En attente', color: '#faad14', icon: 'clock' },
      'ECHEC': { label: 'Échec', color: '#ff4d4f', icon: 'exclamation-circle' }
    };
    const badge = badges[statut] || badges['EN_ATTENTE'];
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: `${badge.color}20`,
        color: badge.color,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <i className={`fas fa-${badge.icon}`}></i>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#1890ff' }}></i>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-bell"></i>
          Notifications & Communications
        </h1>
        <p style={{ color: '#6b7280' }}>
          {isRecruiter ? 'Gérez toutes vos communications avec les candidats' : 'Vos notifications et messages'}
        </p>
      </div>

      {/* Message de feedback */}
      {message && (
        <div style={{
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          background: message.type === 'success' ? '#f6ffed' : '#fff2f0',
          border: `1px solid ${message.type === 'success' ? '#52c41a' : '#ff4d4f'}`,
          color: message.type === 'success' ? '#389e0d' : '#cf1322',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {message.text}
        </div>
      )}

      {/* Statistiques - RECRUITER ONLY */}
      {isRecruiter && statistics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(82, 196, 26, 0.2)'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-check-circle"></i> Emails envoyés
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {statistics.ENVOYE || 0}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(250, 173, 20, 0.2)'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-clock"></i> En attente
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {statistics.EN_ATTENTE || 0}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(255, 77, 79, 0.2)'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-exclamation-circle"></i> Échecs
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {statistics.ECHEC || 0}
            </div>
          </div>
        </div>
      )}

      {/* Onglets */}
      {isRecruiter && (
        <div style={{
          borderBottom: '2px solid #e5e7eb',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {['recent', 'test', 'candidatureRecue', 'invitationEntretien', 'rappelEntretien', 'acceptation'].map((tab) => {
            const labels = {
              recent: <><i className="fas fa-list"></i> Historique</>,
              candidatureRecue: <><i className="fas fa-file-alt"></i> Candidature Reçue</>,
              invitationEntretien: <><i className="fas fa-calendar-alt"></i> Invitation Entretien</>,
              rappelEntretien: <><i className="fas fa-bell"></i> Rappel Entretien</>,
              acceptation: <><i className="fas fa-trophy"></i> Acceptation</>
            };
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '1rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid #1890ff' : '3px solid transparent',
                  color: activeTab === tab ? '#1890ff' : '#6b7280',
                  fontWeight: activeTab === tab ? '600' : '400',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      )}

      {/* Contenu des onglets */}
      {activeTab === 'recent' && (
        <div>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
              <i className="fas fa-inbox fa-4x" style={{ marginBottom: '1rem', opacity: 0.5 }}></i>
              <p style={{ fontSize: '1.1rem' }}>Aucune notification pour le moment</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notifications.map((notif) => (
                <div key={notif.id} style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                      <div style={{ fontSize: '1.5rem', width: '40px', display: 'flex', justifyContent: 'center' }}>
                        {getTypeIcon(notif.type)}
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                          {notif.objet}
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fas fa-envelope"></i> {notif.destinataireEmail}
                        </div>
                      </div>
                    </div>
                    {getStatutBadge(notif.statut)}
                  </div>
                  
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: '#9ca3af',
                    display: 'flex',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-clock"></i> {new Date(notif.dateCreation).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {notif.dateEnvoi && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-paper-plane"></i> Envoyé
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* Formulaire Candidature Reçue */}
      {activeTab === 'candidatureRecue' && isRecruiter && (
        <EmailForm
          title={<><i className="fas fa-file-alt"></i> Confirmation de Candidature Reçue</>}
          description="Envoyer un email de confirmation au candidat"
          fields={[
            { name: 'candidatEmail', label: 'Email du candidat', type: 'email', icon: 'envelope', required: true },
            { name: 'candidatNom', label: 'Nom du candidat', type: 'text', icon: 'user', required: true },
            { name: 'offreTitre', label: 'Titre de l\'offre', type: 'text', icon: 'briefcase', required: true },
            { name: 'candidatureId', label: 'ID Candidature', type: 'text', icon: 'hashtag', required: false }
          ]}
          formData={emailForms.candidatureRecue}
          onFormDataChange={(field, value) => setEmailForms(prev => ({
            ...prev,
            candidatureRecue: { ...prev.candidatureRecue, [field]: value }
          }))}
          onSubmit={() => sendEmail('candidatureRecue', emailForms.candidatureRecue)}
          sending={sendingEmail}
        />
      )}

      {/* Formulaire Invitation Entretien */}
      {activeTab === 'invitationEntretien' && isRecruiter && (
        <EmailForm
          title={<><i className="fas fa-calendar-alt"></i> Invitation à un Entretien</>}
          description="Inviter un candidat à un entretien"
          fields={[
            { name: 'candidatEmail', label: 'Email du candidat', type: 'email', icon: 'envelope', required: true },
            { name: 'candidatNom', label: 'Nom du candidat', type: 'text', icon: 'user', required: true },
            { name: 'offreTitre', label: 'Titre de l\'offre', type: 'text', icon: 'briefcase', required: true },
            { name: 'typeEntretien', label: 'Type d\'entretien', type: 'select', icon: 'clipboard-list', required: true,
              options: ['Entretien RH', 'Entretien Technique', 'Entretien Manager', 'Entretien Final'] },
            { name: 'dateEntretien', label: 'Date', type: 'date', icon: 'calendar', required: true },
            { name: 'heureEntretien', label: 'Heure', type: 'time', icon: 'clock', required: true },
            { name: 'lieu', label: 'Lieu ou plateforme', type: 'text', icon: 'map-marker-alt', required: true },
            { name: 'lien', label: 'Lien (optionnel)', type: 'url', icon: 'link', required: false },
            { name: 'entretienId', label: 'ID Entretien', type: 'text', icon: 'hashtag', required: false }
          ]}
          formData={emailForms.invitationEntretien}
          onFormDataChange={(field, value) => setEmailForms(prev => ({
            ...prev,
            invitationEntretien: { ...prev.invitationEntretien, [field]: value }
          }))}
          onSubmit={() => sendEmail('invitationEntretien', emailForms.invitationEntretien)}
          sending={sendingEmail}
        />
      )}

      {/* Formulaire Rappel Entretien */}
      {activeTab === 'rappelEntretien' && isRecruiter && (
        <EmailForm
          title={<><i className="fas fa-bell"></i> Rappel d'Entretien</>}
          description="Envoyer un rappel au candidat la veille de l'entretien"
          fields={[
            { name: 'candidatEmail', label: 'Email du candidat', type: 'email', icon: 'envelope', required: true },
            { name: 'candidatNom', label: 'Nom du candidat', type: 'text', icon: 'user', required: true },
            { name: 'offreTitre', label: 'Titre de l\'offre', type: 'text', icon: 'briefcase', required: true },
            { name: 'dateEntretien', label: 'Date', type: 'date', icon: 'calendar', required: true },
            { name: 'heureEntretien', label: 'Heure', type: 'time', icon: 'clock', required: true },
            { name: 'lieu', label: 'Lieu', type: 'text', icon: 'map-marker-alt', required: true },
            { name: 'entretienId', label: 'ID Entretien', type: 'text', icon: 'hashtag', required: false }
          ]}
          formData={emailForms.rappelEntretien}
          onFormDataChange={(field, value) => setEmailForms(prev => ({
            ...prev,
            rappelEntretien: { ...prev.rappelEntretien, [field]: value }
          }))}
          onSubmit={() => sendEmail('rappelEntretien', emailForms.rappelEntretien)}
          sending={sendingEmail}
        />
      )}

      {/* Formulaire Acceptation */}
      {activeTab === 'acceptation' && isRecruiter && (
        <EmailForm
          title={<><i className="fas fa-trophy"></i> Notification d'Acceptation</>}
          description="Féliciter le candidat pour son acceptation"
          fields={[
            { name: 'candidatEmail', label: 'Email du candidat', type: 'email', icon: 'envelope', required: true },
            { name: 'candidatNom', label: 'Nom du candidat', type: 'text', icon: 'user', required: true },
            { name: 'offreTitre', label: 'Titre du poste', type: 'text', icon: 'briefcase', required: true },
            { name: 'candidatureId', label: 'ID Candidature', type: 'text', icon: 'hashtag', required: false }
          ]}
          formData={emailForms.acceptation}
          onFormDataChange={(field, value) => setEmailForms(prev => ({
            ...prev,
            acceptation: { ...prev.acceptation, [field]: value }
          }))}
          onSubmit={() => sendEmail('acceptation', emailForms.acceptation)}
          sending={sendingEmail}
        />
      )}
    </div>
  );
}

// Composant réutilisable pour les formulaires
function EmailForm({ title, description, fields, formData, onFormDataChange, onSubmit, sending }) {
  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      maxWidth: '800px'
    }}>
      <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.9rem' }}>
        {description}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {fields.map((field) => (
          <div key={field.name}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className={`fas fa-${field.icon}`}></i> {field.label}
              {field.required && <span style={{ color: '#ff4d4f' }}>*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                value={formData[field.name]}
                onChange={(e) => onFormDataChange(field.name, e.target.value)}
                required={field.required}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                {field.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formData[field.name]}
                onChange={(e) => onFormDataChange(field.name, e.target.value)}
                required={field.required}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onSubmit}
        disabled={sending}
        style={{
          padding: '0.75rem 2rem',
          background: sending ? '#9ca3af' : '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: sending ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {sending ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Envoi en cours...
          </>
        ) : (
          <>
            <i className="fas fa-paper-plane"></i>
            Envoyer l'email
          </>
        )}
      </button>
    </div>
  );
}