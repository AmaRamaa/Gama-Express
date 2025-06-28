import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supaBase/supaBase';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Loader from '../../components/Loader';
import ProductCard from '../../components/ProductCard';
import ViberLogo from '../../assets/ViberLogo.png';
import WhatsAppLogo from '../../assets/WhatsAppLogo.png';
import Pagination from "react-js-pagination";
import { useTranslation } from 'react-i18next';
import '../../i18n';

const FIELD_LABELS = {
    OEM: 'OEM',
    AM: 'AM',
    Description: 'Description',
    Model: 'Model',
    Car: 'Car',
    start_year: 'Start Year',
    end_year: 'End Year',
    Variant: 'Variant',
    Category: 'Category',
    Subcategory: 'Subcategory',
    // Add lowercase keys for compatibility
    oem: 'OEM',
    am: 'AM',
    description: 'Description',
    model: 'Model',
    car: 'Car',
    variant: 'Variant',
    category: 'Category',
    subcategory: 'Subcategory',
};

const BUBBLE_FIELDS = [
    { key: 'Category', color: 'primary' },
    { key: 'Subcategory', color: 'info' },
    { key: 'Variant', color: 'success' },
    // Add lowercase keys for compatibility
    { key: 'category', color: 'primary' },
    { key: 'subcategory', color: 'info' },
    { key: 'variant', color: 'success' },
];

const WHATSAPP_NUMBER = '+38344100531'; // Replace with your WhatsApp number
const VIBER_NUMBER = '+38344100531';    // Replace with your Viber number

const ProductDetails = () => {
    const { t } = useTranslation();
    const { product } = useParams();
    const [part, setPart] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [showAll, setShowAll] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);

    // --- Add state for related products and pagination ---
    const [relatedProducts, setRelatedProducts] = React.useState([]);
    const [relatedLoading, setRelatedLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;
        const fetchPart = async () => {
            const { data, error } = await supabase
                .from('Parts')
                .select('*')
                .eq('AM', product)
                .single();
            if (!isMounted) return;
            if (error) {
                
                console.error('Error fetching part:', error);
                setLoading(false);
                setPart(null);
                setRelatedProducts([]); // Clear related products if part not found
                return;
            }
            setPart(data);
            setLoading(false);
        };
        fetchPart();
        return () => {
            isMounted = false;
        };
    }, [product]);

    // --- Use the pagination/filter hook for related products ---
    const DEFAULT_PAGE_SIZE = 9;
    function usePaginationAndFilter(initialData = []) {
        const [page, setPage] = React.useState(1);
        const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
        const [filter, setFilter] = React.useState('');
        const [data, setData] = React.useState(initialData);

        // Filtering logic
        const filteredData = React.useMemo(() => {
            if (!filter) return data;
            return data.filter(item =>
                Object.values(item)
                    .join(' ')
                    .toLowerCase()
                    .includes(filter.toLowerCase())
            );
        }, [data, filter]);

        // Paginated data
        const paginatedData = React.useMemo(() => {
            const start = (page - 1) * pageSize;
            return filteredData.slice(start, start + pageSize);
        }, [filteredData, page, pageSize]);

        // Reset page if filter changes
        React.useEffect(() => {
            setPage(1);
        }, [filter, pageSize]);

        return {
            page,
            setPage,
            pageSize,
            setPageSize,
            filter,
            setFilter,
            paginatedData,
            totalItems: filteredData.length,
            setData,
        };
    }

    const {
        page: relatedPage,
        setPage: setRelatedPage,
        pageSize: relatedPageSize,
        setPageSize: setRelatedPageSize,
        filter: relatedFilter,
        setFilter: setRelatedFilter,
        paginatedData: paginatedRelatedProducts,
        totalItems: relatedTotalItems,
        setData: setRelatedData,
    } = usePaginationAndFilter(relatedProducts);

    React.useEffect(() => {
        if (!part) return;
        setRelatedLoading(true);
        const fetchRelated = async () => {
            const { data, error } = await supabase
                .from('Parts')
                .select('*')
                .or(
                    `Category.eq.${part.Category},Subcategory.eq.${part.Subcategory}`
                )
                .neq('AM', part.AM)
                .limit(100);
            if (error) {
                setRelatedData([]);
                setRelatedLoading(false);
                return;
            }
            setRelatedData(data || []);
            setRelatedLoading(false);
        };
        fetchRelated();
    }, [part, setRelatedData]);

    if (loading) return <Loader />;
    if (!part) return <div className="alert alert-danger my-5 text-center">{t('productDetails.notFound', 'Part not found.')}</div>;

    return (
        <div className="container my-5">
            <div className="row g-4 align-items-start justify-content-center">
                {/* Left: Product Card */}
                <div className="col-md-5 text-center mb-4 mb-md-0">
                    <ProductCard
                        product={part}
                        style={{ margin: '0 auto', boxShadow: '0 4px 24px rgba(229,57,53,0.10)' }}
                        showBranding={true}
                        className="shadow-lg"
                    />
                </div>
                {/* Right: Details */}
                <div className="col-md-7">
                    <h2 className="mb-3" style={{ color: '#e53935', fontWeight: 700 }}>{part.Description}</h2>
                    <div className="mb-3 d-flex gap-2 flex-wrap">
                        {BUBBLE_FIELDS.map(({ key, color }) =>
                            part[key] ? (
                                <span
                                    key={key}
                                    className={`glass-badge fs-6 px-3 py-2`}
                                >
                                    {FIELD_LABELS[key]}: {part[key]}
                                </span>
                            ) : null
                        )}
                    </div>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>OEM:</strong> {part.OEM}</li>
                        <li className="list-group-item"><strong>AM:</strong> {part.AM}</li>
                        <li className="list-group-item"><strong>Model:</strong> {part.Model}</li>
                        <li className="list-group-item"><strong>Car:</strong> {part.Car}</li>
                        <li className="list-group-item"><strong>Created At:</strong> {new Date(part.created_at).toLocaleString()}</li>
                    </ul>
                    <button className="btn btn-danger px-4 mb-3" onClick={() => setShowModal(true)}>
                        {t('productDetails.contactSales', 'Contact Sales')}
                    </button>
                    {/* Call Sales */}
                    <div className="mb-3">
                        <a
                            href="tel:+38344100531"
                            className="btn btn-outline-primary"
                            style={{ minWidth: 180 }}
                        >
                            {t('productDetails.callSales', 'Call Sales')}: +383 44 100 531
                        </a>
                    </div>
                    {/* Modal Overlay */}
                    {showModal && (
                        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">{t('productDetails.contactSales', 'Contact Sales')}</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body text-center">
                                        <p>{t('productDetails.chooseApp', 'Choose your preferred app to contact us:')}</p>
                                        <a
                                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-success mx-2"
                                        >
                                            <img src={WhatsAppLogo} alt="WhatsApp" style={{ width: 40, height: 40 }} />
                                        </a>
                                        <a
                                            href={`viber://chat?number=%2B${VIBER_NUMBER}`}
                                            className="btn mx-2"
                                            style={{ backgroundColor: '#7360f2', color: '#fff' }}
                                        >
                                            <img
                                                src={ViberLogo}
                                                alt="Viber"
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    filter: 'brightness(0) invert(1)'
                                                }}
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="accordion" id="detailsAccordion">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingAll">
                                <button
                                    className={`accordion-button${showAll ? '' : ' collapsed'}`}
                                    type="button"
                                    onClick={() => setShowAll(prev => !prev)}
                                    aria-expanded={showAll}
                                    aria-controls="collapseAll"
                                >
                                    {showAll ? t('productDetails.hideDetails', 'Hide Details') : t('productDetails.viewAllDetails', 'View All Details')}
                                </button>
                            </h2>
                            <div
                                id="collapseAll"
                                className={`accordion-collapse collapse${showAll ? ' show' : ''}`}
                                aria-labelledby="headingAll"
                                data-bs-parent="#detailsAccordion"
                            >
                                <div className="accordion-body">
                                    <table className="table table-bordered table-sm">
                                        <tbody>
                                            {Object.entries(FIELD_LABELS).map(([key, label]) =>
                                                part[key] ? (
                                                    <tr key={key}>
                                                        <th style={{ width: 150 }}>{label}</th>
                                                        <td>
                                                            {key === 'created_at'
                                                                ? new Date(part[key]).toLocaleString()
                                                                : part[key]}
                                                        </td>
                                                    </tr>
                                                ) : null
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* --- Related Products Section with Pagination --- */}
                    <div className="mt-5">
                        <h4 className="mb-3">{t('productDetails.relatedProducts', 'Related Products')}</h4>
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder={t('productDetails.filterRelated', 'Filter related products...')}
                            value={relatedFilter}
                            onChange={e => setRelatedFilter(e.target.value)}
                            style={{ maxWidth: 300 }}
                        />
                        {relatedLoading ? (
                            <Loader />
                        ) : paginatedRelatedProducts.length === 0 ? (
                            <div className="alert alert-warning">{t('productDetails.noRelated', 'No related products found.')}</div>
                        ) : (
                            <>
                                <div className="row g-4" style={{gap: '15px'}}> 
                                    {paginatedRelatedProducts.map(prod => {
                                        // Normalize keys to uppercase for ProductCard compatibility
                                        const normalizedProd = {
                                            ...prod,
                                            AM: prod.AM || prod.am,
                                            OEM: prod.OEM || prod.oem,
                                            Description: prod.Description || prod.description,
                                            Model: prod.Model || prod.model,
                                            Car: prod.Car || prod.car,
                                            Category: prod.Category || prod.category,
                                            Subcategory: prod.Subcategory || prod.subcategory,
                                            Variant: prod.Variant || prod.variant,
                                        };
                                        return (
                                            <div
                                                className="col-12 col-md-6 col-lg-4"
                                                key={normalizedProd.id || prod.id || prod.AM}
                                            >
                                                <ProductCard
                                                    product={normalizedProd}
                                                    onClick={() => {
                                                        if (normalizedProd.AM) {
                                                            localStorage.setItem('selectedProductAM', normalizedProd.AM);
                                                        }
                                                        // Use manufacturer and selectedModel from the product if available
                                                        const manufacturer = normalizedProd.Manufacturer || normalizedProd.manufacturer || normalizedProd.Car || normalizedProd.car || '';
                                                        const selectedModel = normalizedProd.Model || normalizedProd.model || '';
                                                        window.location.href = `/catalog/${encodeURIComponent(manufacturer)}/${encodeURIComponent(selectedModel)}/${encodeURIComponent(normalizedProd.AM)}`;
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination
                                        activePage={relatedPage}
                                        itemsCountPerPage={relatedPageSize}
                                        totalItemsCount={relatedTotalItems}
                                        pageRangeDisplayed={3}
                                        onChange={setRelatedPage}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

// --- Show related products with same Category OR Subcategory (excluding current part) ---
/*
To show all related products with the same Category or Subcategory, 
modify the fetchRelated function to use `.or()` for the filter.
Replace the fetchRelated function inside the useEffect for related products:
*/

