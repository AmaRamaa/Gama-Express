import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supaBase/supaBase';

const ProductDetails = () => {
    const { category, subcategory, product } = useParams(); // category=manufacturer, subcategory=model, product=AM
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

    if (loading) return <div>Loading...</div>;
    if (!part) return <div>Part not found.</div>;

    return (
        <div className="container" style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 8, padding: 32 }}>
            <h2 style={{ color: '#0a2266', marginBottom: 16 }}>{part.Description}</h2>
            <div style={{ display: 'flex', gap: 32 }}>
                <img
                    src={part.img}
                    alt={part.Description}
                    style={{ width: 220, height: 220, objectFit: 'contain', border: '1px solid #eee', borderRadius: 8 }}
                />
                <div>
                    <p><strong>OEM:</strong> {part.OEM}</p>
                    <p><strong>AM:</strong> {part.AM}</p>
                    <p><strong>Model:</strong> {part.Model}</p>
                    <p><strong>Car:</strong> {part.Car}</p>
                    <p><strong>Created At:</strong> {new Date(part.created_at).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
