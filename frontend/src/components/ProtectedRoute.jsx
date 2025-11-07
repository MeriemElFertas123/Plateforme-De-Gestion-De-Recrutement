import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6"
      }}>
        <i className="fas fa-spinner fa-spin fa-3x" style={{ color: "#3b82f6" }}></i>
        <p style={{ marginTop: "1rem", color: "#6b7280" }}>Vérification...</p>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier si l'utilisateur a le bon rôle
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Rediriger vers le dashboard approprié selon le rôle
    if (user.role === "INTERVIEWER") {
      return <Navigate to="/interviewer/dashboard" replace />;
    } else if (user.role === "RECRUTEUR") {
      return <Navigate to="/dashboard" replace />;
    }
    // Par défaut, rediriger vers login
    return <Navigate to="/login" replace />;
  }

  // Redirection automatique vers le bon dashboard
  if (location.pathname === "/" || location.pathname === "/dashboard") {
    if (user.role === "CANDIDAT") {
      return <Navigate to="/candidat/dashboard" replace />;
    } else if (user.role === "RECRUTEUR") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Si tout est OK, afficher le contenu
  return children;
}

export default ProtectedRoute;