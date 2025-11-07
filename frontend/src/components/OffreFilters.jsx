import { Card, Input, Select, Space, Button, Row, Col, Slider, Switch } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { Option } = Select;

function OffreFilters({ 
  searchTerm, 
  setSearchTerm,
  filterStatut,
  setFilterStatut,
  filterTypeContrat,
  setFilterTypeContrat,
  filterLocalisation,
  setFilterLocalisation,
  filterDepartement,
  setFilterDepartement,
  filterSalaireMin,
  setFilterSalaireMin,
  filterTeletravail,
  setFilterTeletravail,
  onReset
}) {

  return (
    <Card title={<><FilterOutlined /> Filtres de Recherche</>}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Recherche textuelle */}
        <Input
          placeholder="Rechercher par titre, description, compétences..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
          allowClear
        />

        {/* Filtres en colonnes */}
        <Row gutter={16}>
          {/* Statut */}
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8 }}>Statut</div>
            <Select
              style={{ width: '100%' }}
              value={filterStatut}
              onChange={setFilterStatut}
            >
              <Option value="ALL">Tous</Option>
              <Option value="BROUILLON">🟡 Brouillon</Option>
              <Option value="PUBLIEE">🟢 Publiée</Option>
              <Option value="EXPIREE">🟠 Expirée</Option>
              <Option value="POURVUE">🔵 Pourvue</Option>
              <Option value="ARCHIVEE">⚫ Archivée</Option>
            </Select>
          </Col>

          {/* Type de contrat */}
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8 }}>Type de contrat</div>
            <Select
              style={{ width: '100%' }}
              value={filterTypeContrat}
              onChange={setFilterTypeContrat}
            >
              <Option value="ALL">Tous</Option>
              <Option value="CDI">CDI</Option>
              <Option value="CDD">CDD</Option>
              <Option value="STAGE">Stage</Option>
              <Option value="ALTERNANCE">Alternance</Option>
              <Option value="FREELANCE">Freelance</Option>
            </Select>
          </Col>

          {/* Localisation */}
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8 }}>Localisation</div>
            <Select
              style={{ width: '100%' }}
              value={filterLocalisation}
              onChange={setFilterLocalisation}
              showSearch
              allowClear
            >
              <Option value="ALL">Toutes</Option>
              <Option value="Paris">Paris</Option>
              <Option value="Lyon">Lyon</Option>
              <Option value="Marseille">Marseille</Option>
              <Option value="Toulouse">Toulouse</Option>
              <Option value="Bordeaux">Bordeaux</Option>
              <Option value="Remote">Remote</Option>
            </Select>
          </Col>

          {/* Département */}
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8 }}>Département</div>
            <Select
              style={{ width: '100%' }}
              value={filterDepartement}
              onChange={setFilterDepartement}
              allowClear
            >
              <Option value="ALL">Tous</Option>
              <Option value="Informatique">Informatique</Option>
              <Option value="RH">Ressources Humaines</Option>
              <Option value="Marketing">Marketing</Option>
              <Option value="Commercial">Commercial</Option>
              <Option value="Finance">Finance</Option>
            </Select>
          </Col>
        </Row>

        {/* Filtres avancés */}
        <Row gutter={16}>
          {/* Salaire minimum */}
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: 8 }}>Salaire minimum : {filterSalaireMin}€</div>
            <Slider
              min={0}
              max={100000}
              step={5000}
              value={filterSalaireMin}
              onChange={setFilterSalaireMin}
              marks={{
                0: '0€',
                25000: '25K',
                50000: '50K',
                75000: '75K',
                100000: '100K+'
              }}
            />
          </Col>

          {/* Télétravail */}
          <Col xs={24} sm={12}>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Switch
                checked={filterTeletravail}
                onChange={setFilterTeletravail}
              />
              <span style={{ marginLeft: 12 }}>Télétravail possible uniquement</span>
            </div>
          </Col>
        </Row>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            icon={<ClearOutlined />} 
            onClick={onReset}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </Space>
    </Card>
  );
}

export default OffreFilters;