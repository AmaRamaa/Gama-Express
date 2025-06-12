import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supaBase/supaBase';
import ReactImageMagnify from 'react-image-magnify';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetails = () => {
    const { category, subcategory, product } = useParams();
    const [part, setPart] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchPart = async () => {
            const { data, error } = await supabase
                .from('Parts')
                .select('*')
                .eq('AM', product)
                .single();
            if (error) {
                console.error('Error fetching part:', error);
            }
            setPart(data);
            setLoading(false);
        };
        fetchPart();
    }, [category, subcategory, product]);

    if (loading) return <div className="text-center my-5">Loading...</div>;
    if (!part) return <div className="alert alert-danger my-5 text-center">Part not found.</div>;

    return (
        <div className="container my-5">
            <div className="card shadow-lg p-4" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 16 }}>
                <div className="row g-4 align-items-center">
                    <div className="col-md-5 text-center">
                        <ReactImageMagnify
                            {...{
                                smallImage: {
                                    alt: part.Description,
                                    isFluidWidth: true,
                                    src: part.img,
                                    width: 320,
                                    height: 320,
                                },
                                largeImage: {
                                    src: part.img,
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
                        <button className="btn btn-danger px-4">Contact Sales</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;