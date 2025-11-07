// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Pages communes
import Login from './pages/Login';
import Register from './pages/Register';
import NotificationsList from './pages/NotificationsList';

// Pages RECRUITER
import Dashboard from './pages/Dashboard';
import DashboardAnalytics from './pages/DashboardAnalytics';
import OffresList from './pages/OffresList';
import OffreCreate from './pages/OffreCreate';
import OffreEdit from './pages/OffreEdit';
import OffreDetail from './pages/OffreDetail';
import CandidaturesList from './pages/CandidaturesList';
import CandidatureForm from './pages/CandidatureForm';
import CandidatureDetail from './pages/CandidatureDetail';
import EntretiensList from './pages/EntretiensList';
import EntretienForm from './pages/EntretienForm';
import EntretiensCalendar from './pages/EntretiensCalendar';

// Pages CANDIDAT
import CandidatDashboard from './pages/CandidatDashboard';
import CandidatOffres from './pages/CandidatOffres';
import MesCandidatures from './pages/MesCandidatures';
import MesEntretiens from './pages/MesEntretiens';

import './App.css';
import InterviewerDashboard from './pages/InterviewerDashboard';

function App() {
  return (
    <Routes>
      {/* ==================== */}
      {/* ROUTES PUBLIQUES     */}
      {/* ==================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route 
        path="/" 
        element={<Navigate to="/login" replace />} 
      />

      {/* ======================= */}
      {/* ROUTES RECRUITER ONLY   */}
      {/* ======================= */}
      <Route
        path="/dashboard"
        element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <DashboardAnalytics />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/offres"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <OffresList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/offres/create"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <OffreCreate />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/offres/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <OffreEdit />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/offres/:id"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <OffreDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidatures"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <CandidaturesList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidatures/:id"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <CandidatureDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/entretiens"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <EntretiensList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/entretiens/create"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <EntretienForm />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/entretiens/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <EntretienForm />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/entretiens/calendar"
        element={
          <ProtectedRoute allowedRoles={["RECRUTEUR"]}>
            <MainLayout>
              <EntretiensCalendar />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ===================== */}
      {/* ROUTES CANDIDAT ONLY  */}
      {/* ===================== */}
      <Route
        path="/candidat/dashboard"
        element={
          
            <MainLayout>
              <CandidatDashboard />
            </MainLayout>
        
        }
      />
      <Route
        path="/candidat/offres"
        element={
          <ProtectedRoute allowedRoles={["CANDIDAT"]}>
            <MainLayout>
              <CandidatOffres />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidat/offres/:id"
        element={
          <ProtectedRoute allowedRoles={["CANDIDAT"]}>
            <MainLayout>
              <OffreDetail candidatView={true} />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
          path="/offres/:offreId/postuler"
           element={
            <ProtectedRoute allowedRoles={["CANDIDAT"]}>
            <MainLayout>
                 <CandidatureForm />
            </MainLayout>
            </ProtectedRoute>
          } 
      />
      <Route
        path="/candidat/mes-candidatures"
        element={
          <ProtectedRoute allowedRoles={["CANDIDAT"]}>
            <MainLayout>
              <MesCandidatures />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidat/mes-candidatures/:id"
        element={
          <ProtectedRoute allowedRoles={["CANDIDAT"]}>
            <MainLayout>
              <CandidatureDetail candidatView={true} />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidat/mes-entretiens"
        element={
          <ProtectedRoute allowedRoles={["CANDIDAT"]}>
            <MainLayout>
              <MesEntretiens />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidat/profil"
        element={
          <ProtectedRoute allowedRoles={["CANDIDAT"]}>
            <MainLayout>
              <div style={{ padding: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "400px",
                    textAlign: "center"
                  }}
                >
                  <i className="fas fa-user-circle fa-5x" style={{ color: "#3b82f6", marginBottom: "1rem" }}></i>
                  <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👤 Mon Profil</h1>
                  <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>Fonctionnalité en cours de développement</p>
                  <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Gérez vos informations personnelles et votre CV</p>
                </div>
              </div>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      
                 
      {/* =================== */}
      {/* ROUTES COMMUNES     */}
      {/* =================== */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NotificationsList />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* =================== */}
      {/* ROUTE 404           */}
      {/* =================== */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "400px",
                  textAlign: "center",
                  padding: "2rem"
                }}
              >
                <i className="fas fa-exclamation-triangle fa-5x" style={{ color: "#f59e0b", marginBottom: "1.5rem" }}></i>
                <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", color: "#1f2937" }}>404</h1>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#4b5563" }}>Page non trouvée</h2>
                <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
                  La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <i className="fas fa-home"></i>
                  Retour à l'accueil
                </button>
              </div>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
