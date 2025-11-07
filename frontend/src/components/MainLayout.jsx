import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MainLayout.css";
// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';
export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // 🎯 Menus spécifiques par rôle
  const getMenuItems = () => {
    // Menu CANDIDAT
    if (user?.role === "CANDIDAT") {
      return [
        {
          path: "/candidat/dashboard",
          icon: "fa-home",
          label: "Tableau de bord",
          title: "Tableau de bord"
        },
        {
          path: "/candidat/offres",
          icon: "fa-briefcase",
          label: "Offres d'emploi",
          title: "Offres disponibles"
        },
        {
          path: "/candidat/mes-candidatures",
          icon: "fa-file-alt",
          label: "Mes candidatures",
          title: "Mes candidatures"
        },
        {
          path: "/candidat/mes-entretiens",
          icon: "fa-calendar-check",
          label: "Mes entretiens",
          title: "Mes entretiens"
        },
        {
          path: "/candidat/profil",
          icon: "fa-user-circle",
          label: "Mon profil",
          title: "Mon profil"
        },
      ];
    }

    // Menu par défaut pour RECRUITER
    return [
      {
        path: "/dashboard",
        icon: "fa-home",
        label: "Dashboard",
        title: "Tableau de bord"
      },
      {
        path: "/analytics",
        icon: "fa-chart-line",
        label: "Analytics",
        title: "Statistiques"
      },
      {
        path: "/offres",
        icon: "fa-briefcase",
        label: "Offres",
        title: "Gestion des Offres"
      },
      {
        path: "/candidatures",
        icon: "fa-users",
        label: "Candidatures",
        title: "Gestion des Candidatures"
      },
      {
        path: "/candidatures/kanban",
        icon: "fa-columns",
        label: "Kanban",
        title: "Vue Kanban"
      },
      {
        path: "/entretiens",
        icon: "fa-calendar-alt",
        label: "Entretiens",
        title: "Gestion des Entretiens"
      },
      {
        path: "/entretiens/calendar",
        icon: "fa-calendar-week",
        label: "Calendrier",
        title: "Calendrier des Entretiens"
      },
      {
        path: "/notifications",
        icon: "fa-bell",
        label: "Notifications",
        title: "Notifications",
        badge: 3
      }
    ];
  };

  const menuItems = getMenuItems();

  // Obtenir le titre de la page actuelle
  const getCurrentTitle = () => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    if (currentItem) return currentItem.title;
    
    if (location.pathname === "/notifications") return "Notifications";
    
    return "Application";
  };

  // Badge de rôle
  const getRoleBadge = () => {
    if (user?.role === "CANDIDAT") {
      return {
        label: "Candidat",
        icon: "fa-user",
        color: "#10b981"
      };
    }
    if (user?.role === "INTERVIEWER") {
      return {
        label: "Interviewer",
        icon: "fa-user-tie",
        color: "#8b5cf6"
      };
    }
    return {
      label: "Recruteur",
      icon: "fa-user-shield",
      color: "#3b82f6"
    };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        {/* Header */}
        <div className="sidebar-header">
          {sidebarOpen && <h1>RecrutApp</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="toggle-btn"
          >
            <i className={`fas fa-${sidebarOpen ? "chevron-left" : "bars"}`}></i>
          </button>
        </div>

        {/* Badge de Rôle */}
        {sidebarOpen && (
          <div
            className="role-badge"
            style={{ background: `linear-gradient(135deg, ${roleBadge.color} 0%, ${roleBadge.color}dd 100%)` }}
          >
            <i className={`fas ${roleBadge.icon}`}></i>
            <span>{roleBadge.label}</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""} ${
                sidebarOpen ? "open" : "closed"
              }`}
              title={sidebarOpen ? "" : item.label}
            >
              <i className={`fas ${item.icon}`}></i>
              {sidebarOpen && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="badge">{item.badge}</span>}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className={`sidebar-footer ${sidebarOpen ? "open" : "closed"}`}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="user-button"
            title={sidebarOpen ? "" : "Profil utilisateur"}
          >
            <div className="user-avatar">
              {user?.prenom?.charAt(0)?.toUpperCase() || user?.nom?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {sidebarOpen && (
              <>
                <div className="user-info">
                  <div className="user-name">{user?.prenom || user?.nom || "Utilisateur"}</div>
                  <div className="user-email">{user?.email}</div>
                </div>
                <i className={`fas fa-chevron-${dropdownOpen ? "up" : "down"}`}></i>
              </>
            )}
          </button>

          {dropdownOpen && sidebarOpen && (
            <div className="dropdown-menu">
              <Link to="/profil" className="dropdown-item">
                <i className="fas fa-user-cog"></i> Mon profil
              </Link>
              <button onClick={handleLogout} className="dropdown-item logout">
                <i className="fas fa-sign-out-alt"></i> Déconnexion
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="menu-toggle"
            >
              <i className="fas fa-bars"></i>
            </button>
            <h2 className="page-title">{getCurrentTitle()}</h2>
          </div>
          <div className="topbar-right">
            <span className="current-date">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
            <div className="user-indicator">
              <span className="user-greeting">Bonjour, {user?.prenom || user?.nom || "Utilisateur"}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="content">{children}</div>
      </main>
    </div>
  );
}