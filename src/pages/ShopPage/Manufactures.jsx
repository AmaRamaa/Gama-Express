const ManufacturersPage = ({ manufacturers = [], onBrandClick, headerRed }) => {
  // Sort manufacturers alphabetically by manufacturer or name
  const sortedManufacturers = [...manufacturers].sort((a, b) => {
    const nameA = (a.manufacturer || a.name || '').toLowerCase();
    const nameB = (b.manufacturer || b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="container-fluid mt-5" style={{ maxWidth: '100vw', padding: 0, background: '#fff', borderRadius: '0 0 8px 8px' }}>
      <div style={{ minHeight: '80vh' }}>
        <h3 style={{ color: headerRed, margin: '24px 0 16px 0', textAlign: 'center' }}>
          Manufacturers
        </h3>
        <div className="row">
          {sortedManufacturers.map((brand, idx) => (
            <div className="col-6 col-md-3 col-lg-2 mb-4" key={idx}>
              <div
                className="card h-100"
                style={{ cursor: 'pointer', border: `1px solid ${headerRed}` }}
                onClick={() => onBrandClick(brand)}
              >
                <div className="card-body text-center">
                  {brand.image_path && (
                    <img
                      src={brand.image_path}
                      alt={brand.manufacturer || brand.name}
                      style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 8 }}
                    />
                  )}
                  <div style={{ fontWeight: 600 }}>{brand.manufacturer || brand.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManufacturersPage;