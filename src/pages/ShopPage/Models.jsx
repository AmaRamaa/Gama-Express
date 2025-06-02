import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supaBase/supaBase';
import './index.css'

// Example color variable
const headerBlack = 'black';
const headerRed = '#e53935'; // Material Red 600, or pick your preferred red
const headerRedLight = '#ffeaea'; // or pick a light red that fits your theme

const models = [
    {
        name: "Audi A1",
        image: "https://example.com/images/audi-a1.jpg"
    },
    {
        name: "Audi A3",
        image: "https://example.com/images/audi-a3.jpg"
    },
    // add more models and images here
];


const Models = () => {
    const { manufacturer } = useParams();
    const navigate = useNavigate();
    const [manufacturers, setManufacturers] = React.useState([]);
    const [models, setModels] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedModel, setSelectedModel] = React.useState(null);
    const [openDropdown, setOpenDropdown] = React.useState(null);
    const [hoveredModel, setHoveredModel] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

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
    React.useEffect(() => {
        if (!selectedModel) return;
        const fetchProducts = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('Parts')
                .select('*')

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
                    <h3 style={{ color: headerRed, margin: '24px 0 16px 0', textAlign: 'center' }}>
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
                                    border: `1px solid ${headerRed}`,
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
                                            border: `1px solid ${headerRed}`,
                                            borderRadius: '8px',
                                            color: headerRed,
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
                <div style={{ borderRight: '1px solid #eaeaea', padding: '24px 0', background: '#f9f9f9', overflow: 'scroll', height: '720px' }}>
                    <h5 style={{ color: headerRed, textAlign: 'center' }}>Brands</h5>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {Object.entries(
                            manufacturers.reduce((acc, curr) => {
                                // Group by manufacturer name
                                const key = curr.manufacturer || curr.name;
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(curr);
                                return acc;
                            }, {})
                        ).map(([brandName, brandModels], idx) => (
                            <li key={idx} style={{ padding: 0, marginBottom: '8px' }}>
                                <div
                                    style={{
                                        padding: '10px 20px',
                                        cursor: 'pointer',
                                        background: brandName === manufacturer ? headerRedLight : 'transparent',
                                        color: brandName === manufacturer ? headerRed : '#333',
                                        fontWeight: brandName === manufacturer ? 700 : 400,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    onClick={() => handleBrandClick(brandModels[0])}
                                >
                                    {brandModels[0].image_path && (
                                        <img
                                            src={brandModels[0].image_path}
                                            alt={brandName}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                objectFit: 'contain',
                                                marginRight: '10px',
                                                verticalAlign: 'middle',
                                            }}
                                        />
                                    )}
                                    <span>{brandName}</span>
                                    {brandModels.length > 1 && (
                                        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}>▼</span>
                                    )}
                                </div>
                                {brandModels.length > 1 && (
                                    <ul style={{ listStyle: 'none', paddingLeft: '40px', margin: 0 }}>
                                        {brandModels.map((bm, i) => (
                                            <li
                                                key={i}
                                                style={{
                                                    padding: '6px 0',
                                                    cursor: 'pointer',
                                                    color: bm.manufacturer === manufacturer ? headerRed : '#333',
                                                }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    // Instead of handleBrandClick(bm), set the selected model for dropdown
                                                    setSelectedModel(bm.model);
                                                }}
                                            >
                                                <span>
                                                    {bm.variant ? `${bm.variant} ` : ''}
                                                    {bm.model ? `${bm.model} ` : ''}
                                                    {/* Highlight () and - in red */}
                                                    {bm.start_year ? (
                                                        <span>
                                                            <span style={{ color: headerRed }}>(</span>
                                                            {bm.start_year}
                                                            {bm.end_year ? (
                                                                <>
                                                                    <span style={{ color: headerRed }}>-</span>
                                                                    {bm.end_year}
                                                                </>
                                                            ) : null}
                                                            <span style={{ color: headerRed }}>)</span>
                                                        </span>
                                                    ) : ''}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ color: headerRed, margin: '24px 0 16px 0', textAlign: 'center' }}>
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
                                borderRadius: '0 0 8px 8px',
                                padding: '24px 0',
                            }}
                        >
                            {Object.entries(
                                models.reduce((acc, modelObj) => {
                                    const key = modelObj.model;
                                    if (!acc[key]) acc[key] = [];
                                    acc[key].push(modelObj);
                                    return acc;
                                }, {})
                            ).map(([modelName, modelVariants], idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: '100%',
                                        padding: '16px 0',
                                        background: '#fff',
                                        border: `1px solid ${headerRed}`,
                                        borderRadius: '8px',
                                        color: headerRed,
                                        fontWeight: 600,
                                        fontSize: '15px',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '140px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        zIndex: openDropdown === idx ? 20 : 1, // bring to front if open
                                    }}
                                    onClick={() => {
                                        if (modelVariants.length === 1) {
                                            setSelectedModel(modelVariants[0].model);
                                        } else {
                                            setOpenDropdown(openDropdown === idx ? null : idx);
                                        }
                                    }}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <span style={{ width: '100%' }}>
                                        {modelVariants[0].manufacturer}{" "}
                                        {modelName}
                                        {modelVariants.length > 1 && (
                                            <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>▼</span>
                                        )}
                                    </span>

                                    {modelVariants.length > 1 && openDropdown === idx && (
                                        <div style={{ position: 'relative' }}>
                                            <ul
                                                style={{
                                                    listStyle: 'none',
                                                    padding: 0,
                                                    margin: 0,
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    right: 0,
                                                    background: '#fff',
                                                    border: `1px solid ${headerRed}`,
                                                    borderRadius: '0 0 8px 8px',
                                                    zIndex: 30,
                                                    width: '250px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                }}
                                            >
                                                {modelVariants.map((variantObj, vIdx) => (
                                                    <li
                                                        key={vIdx}
                                                        style={{
                                                            padding: '8px 12px',
                                                            cursor: 'pointer',
                                                            color: headerRed,
                                                            borderBottom: vIdx !== modelVariants.length - 1 ? '1px solid #eee' : 'none',
                                                            background: '#fff',
                                                            position: 'relative',
                                                        }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setSelectedModel(variantObj.model);
                                                            setOpenDropdown(null);
                                                        }}
                                                        onMouseEnter={e => {
                                                            setHoveredModel(variantObj);
                                                            setMousePos({ x: e.clientX, y: e.clientY });
                                                        }}
                                                        onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
                                                        onMouseLeave={() => setHoveredModel(null)}
                                                    >
                                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                                            {variantObj.variant ? `${variantObj.variant} ` : ''}
                                                            {variantObj.code && (
                                                                <span style={{ color: 'black', fontSize: 16, marginLeft: 6 }}>
                                                                    [{variantObj.code}]
                                                                </span>
                                                            )}
                                                            {variantObj.start_year && (
                                                                <span style={{ color: 'black', fontSize: 16, marginLeft: 6 }}>
                                                                    <span style={{ color: headerRed }}>(</span>
                                                                    {variantObj.start_year}
                                                                    <span style={{ color: headerRed }}>
                                                                        {variantObj.end_year ? '-' : ''}
                                                                    </span>
                                                                    {variantObj.end_year ? variantObj.end_year : ''}
                                                                    <span style={{ color: headerRed }}>)</span>
                                                                </span>
                                                            )}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {hoveredModel && (
                                                <img
                                                    src={"https://via.placeholder.com/150"}
                                                    alt="model preview"
                                                    style={{
                                                        position: 'fixed',
                                                        top: mousePos.y + 15,
                                                        left: mousePos.x + 15,
                                                        width: '150px',
                                                        height: 'auto',
                                                        pointerEvents: 'none',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                        zIndex: 9999,
                                                        transition: 'top 0.1s, left 0.1s',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}


                        </div>
                    )}
                    {selectedModel && (
                        <>
                            <h3 style={{ color: headerRed, margin: '24px 0 16px 0', textAlign: 'center' }}>
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
                                        border: `1px solid ${headerRed}`,
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
                                                    border: `1px solid ${headerRed}`,
                                                    borderRadius: '8px',
                                                    color: headerRed,
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
