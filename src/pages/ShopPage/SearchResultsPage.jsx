import React from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import '../../i18n';

const SearchResultsPage = ({ loading, filteredProducts, headerRed, manufacturer, selectedModel }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="container-fluid mt-5" style={{ maxWidth: '100vw', padding: 0, background: '#fff', borderRadius: '0 0 8px 8px' }}>
            <div style={{ minHeight: '80vh' }}>
                <h3 style={{ color: headerRed, margin: '24px 0 16px 0', textAlign: 'center' }}>
                    {t('searchResults.title', 'Search Results')}
                </h3>
                {loading && <Loader />}
                {!loading && (
                    filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '40px', fontSize: '18px' }}>
                            {t('searchResults.noParts', 'No parts found for this search.')}
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
                                        // Save AM code to localStorage
                                        if (product.AM) {
                                            localStorage.setItem('selectedProductAM', product.AM);
                                        }
                                        // Navigate to ProductDetails page
                                        navigate(
                                            `/catalog/${encodeURIComponent(manufacturer)}/${encodeURIComponent(selectedModel)}/${encodeURIComponent(product.AM)}`,
                                            { replace: false }
                                        );
                                    }}
                                >
                                    <img src={product.img} alt={product.Model} style={{ width: 120, height: 80, objectFit: "contain", marginBottom: 12 }} />
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
};

export default SearchResultsPage;