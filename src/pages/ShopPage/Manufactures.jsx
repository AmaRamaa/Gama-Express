import { useState } from 'react';
import BrandCard from '../../components/BrandCard';

const ManufacturersPage = ({ manufacturers = [], onBrandClick, headerRed = "#c00" }) => {
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Sort manufacturers alphabetically
  const sortedManufacturers = [...manufacturers].sort((a, b) => {
    const nameA = (a.manufacturer || a.name || '').toLowerCase();
    const nameB = (b.manufacturer || b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const handleBrandClick = (brandObj) => {
    setSelectedBrand(brandObj.name || brandObj.manufacturer);
    onBrandClick(brandObj);
  };

  return (
    <div
      className="container-fluid mt-5"
      style={{
        maxWidth: '100vw',
        padding: 0,
        background: '#fff',
        borderRadius: '0 0 12px 12px',
        minHeight: '80vh'
      }}
    >
      <h3
        style={{
          color: headerRed,
          margin: '32px 0 24px 0',
          textAlign: 'center',
          fontWeight: 700,
          letterSpacing: 1
        }}
      >
        Manufacturers
      </h3>
      <div
        className="brand-grids"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '28px',
          padding: '0 32px 32px 32px'
        }}
      >
        {sortedManufacturers.map((brandObj, idx) => (
          <BrandCard
            key={idx}
            brand={brandObj}
            selected={(brandObj.name || brandObj.manufacturer) === selectedBrand}
            onClick={() => handleBrandClick(brandObj)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManufacturersPage;