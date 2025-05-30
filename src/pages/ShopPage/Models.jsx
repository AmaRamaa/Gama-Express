import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supaBase/supaBase';

const Models = () => {
    const { manufacturer } = useParams();
    const navigate = useNavigate();
    const [manufacturers, setManufacturers] = React.useState([]);
    const [models, setModels] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedModel, setSelectedModel] = React.useState(null);

    // Fetch manufacturers (brands)
    React.useEffect(() => {
        const fetchManufacturers = async () => {
            const { data, error } = await supabase
                .from('Manufacturers')
                .select('*');
            if (error) {
                console.error('Error fetching manufacturers:', error);
            }
            setManufacturers(data || []);
        };
        fetchManufacturers();
    }, []);

    // Fetch models for selected manufacturer
    React.useEffect(() => {
        const fetchModels = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('Models')
                .select('*')
                .eq('manufacturer', manufacturer);
            if (error) {
                setModels([]);
            } else {
                setModels(data || []);
            }
            setLoading(false);
        };
        if (manufacturer) fetchModels();
        else {
            setModels([]);
            setLoading(false);
        }
        setSelectedModel(null); // Reset selected model when manufacturer changes
        setProducts([]); // Reset products
    }, [manufacturer]);

    // Fetch products when a model is selected
    // Fetch products when a model is selected
    React.useEffect(() => {
        if (!selectedModel) return;
        const fetchProducts = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('Parts')
                .select('*')
                // .eq('Car', manufacturer) // first by brand
                // .eq('Model', selectedModel); // then by model

            if (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [selectedModel, manufacturer]);

    const handleBrandClick = (b) => {
        navigate(`/catalog/${encodeURIComponent(b.manufacturer || b.name)}`, { replace: false });
    };

    // If no manufacturer, show all products
    if (!manufacturer) {
        return (
            <div className="container-fluid mt-5" style={{ maxWidth: '100vw', padding: 0, background: '#fff', borderRadius: '0 0 8px 8px' }}>
                <div style={{ minHeight: '80vh' }}>
                    <h3 style={{ color: '#0a2266', margin: '24px 0 16px 0', textAlign: 'center' }}>
                        All Products
                    </h3>
                    {loading && <div>Loading...</div>}
                    {!loading && (
                        products.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#888', marginTop: '40px', fontSize: '18px' }}>
                                No parts found for this model.
                            </div>
                        ) : (
                            <div
                                className="products-grid container"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: '24px',
                                    justifyItems: 'center',
                                    background: '#fff',
                                    border: '1px solid #eaeaea',
                                    borderRadius: '0 0 8px 8px',
                                    padding: '24px 0',
                                }}
                            >
                                {products.map((product, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            width: '100%',
                                            padding: '16px 0',
                                            background: '#fff',
                                            border: '1px solid #0a2266',
                                            borderRadius: '8px',
                                            color: '#0a2266',
                                            fontWeight: 600,
                                            fontSize: '15px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: '140px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <span>{product.Description || product.text || product.Model}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    }

    // Show brands sidebar and models grid, and products grid only after model is clicked
    return (
        <div className="container-fluid mt-5" style={{ maxWidth: '100vw', padding: 0, background: '#fff', borderRadius: '0 0 8px 8px' }}>
            <div style={{ display: 'flex', minHeight: '80vh' }}>
                {/* Brands Sidebar */}
                <div style={{ borderRight: '1px solid #eaeaea', padding: '24px 0', background: '#f9f9f9', overflow: 'scroll', height: '720px' }}>
                    <h5 style={{ color: '#0a2266', textAlign: 'center' }}>Brands</h5>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {manufacturers.map((b, idx) => (
                            <li
                                key={idx}
                                style={{
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    background: (b.manufacturer || b.name) === manufacturer ? '#e0eaff' : 'transparent',
                                    color: (b.manufacturer || b.name) === manufacturer ? '#0a2266' : '#333',
                                    fontWeight: (b.manufacturer || b.name) === manufacturer ? 700 : 400,
                                }}
                                onClick={() => handleBrandClick(b)}
                            >
                                {b.image_path && (
                                    <img
                                        src={b.image_path}
                                        alt={b.manufacturer || b.name}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            objectFit: 'contain',
                                            marginRight: '10px',
                                            verticalAlign: 'middle',
                                        }}
                                    />
                                )}
                                <span>{b.manufacturer || b.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Models Grid and Products */}
                <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#0a2266', margin: '24px 0 16px 0', textAlign: 'center' }}>
                        Models for {manufacturer}
                    </h3>
                    {loading && !selectedModel && <div>Loading...</div>}
                    {!loading && !selectedModel && (
                        <div
                            className="models-grid container"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, 1fr)',
                                gap: '24px',
                                justifyItems: 'center',
                                background: '#fff',
                                border: '1px solid #eaeaea',
                                borderRadius: '0 0 8px 8px',
                                padding: '24px 0',
                            }}
                        >
                            {models.map((modelObj, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: '100%',
                                        padding: '16px 0',
                                        background: '#fff',
                                        border: '1px solid #0a2266',
                                        borderRadius: '8px',
                                        color: '#0a2266',
                                        fontWeight: 600,
                                        fontSize: '15px',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '140px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setSelectedModel(modelObj.model)}
                                >
                                    <span>{modelObj.model}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Products grid, only show after model is clicked */}
                    {selectedModel && (
                        <>
                            <h3 style={{ color: '#0a2266', margin: '24px 0 16px 0', textAlign: 'center' }}>
                                Products for {manufacturer} {selectedModel}
                            </h3>
                            {loading && <div>Loading...</div>}
                            {!loading && (
                                <div
                                    className="products-grid container"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(5, 1fr)',
                                        gap: '24px',
                                        justifyItems: 'center',
                                        background: '#fff',
                                        border: '1px solid #eaeaea',
                                        borderRadius: '0 0 8px 8px',
                                        padding: '24px 0',
                                    }}
                                >
                                    {products.length === 0 ? (
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', fontSize: '18px' }}>
                                            No parts found for this model.
                                        </div>
                                    ) : (
                                        products.map((product, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    width: '100%',
                                                    padding: '16px 0',
                                                    background: '#fff',
                                                    border: '1px solid #0a2266',
                                                    borderRadius: '8px',
                                                    color: '#0a2266',
                                                    fontWeight: 600,
                                                    fontSize: '15px',
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minHeight: '140px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <span>{product.Description || product.text || product.Model}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Models;
