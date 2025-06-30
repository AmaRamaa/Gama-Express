import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supaBase/supaBase';
import './index.css'
import GamaLogo from '/assets/GamaExpressSmallLogo.png'; // Adjust path if needed
import Loader from '../../components/Loader';
import ModelInfoCard from '../../components/ModelInfoCard';
import ProductCard from '../../components/ProductCard';
import BrandCard from '../../components/BrandCard';
import { useTranslation } from 'react-i18next';
import '../../i18n';

// Example color variable
const headerBlack = 'black';
const headerRed = '#e53935'; // Material Red 600, or pick your preferred red
const headerRedLight = '#ffeaea'; // or pick a light red that fits your theme

const Models = () => {
    const { t } = useTranslation();
    const { manufacturer, model } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [manufacturers, setManufacturers] = React.useState([]);
    const [models, setModels] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedModel, setSelectedModel] = useState(model || null);
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

            // Find the selected model object for year/variant info
            let selectedModelObj = models.find(m => m.model === selectedModel);

            // If not found, try to parse selectedModel for more details (model-start_year-end_year-variant)
            if (!selectedModelObj && selectedModel) {
                const parts = selectedModel.split('-');
                selectedModelObj = models.find(m =>
                    m.model === parts[0] &&
                    (parts[1] ? String(m.start_year) === parts[1] : true) &&
                    (parts[2] ? String(m.end_year) === parts[2] : true) &&
                    (parts[3] ? String(m.variant) === parts[3] : true)
                );
            }

            let query = supabase
                .from('Parts')
                .select('*')
                .ilike('Car', `%${manufacturer}%`);

            // If start_year and end_year exist, filter for overlapping years
            if (selectedModelObj?.start_year && selectedModelObj?.end_year) {
                query = query
                    .lte('start_year', selectedModelObj.end_year)
                    .gte('end_year', selectedModelObj.start_year);
            }
            // If variant is selected, filter by it
            if (selectedModelObj?.variant) {
                query = query.ilike('Variant', `%${selectedModelObj.variant}%`);
            }

            console.log('Selected Model Object:', selectedModelObj);
            console.log('Selected Model:', selectedModel);
            if (selectedModelObj?.Variant) {
                query = query.ilike('Variant', `%${selectedModelObj.Variant}%`);
            }

            // If year range is available, filter for overlapping years
            if (selectedModelObj?.start_year && selectedModelObj?.end_year) {
                query = query
                    .lte('start_year', selectedModelObj.end_year)
                    .gte('end_year', selectedModelObj.start_year);
            }

            const { data, error } = await query;

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

    // Get search query from URL
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search")?.toLowerCase() || "";

    // Fetch all products if search query exists and no manufacturer is selected
    React.useEffect(() => {
        if (!manufacturer && searchQuery) {
            setLoading(true);
            const fetchAllProducts = async () => {
                // Fetch all products from Supabase
                const { data, error } = await supabase
                    .from('Parts')
                    .select('*');
                if (error) {
                    setProducts([]);
                } else {
                    setProducts(data || []);
                }
                setLoading(false);
            };
            fetchAllProducts();
        }
    }, [manufacturer, searchQuery]);

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        (product.Car?.toLowerCase().includes(searchQuery) ||
        product.AM?.toLowerCase().includes(searchQuery) ||
        product.OEM?.toLowerCase().includes(searchQuery))
    );

    // If there is a search query and no manufacturer, show filtered products
    if (!manufacturer && searchQuery) {
        return (
            <div className="container-fluid mt-5" style={{ maxWidth: '100vw', padding: 0, background: '#fff', borderRadius: '0 0 8px 8px' }}>
                <div style={{ minHeight: '80vh' }}>
                    <h3 style={{ color: headerRed, margin: '24px 0 16px 0', textAlign: 'center' }}>
                        {t('models.searchResults', 'Search Results')}
                    </h3>
                    {loading && <Loader />}
                    {!loading && (
                        filteredProducts.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#888', marginTop: '40px', fontSize: '18px' }}>
                                {t('models.noPartsForSearch', 'No parts found for this search.')}
                            </div>
                        ) : (
                            <div
                                className="products-grid container"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '24px',
                                    justifyItems: 'center',
                                    background: '#fff',
                                    border: `1px solid ${headerRed}`,
                                    borderRadius: '0 0 8px 8px',
                                    padding: '24px 0',
                                }}
                            >
                                {filteredProducts.map((product, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            background: "#fff",
                                            borderRadius: 8,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                            width: 200,
                                            minWidth: 200,
                                            textAlign: "center",
                                            textDecoration: "none",
                                            color: "#222",
                                            padding: 16,
                                            transition: "box-shadow 0.2s",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => {
                                            if (product.AM) {
                                                localStorage.setItem('selectedProductAM', product.AM);
                                            }
                                            navigate(
                                                `/catalog/${encodeURIComponent(product.Car || manufacturer)}/${encodeURIComponent(product.Model)}/${encodeURIComponent(product.AM)}`,
                                                { replace: false }
                                            );
                                        }}
                                    >
                                        <div style={{ position: 'relative', width: 120, height: 80, margin: '0 auto 12px auto' }}>
                                            <img
                                                src={product.img || '/assets/CARPLACEHOLDER.png'}
                                                alt={product.Description || product.Model}
                                                style={{
                                                    width: 120,
                                                    height: 80,
                                                    objectFit: 'contain',
                                                    borderRadius: 8,
                                                    border: '1px solid #eee',
                                                    background: '#fafafa'
                                                }}
                                                draggable={false}
                                            />
                                            <img
                                                src={GamaLogo}
                                                alt="Gama Express Branding"
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    width: 60,
                                                    height: 60,
                                                    opacity: 0.25,
                                                    transform: 'translate(-50%, -50%)',
                                                    pointerEvents: 'none',
                                                    userSelect: 'none',
                                                }}
                                                draggable={false}
                                            />
                                        </div>
                                        <div style={{ fontWeight: "bold", marginBottom: 4 }}>{product.Car}</div>
                                        <div style={{ fontSize: 12, color: "#888" }}>Item: {product.AM}</div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    }

    // Fetch all parts for a manufacturer if only manufacturer is present (no model)
    React.useEffect(() => {
        if (manufacturer && !model) {
            setLoading(true);
            const fetchManufacturerParts = async () => {
                const { data, error } = await supabase
                    .from('Parts')
                    .select('*')
                    .ilike('Car', `%${manufacturer}%`);
                if (error) {
                    setProducts([]);
                } else {
                    setProducts(data || []);
                }
                setLoading(false);
            };
            fetchManufacturerParts();
            setSelectedModel(null);
        }
    }, [manufacturer, model]);

    // If manufacturer is present and no model, show all parts for that manufacturer
    // if (manufacturer && !model) {
    //     return (
    //         <div className="container-fluid mt-5" style={{ maxWidth: '100vw', padding: 0, background: '#fff', borderRadius: '0 0 8px 8px' }}>
    //             <div style={{ minHeight: '80vh' }}>
    //                 <h3 style={{ color: headerRed, margin: '24px 0 16px 0', textAlign: 'center' }}>
    //                     All Parts for {manufacturer}
    //                 </h3>
    //                 {loading && <Loader />}
    //                 {!loading && (
    //                     products.length === 0 ? (
    //                         <div style={{ textAlign: 'center', color: '#888', marginTop: '40px', fontSize: '18px' }}>
    //                             No parts found for this manufacturer.
    //                         </div>
    //                     ) : (
    //                         <div
    //                             className="products-grid container"
    //                             style={{
    //                                 display: 'grid',
    //                                 gridTemplateColumns: 'repeat(5, 1fr)',
    //                                 gap: '24px',
    //                                 justifyItems: 'center',
    //                                 background: '#fff',
    //                                 border: `1px solid ${headerRed}`,
    //                                 borderRadius: '0 0 8px 8px',
    //                                 padding: '24px 0',
    //                             }}
    //                         >
    //                             {products.map((product, idx) => (
    //                                 <div
    //                                     key={idx}
    //                                     style={{
    //                                         background: "#fff",
    //                                         borderRadius: 8,
    //                                         boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    //                                         width: 200,
    //                                         minWidth: 200,
    //                                         textAlign: "center",
    //                                         textDecoration: "none",
    //                                         color: "#222",
    //                                         padding: 16,
    //                                         transition: "box-shadow 0.2s",
    //                                         cursor: "pointer"
    //                                     }}
    //                                     onClick={() => {
    //                                         if (product.AM) {
    //                                             localStorage.setItem('selectedProductAM', product.AM);
    //                                         }
    //                                         navigate(
    //                                             `/catalog/${encodeURIComponent(manufacturer)}/${encodeURIComponent(product.Model)}/${encodeURIComponent(product.AM)}`,
    //                                             { replace: false }
    //                                         );
    //                                     }}
    //                                 >
    //                                     <img src={product.img} alt={product.Model} style={{ width: 120, height: 80, objectFit: "contain", marginBottom: 12 }} />
    //                                     <div style={{ fontWeight: "bold", marginBottom: 4 }}>{product.Car}</div>
    //                                     <div style={{ fontSize: 12, color: "#888" }}>Item: {product.AM}</div>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     )
    //                 )}
    //             </div>
    //         </div>
    //     );
    // }

    // Show brands sidebar and models grid, and products grid only after model is clicked
    return (
        <div className="container-fluid mt-5" style={{ maxWidth: '100vw', padding: 0, background: '#fff', borderRadius: '0 0 8px 8px' }}>
            <div style={{ display: 'flex', minHeight: '80vh' }}>
                {/* Sidebar */}
                <div style={{ borderRight: '1px solid #eaeaea', padding: '24px 0', background: '#f9f9f9', overflow: 'scroll', height: '720px' }}>
                    <h5 style={{ color: headerRed, textAlign: 'center' }}>{t('models.brands', 'Brands')}</h5>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {Object.entries(
                            manufacturers.reduce((acc, curr) => {
                                // Group by manufacturer name
                                const key = curr.manufacturer || curr.name;
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(curr);
                                return acc;
                            }, {})
                        )
                            // Sort manufacturers alphabetically by brandName
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([brandName, brandModels], idx) => (
                                <li key={idx} style={{ padding: 0, marginBottom: '8px' }}>
                                    <BrandCard
                                        brand={brandModels[0]}
                                        selected={brandName === manufacturer}
                                        onClick={() => handleBrandClick(brandModels[0])}
                                    />
                                </li>
                            ))}
                    </ul>
                </div>
                {/* Main Content */}
                <div style={{ flex: 1 }}>
                    <h3 style={{ color: headerRed, margin: '24px 0 16px 0', textAlign: 'center' }}>
                        {t('models.modelsFor', { manufacturer })}
                    </h3>
                    {loading && !selectedModel && <Loader />}
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
                                        zIndex: openDropdown === idx ? 20 : 1,
                                    }}
                                    onClick={() => {
                                        if (modelVariants.length === 1) {
                                            setSelectedModel(modelVariants[0].model);
                                            navigate(`/catalog/${encodeURIComponent(manufacturer)}/${encodeURIComponent(modelVariants[0].model)}`);
                                        } else {
                                            setOpenDropdown(openDropdown === idx ? null : idx);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        setOpenDropdown(null);
                                        setHoveredModel(null);
                                    }}
                                    onMouseEnter={e => {
                                        if (modelVariants.length === 1) {
                                            setHoveredModel(modelVariants[0]);
                                            setMousePos({ x: e.clientX, y: e.clientY });
                                        }
                                    }}
                                    onMouseMove={e => {
                                        if (modelVariants.length === 1) {
                                            setMousePos({ x: e.clientX, y: e.clientY });
                                        }
                                    }}
                                >
                                    <span style={{ width: '100%' }}>
                                        {modelVariants[0].manufacturer}{" "}
                                        {modelName}
                                        {modelVariants.length > 1 && (
                                            <span
                                                className={`menu-icon${openDropdown === idx ? ' open' : ''}`}
                                                style={{ marginLeft: 8, fontSize: 16, color: '#888' }}
                                            >
                                                ▼
                                            </span>
                                        )}
                                    </span>

                                    {/* Dropdown for multiple variants */}
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
                                                            const detail = [
                                                                variantObj.model,
                                                                variantObj.start_year,
                                                                variantObj.end_year,
                                                                variantObj.variant
                                                            ].filter(Boolean).join('-');
                                                            setSelectedModel(detail);
                                                            setOpenDropdown(null);
                                                            navigate(`/catalog/${encodeURIComponent(manufacturer)}/${encodeURIComponent(detail)}`);
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
                                        </div>
                                    )}

                                    {hoveredModel && hoveredModel.image_path && (
                                        <img
                                            src={
                                                hoveredModel && hoveredModel.image_path
                                                    ? hoveredModel.image_path.replace('src/assets', '/assets')
                                                    : '/assets/CARPLACEHOLDER.png'
                                            }
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
                            ))}



                        </div>
                    )}
                    {selectedModel && (() => {
                        let selectedModelObj = models.find(m => {
                            if (m.model === selectedModel) return true;
                            const parts = selectedModel.split('-');
                            return (
                                m.model === parts[0] &&
                                (parts[1] ? String(m.start_year) === parts[1] : true) &&
                                (parts[2] ? String(m.end_year) === parts[2] : true) &&
                                (parts[3] ? String(m.variant) === parts[3] : true)
                            );
                        });
                        if (!selectedModelObj) return null;
                        return (
                            <ModelInfoCard
                                image={selectedModelObj.image_path ? selectedModelObj.image_path.replace('src/assets', '/assets') : '/assets/CARPLACEHOLDER.png'}
                                title={`${selectedModelObj.manufacturer} ${selectedModelObj.model}${selectedModelObj.variant ? ` (${selectedModelObj.variant})` : ''}`}
                                description={selectedModelObj.description || ''}
                                specs={[
                                    selectedModelObj.start_year ? { label: 'Years', value: selectedModelObj.end_year ? `${selectedModelObj.start_year} - ${selectedModelObj.end_year}` : `${selectedModelObj.start_year}` } : null,
                                    selectedModelObj.code ? { label: 'Code', value: selectedModelObj.code } : null,
                                ].filter(Boolean)}
                                style={{ maxWidth: 700, margin: '0 auto 24px auto', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${headerRedLight}` }}
                            />
                        );
                    })()}

                    <h3 style={{ color: headerRed, margin: '24px 0 16px 0', textAlign: 'center' }}>
                        {t('models.productsFor', { manufacturer, selectedModel })}
                    </h3>
                    {loading && <Loader />}
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
                            {filteredProducts.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', fontSize: '18px' }}>
                                    {t('models.noPartsForModel', 'No parts found for this model.')}
                                </div>
                            ) : (
                                filteredProducts.map((product, idx) => (
                                    <ProductCard
                                        key={product.id || idx}
                                        product={product}
                                        onClick={() => {
                                            if (product.AM) {
                                                localStorage.setItem('selectedProductAM', product.AM);
                                            }
                                            navigate(
                                                `/catalog/${encodeURIComponent(manufacturer)}/${encodeURIComponent(selectedModel)}/${encodeURIComponent(product.AM)}`,
                                                { replace: false }
                                            );
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Models;
