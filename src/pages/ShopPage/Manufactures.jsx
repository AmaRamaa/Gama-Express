const ManufacturersPage = ({ manufacturers = [], onBrandClick, headerRed = "#c00" }) => {
  // Sort manufacturers alphabetically
  const sortedManufacturers = [...manufacturers].sort((a, b) => {
    const nameA = (a.manufacturer || a.name || '').toLowerCase();
    const nameB = (b.manufacturer || b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });

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
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '28px',
          padding: '0 32px 32px 32px'
        }}
      >
        {sortedManufacturers.map((brand, idx) => (
          <div
            key={idx}
            onClick={() => onBrandClick(brand)}
            style={{
              cursor: 'pointer',
              border: `1.5px solid ${headerRed}`,
              borderRadius: 12,
              background: '#fafbfc',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.2s, transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '28px 8px 18px 8px',
              minHeight: 180
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <img
              src={brand.image_path || "https://via.placeholder.com/80?text=No+Image"}
              alt={brand.manufacturer || brand.name}
              style={{
                width: 72,
                height: 72,
                objectFit: 'contain',
                marginBottom: 14,
                filter: brand.image_path ? 'none' : 'grayscale(1) opacity(0.5)'
              }}
              loading="lazy"
            />
            <div
              style={{
                fontWeight: 600,
                fontSize: 16,
                color: '#222',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              {brand.manufacturer || brand.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManufacturersPage;