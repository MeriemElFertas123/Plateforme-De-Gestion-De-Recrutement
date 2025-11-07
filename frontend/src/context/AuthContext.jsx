import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // ✅ CORRIGÉ : Fonction utilitaire pour normaliser les rôles
  const normalizeRole = (role) => {
    if (!role) return 'RECRUTEUR'; // Valeur par défaut
    
    const upperRole = role.toUpperCase();
    
    const roleMap = {
      'RECRUITLUR': 'RECRUTEUR', // Correction de la typo
      'RECRUTEUR': 'RECRUTEUR',
      'CANDIDAT': 'CANDIDAT',
      'RECRUITER': 'RECRUTEUR', 
      'CANDIDAT': 'CANDIDAT',
      'ADMIN': 'ADMIN'
    };
    
    return roleMap[upperRole] || 'RECRUTEUR'; // Fallback à RECRUTEUR
  };

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          // ✅ Normaliser le rôle au chargement
          userData.role = normalizeRole(userData.role);
          
          setToken(savedToken);
          setUser(userData);
          
          console.log('🔄 Utilisateur chargé depuis localStorage:', userData);
        } catch (error) {
          console.error('❌ Erreur parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Fonction de connexion - CORRIGÉE ✅
  const login = async (email, password) => {
    try {
      console.log('🔐 Tentative de connexion pour:', email);
      
      const response = await api.post('/auth/login', { email, password });
      const { token, userId, nom, prenom, role } = response.data;

      // ✅ CORRIGÉ : Normaliser le rôle (RECRUITLUR → RECRUTEUR)
      const normalizedRole = normalizeRole(role);

      // Créer l'objet utilisateur complet
      const userData = { 
        userId, 
        email, 
        nom, 
        prenom, 
        role: normalizedRole
      };

      // 🔍 DEBUG détaillé
      console.log('✅ Login backend réussi');
      console.log('📥 Rôle reçu du backend:', role);
      console.log('🔄 Rôle normalisé:', normalizedRole);
      console.log('👤 Données utilisateur:', userData);

      // Sauvegarder dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Mettre à jour le state
      setToken(token);
      setUser(userData);

      console.log('🏠 Redirection vers /dashboard...');

      return userData;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      const message = error.response?.data?.error || 'Erreur de connexion';
      throw new Error(message);
    }
  };

  // Fonction d'inscription - CORRIGÉE ✅
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, userId, email, nom, prenom, role } = response.data;

      // ✅ Normaliser le rôle
      const normalizedRole = normalizeRole(role);

      // Créer l'objet utilisateur complet
      const user = { 
        userId, 
        email, 
        nom, 
        prenom, 
        role: normalizedRole 
      };

      console.log('✅ Inscription réussie, rôle normalisé:', normalizedRole);

      // Sauvegarder dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Mettre à jour le state
      setToken(token);
      setUser(user);

      return user;
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur lors de l\'inscription';
      throw new Error(message);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    console.log('🚪 Déconnexion...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Obtenir le rôle de l'utilisateur
  const getUserRole = () => {
    return user?.role || null;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    getUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export default AuthContext;