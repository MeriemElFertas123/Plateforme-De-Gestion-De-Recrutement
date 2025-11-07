import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CandidatOffres.css";

export default function CandidatOffres() {
  const [offres, setOffres] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    typeContrat: "",
    localisation: "",
    departement: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffres();
  }, []);

  useEffect(() => {
    filterOffres();
  }, [searchTerm, filters, offres]);

  const fetchOffres = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Utiliser l'endpoint des offres actives qui filtre déjà les offres PUBLIÉES et non expirées
      const response = await fetch("http://localhost:8080/api/offres/actives", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setOffres(data);
      setFilteredOffres(data);
    } catch (error) {
      console.error("Erreur:", error);
      // En cas d'erreur, essayer avec l'endpoint général et filtrer côté frontend
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/offres", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allOffres = await response.json();
        
        // Filtrer les offres PUBLIÉES et non expirées
        const offresActives = allOffres.filter(offre => 
          offre.statut === "PUBLIEE" && 
          (!offre.dateExpiration || new Date(offre.dateExpiration) > new Date())
        );
        
        setOffres(offresActives);
        setFilteredOffres(offresActives);
      } catch (fallbackError) {
        console.error("Erreur de secours:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterOffres = () => {
    let filtered = offres;

    // Recherche par titre, description ou compétences
    if (searchTerm) {
      filtered = filtered.filter(
        (offre) =>
          offre.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offre.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offre.competencesRequises?.some(comp => 
            comp.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          offre.departement?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par type de contrat
    if (filters.typeContrat) {
      filtered = filtered.filter(
        (offre) => offre.typeContrat === filters.typeContrat
      );
    }

    // Filtre par localisation
    if (filters.localisation) {
      filtered = filtered.filter((offre) =>
        offre.localisation
          ?.toLowerCase()
          .includes(filters.localisation.toLowerCase())
      );
    }

    // Filtre par département
    if (filters.departement) {
      filtered = filtered.filter((offre) =>
        offre.departement
          ?.toLowerCase()
          .includes(filters.departement.toLowerCase())
      );
    }

    setFilteredOffres(filtered);
  };

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({ typeContrat: "", localisation: "", departement: "" });
  };

  // Fonction pour formater le salaire
  const formatSalaire = (offre) => {
    if (offre.salaireMin && offre.salaireMax) {
      return `${offre.salaireMin.toLocaleString()} - ${offre.salaireMax.toLocaleString()} ${offre.deviseMonnaie || 'DH'}`;
    } else if (offre.salaireMin) {
      return `À partir de ${offre.salaireMin.toLocaleString()} ${offre.deviseMonnaie || 'DH'}`;
    } else if (offre.salaireMax) {
      return `Jusqu'à ${offre.salaireMax.toLocaleString()} ${offre.deviseMonnaie || 'DH'}`;
    }
    return "Salaire non spécifié";
  };

  // Fonction pour calculer les jours restants
  const getJoursRestants = (dateExpiration) => {
    if (!dateExpiration) return null;
    const today = new Date();
    const expiration = new Date(dateExpiration);
    const diffTime = expiration - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin fa-3x"></i>
        <p>Chargement des offres...</p>
      </div>
    );
  }

  return (
    <div className="candidat-offres">
      {/* Header */}
      <div className="offres-header">
        <div>
          <h1>
            <i className="fas fa-briefcase"></i>
            Offres d'emploi disponibles
          </h1>
          <p>{filteredOffres.length} offre(s) trouvée(s)</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher par titre, description, compétences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select
            value={filters.typeContrat}
            onChange={(e) => handleFilterChange("typeContrat", e.target.value)}
          >
            <option value="">Tous les contrats</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="STAGE">Stage</option>
            <option value="ALTERNANCE">Alternance</option>
            <option value="FREELANCE">Freelance</option>
            <option value="INTERIM">Intérim</option>
          </select>

          <input
            type="text"
            placeholder="Localisation..."
            value={filters.localisation}
            onChange={(e) => handleFilterChange("localisation", e.target.value)}
          />

          <input
            type="text"
            placeholder="Département..."
            value={filters.departement}
            onChange={(e) => handleFilterChange("departement", e.target.value)}
          />

          {(searchTerm || filters.typeContrat || filters.localisation || filters.departement) && (
            <button className="btn-reset" onClick={resetFilters}>
              <i className="fas fa-times"></i>
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Liste des offres */}
      {filteredOffres.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-search fa-3x"></i>
          <p>Aucune offre ne correspond à vos critères</p>
          <button className="btn-reset" onClick={resetFilters}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="offres-grid">
          {filteredOffres.map((offre) => {
            const joursRestants = getJoursRestants(offre.dateExpiration);
            
            return (
              <div
                key={offre.id}
                className="offre-card"
                onClick={() => navigate(`/candidat/offres/${offre.id}`)}
              >
                <div className="offre-header-card">
                  <h2>{offre.titre}</h2>
                  <div className="offre-badges">
                    <span className="offre-type">{offre.typeContrat}</span>
                    {offre.teletravailPossible && (
                      <span className="badge-teletravail">
                        <i className="fas fa-laptop-house"></i>
                        Télétravail
                      </span>
                    )}
                    {joursRestants !== null && joursRestants > 0 && (
                      <span className="badge-expiration">
                        {joursRestants} jour(s) restant(s)
                      </span>
                    )}
                  </div>
                </div>

                <div className="offre-meta">
                  <span>
                    <i className="fas fa-map-marker-alt"></i>
                    {offre.localisation || "Non spécifié"}
                  </span>
                  <span>
                    <i className="fas fa-money-bill-wave"></i>
                    {formatSalaire(offre)}
                  </span>
                  <span>
                    <i className="fas fa-building"></i>
                    {offre.departement || "Non spécifié"}
                  </span>
                </div>

                <p className="offre-description">
                  {offre.description?.substring(0, 150)}
                  {offre.description?.length > 150 && "..."}
                </p>

                {offre.competencesRequises && offre.competencesRequises.length > 0 && (
                  <div className="offre-competences">
                    <strong>Compétences requises:</strong>
                    <div className="competences-list">
                      {offre.competencesRequises.slice(0, 4).map((comp, index) => (
                        <span key={index} className="competence-tag">
                          {comp}
                        </span>
                      ))}
                      {offre.competencesRequises.length > 4 && (
                        <span className="competence-more">
                          +{offre.competencesRequises.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="offre-footer">
                  <div className="offre-stats">
                    <span>
                      <i className="fas fa-eye"></i>
                      {offre.nombreVues || 0} vues
                    </span>
                    <span>
                      <i className="fas fa-users"></i>
                      {offre.nombreCandidatures || 0} candidatures
                    </span>
                  </div>
                  
                  <button
                    className="btn-voir-details"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/candidat/offres/${offre.id}`);
                    }}
                  >
                    <i className="fas fa-eye"></i>
                    Voir les détails
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}