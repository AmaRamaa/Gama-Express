import React from 'react';
import { supabase } from '../../supaBase/supaBase';

const ShopPage = () => {
    const [carImages, setCarImages] = React.useState([]);
    const [modelsByManufacturer, setModelsByManufacturer] = React.useState({});
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [sidebarModels, setSidebarModels] = React.useState([]);
    const [sidebarManufacturer, setSidebarManufacturer] = React.useState('');
    const [allParts, setAllParts] = React.useState([]);
    const [filteredParts, setFilteredParts] = React.useState([]);
    const [loadingParts, setLoadingParts] = React.useState(false);

    React.useEffect(() => {
        const fetchManufacturers = async () => {
            const { data, error } = await supabase
                .from('Manufacturers')
                .select('*');
            if (error) {
                console.error('Error fetching manufacturers:', error);
            }
            if (data) {
                setCarImages(
                    data.map(row => ({
                        src: row.image_path || row.image || '',
                        alt: row.manufacturer || row.name || '',
                    }))
                );
            }
        };

        const fetchModels = async () => {
            const { data, error } = await supabase
                .from('Models')
                .select('*');
            if (error) {
                console.error('Error fetching models:', error);
            }
            if (data) {
                const grouped = {};
                data.forEach(row => {
                    const manufacturer = row.manufacturer || row.make || '';
                    const model = row.model || row.name || '';
                    if (!grouped[manufacturer]) grouped[manufacturer] = [];
                    grouped[manufacturer].push(model);
                });
                setModelsByManufacturer(grouped);
            }
        };

        const fetchAllParts = async () => {
            setLoadingParts(true);
            const { data, error } = await supabase
                .from('Parts')
                .select('*');
            if (error) {
                console.error('Error fetching parts:', error);
            }
            setAllParts(data || []);
            setFilteredParts(data || []);
            setLoadingParts(false);
        };

        fetchManufacturers();
        fetchModels();
        fetchAllParts();
    }, []);

    // --- Sidebar logic ---
    const handleCarImageClick = (manufacturer) => {
        setSidebarManufacturer(manufacturer);
        setSidebarModels(modelsByManufacturer[manufacturer] || []);
        setSidebarOpen(true);
    };

    const handleSidebarModelClick = async (model) => {
        setLoadingParts(true);
        // Fetch parts for this model (adjust table/column names as needed)
        const { data, error } = await supabase
            .from('Parts')
            .select('*')
            .eq('Model', model);
        if (error) {
            console.error('Error fetching parts:', error);
        }
        setFilteredParts(data || []);
        setLoadingParts(false);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setFilteredParts(allParts);
    };

    return (
        <div
            className="container-fluid mt-5"
            style={{
                maxWidth: '100vw',
                padding: 0,
                background: '#fff',
                borderRadius: '0 0 8px 8px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    width: '100%',
                }}
            >
                <section>
                    <div
                        className="cars-container container"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            justifyItems: 'center',
                            width: '50%',
                            maxWidth: '100%',
                            background: '#fff',
                            border: '1px solid #eaeaea',
                            borderRadius: '0 0 8px 8px',
                            paddingBottom: '24px',
                        }}
                    >
                        {carImages.map((car, idx) => (
                            <div
                                className="car-box"
                                key={idx}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: '#fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleCarImageClick(car.alt)}
                            >
                                <img
                                    src={car.src}
                                    alt={car.alt}
                                    className="car-img"
                                    style={{
                                        width: '37px',
                                        height: '37px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    style={{
                        overflowY: 'auto',
                        width: '100%',
                        maxHeight: 'calc(100vh - 100px)', // adjust 100px as needed for header/margin
                    }}
                >
                    <div style={{ flex: '1 1 0', maxWidth: '45%', padding: '24px' }}>
                        <h4 style={{ color: '#0a2266' }}>Parts</h4>
                        {loadingParts && <div>Loading...</div>}
                        {!loadingParts && filteredParts.length === 0 && <div>No parts found.</div>}
                        {!loadingParts && filteredParts.length > 0 && (
                            <div className="row">
                                {filteredParts.map((part, idx) => (
                                    <PartCard key={idx} part={part} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
                {/* Sidebar */}
                {sidebarOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '350px',
                            height: '100vh',
                            background: '#fff',
                            boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
                            zIndex: 1000,
                            padding: '24px',
                            overflowY: 'auto',
                            transition: 'right 0.3s',
                        }}
                    >
                        <button
                            onClick={closeSidebar}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                background: 'none',
                                border: 'none',
                                fontSize: 24,
                                cursor: 'pointer',
                            }}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h4 style={{ color: '#0a2266' }}>{sidebarManufacturer} Models</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {sidebarModels.map((model, idx) => (
                                <li key={idx} style={{ margin: '8px 0' }}>
                                    <button
                                        style={{
                                            background: '#f5f5f5',
                                            border: '1px solid #eaeaea',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            width: '100%',
                                            textAlign: 'left',
                                            color: '#0a2266',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleSidebarModelClick(model)}
                                    >
                                        {model}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// Custom PartCard component to handle image fetching with hooks
function PartCard({ part }) {
    // Elastic search: highlight matching part name/description if a search term is present
    const imgSrc = part.image || '';
    // Example: If you want to highlight search terms, you would need a searchTerm prop or context.
    // For now, just basic image logic as before.


    return (
        <div className="col-md-6 mb-3">
            {/* Example Unsplash image fetch button */}
            <button
                className="btn btn-primary mb-2"
                onClick={async (event) => {
                    event.preventDefault();
                    // Replace with your actual Unsplash API access key
                    const AUTH = "YOUR_UNSPLASH_ACCESS_KEY";
                    const API_URL = `https://api.unsplash.com/photos?query=${encodeURIComponent(part.name || 'car part')}&client_id=${AUTH}`;
                    try {
                        const response = await fetch(API_URL);
                        const data = await response.json();
                        if (Array.isArray(data) && data.length > 0 && data[0].urls && data[0].urls.small) {
                            // Optionally, you could set this image in local state for this card
                            window.open(data[0].links.html, '_blank');
                        } else {
                            alert('No Unsplash image found.');
                        }
                    } catch (err) {
                        alert('Error fetching Unsplash image.');
                    }
                }}
            >
                View Unsplash Image
            </button>
            <div className="card h-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: '8px' }}>
                <div className="card-body">
                    <h5 className="card-title" style={{ color: '#0a2266', marginBottom: '12px' }}>
                        {part.name || part.Model || 'Unnamed Part'}
                    </h5>
                    <p className="card-text" style={{ color: '#444', fontSize: '15px' }}>
                        {part.description || 'No description available.'}
                    </p>
                    {imgSrc && (
                        <img
                            src={imgSrc}
                            alt={part.name || 'Part image'}
                            style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }}
                        />
                    )}
                    <div style={{ fontWeight: 500, color: '#0a2266' }}>
                        {part.price ? `Price: $${part.price}` : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopPage;
