import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supaBase/supaBase';
import ReactImageMagnify from 'react-image-magnify';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import GamaLogo from '/assets/GamaExpressSmallLogo.png'; // Adjust path if needed


const FIELD_LABELS = {
    OEM: 'OEM',
    AM: 'AM',
    Description: 'Description',
    Model: 'Model',
    Car: 'Car',
    img: 'Image Path',
    start_year: 'Start Year',
    end_year: 'End Year',
    Variant: 'Variant',
    Category: 'Category',
    Subcategory: 'Subcategory',
    Code: 'Code',
    created_at: 'Created At',
    id: 'ID',
};

const BUBBLE_FIELDS = [
    { key: 'Category', color: 'primary' },
    { key: 'Subcategory', color: 'info' },
    { key: 'Variant', color: 'success' },
];

const ProductDetails = () => {
    const { category, subcategory, product } = useParams();
    const [part, setPart] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [imgUrl, setImgUrl] = React.useState('');
    const [showAll, setShowAll] = React.useState(false);

    React.useEffect(() => {
        const fetchPart = async () => {
            const { data, error } = await supabase
                .from('Parts')
                .select('*')
                .eq('AM', product)
                .single();
            if (error) {
                console.error('Error fetching part:', error);
                setLoading(false);
                setPart(null);
                return;
            }
            setPart(data);
            setLoading(false);

            if (data && data.img) {
                const imgPath = data.img;
                const { data: imageData, error: imgError } = await supabase
                    .storage
                    .from('part-images')
                    .download(imgPath);

                if (imgError) {
                    console.error('Error downloading image:', imgError);
                    setImgUrl('');
                } else {
                    const url = URL.createObjectURL(imageData);
                    setImgUrl(url);
                }
            } else {
                setImgUrl('');
            }
        };
        fetchPart();

        return () => {
            if (imgUrl) URL.revokeObjectURL(imgUrl);
        };
        // eslint-disable-next-line
    }, [category, subcategory, product]);

    if (loading) return <div className="text-center my-5">Loading...</div>;
    if (!part) return <div className="alert alert-danger my-5 text-center">Part not found.</div>;

    return (
        <div className="container my-5">
            {loading ? (
                <div className="text-center my-5">Loading...</div>
            ) : !part ? (
                <div className="alert alert-danger my-5 text-center">Part not found.</div>
            ) : (
                <>
                    <div className="mb-3 d-flex gap-2 flex-wrap justify-content-center">
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
                    <div className="card shadow-lg p-4" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 16 }}>
                        <div className="row g-4 align-items-center">
                            <div className="col-md-5 text-center">
                                {imgUrl ? (
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <ReactImageMagnify
                                            {...{
                                                smallImage: {
                                                    alt: part.Description,
                                                    isFluidWidth: true,
                                                    src: imgUrl,
                                                    width: 320,
                                                    height: 320,
                                                },
                                                largeImage: {
                                                    src: imgUrl,
                                                    width: 900,
                                                    height: 900,
                                                },
                                                enlargedImageContainerStyle: { zIndex: 2000 },
                                                enlargedImageStyle: { borderRadius: 8 },
                                                isHintEnabled: true,
                                                shouldUsePositiveSpaceLens: true,
                                                lensStyle: { backgroundColor: 'rgba(255,255,255,.3)' },
                                            }}
                                            style={{ borderRadius: 8, border: '1px solid #eee', background: '#fafafa' }}
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
                                ) : (
                                    <div>
                                        <div>No image available</div>
                                        <div style={{ position: 'relative', display: 'inline-block', marginTop: 16 }}>
                                            <img
                                                src={GamaLogo}
                                                alt="Gama Express Branding"
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    opacity: 0.25,
                                                    pointerEvents: 'none',
                                                    userSelect: 'none',
                                                }}
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-7">
                                <h2 className="mb-3" style={{ color: '#e53935' }}>{part.Description}</h2>
                                <ul className="list-group list-group-flush mb-3">
                                    <li className="list-group-item"><strong>OEM:</strong> {part.OEM}</li>
                                    <li className="list-group-item"><strong>AM:</strong> {part.AM}</li>
                                    <li className="list-group-item"><strong>Model:</strong> {part.Model}</li>
                                    <li className="list-group-item"><strong>Car:</strong> {part.Car}</li>
                                    <li className="list-group-item"><strong>Created At:</strong> {new Date(part.created_at).toLocaleString()}</li>
                                </ul>
                                <button className="btn btn-danger px-4 mb-3">Contact Sales</button>
                                {/* Dropdown for all info */}
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
                                {/* End Dropdown */}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDetails;