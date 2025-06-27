import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supaBase/supaBase';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Loader from '../../components/Loader';
import ProductCard from '../../components/ProductCard';
import ViberLogo from '../../assets/ViberLogo.png';
import WhatsAppLogo from '../../assets/WhatsAppLogo.png';

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
};



const BUBBLE_FIELDS = [
    { key: 'Category', color: 'primary' },
    { key: 'Subcategory', color: 'info' },
    { key: 'Variant', color: 'success' },
];

const WHATSAPP_NUMBER = '+38344100531'; // Replace with your WhatsApp number
const VIBER_NUMBER = '+38344100531';    // Replace with your Viber number

const ProductDetails = () => {
    const { category, subcategory, product } = useParams();
    const [part, setPart] = React.useState(null);

    // Import logo images
    const [loading, setLoading] = React.useState(true);
    const [showAll, setShowAll] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);

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

    if (loading) return <Loader />;
    if (!part) return <div className="alert alert-danger my-5 text-center">Part not found.</div>;

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
                        Contact Sales
                    </button>
                    {/* Call Sales */}
                    <div className="mb-3">
                        <a
                            href="tel:+38344100531"
                            className="btn btn-outline-primary"
                            style={{ minWidth: 180 }}
                        >
                            Call Sales: +383 44 100 531
                        </a>
                    </div>
                    {/* Modal Overlay */}
                    {showModal && (
                        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Contact Sales</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body text-center">
                                        <p>Choose your preferred app to contact us:</p>
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
                                    className="accordion-button collapsed"
                                    type="button"
                                    onClick={() => setShowAll(!showAll)}
                                    aria-expanded={showAll}
                                    aria-controls="collapseAll"
                                >
                                    View All Details
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
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;