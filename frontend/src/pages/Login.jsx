import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // La fonction login retourne maintenant l'objet utilisateur avec le rôle
      const userData = await login(formData.email, formData.password);
      
      // 🔍 DEBUG : Afficher les données reçues
      console.log("✅ Login réussi, données reçues:", userData);
      console.log("🎯 Rôle de l'utilisateur:", userData.role);
      
      // ✅ Redirection intelligente selon le rôle
      if (userData.role === "CANDIDAT") {
        console.log("➡️ Redirection vers /candidat/dashboard");
        navigate("/candidat/dashboard");
      } else if (userData.role === "RECRUTEUR") {
        console.log("➡️ Redirection vers /dashboard");
        navigate("/dashboard");
      } else {
        console.log("⚠️ Rôle inconnu:", userData.role, "- redirection par défaut vers /dashboard");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Erreur de connexion:", err);
      setError(err.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div >
            <i className="fas fa-user-circle fa-4x"></i>
          </div>
          <h1>Connexion</h1>
          <p>Accédez à votre espace de recrutement</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre.email@exemple.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Connexion en cours...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Pas encore de compte ?{" "}
            <Link to="/register">Créer un compte</Link>
          </p>
        </div>

       
      </div>
    </div>
  );
}