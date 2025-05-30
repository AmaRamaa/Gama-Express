import React from 'react';
import { supabase } from '../../supaBase/supaBase';

const Manufactures = () => {
    const [manufacturers, setManufacturers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchManufacturers = async () => {
            const { data, error } = await supabase
                .from('Manufacturers')
                .select('*');
            if (error) {
                console.error('Error fetching manufacturers:', error);
            }
            setManufacturers(data || []);
            setLoading(false);
        };
        fetchManufacturers();
    }, []);

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
            <h3 style={{ color: '#0a2266', margin: '24px 0 16px 0', textAlign: 'center' }}>
                Manufacturers
            </h3>
            {loading && <div>Loading...</div>}
            {!loading && (
                <div
                    className="manufacturers-grid container"
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
                    {manufacturers.map((manufacturer, idx) => (
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
                            }}
                        >
                            {manufacturer.image_path && (
                                <img
                                    src={manufacturer.image_path}
                                    alt={manufacturer.manufacturer}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'contain',
                                        marginBottom: '10px',
                                    }}
                                />
                            )}
                            <span>{manufacturer.manufacturer}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Manufactures;
