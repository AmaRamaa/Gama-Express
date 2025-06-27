import React from 'react';

const ModelInfoCard = ({
    image,
    title,
    description,
    specs = [],
    actions = [],
    style = {},
    className = '',
}) => {
    return (
        <div className={`model-info-card ${className}`} style={{
            border: '1px solid #e0e0e0',
            borderRadius: 12,
            padding: 24,
            maxWidth: 400,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            background: '#fff',
            ...style
        }}>
            {image && (
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <img
                        src={image}
                        alt={title}
                        style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8 }}
                    />
                </div>
            )}
            <h2 style={{ margin: '0 0 8px 0', fontSize: 22 }}>{title}</h2>
            <p style={{ color: '#555', marginBottom: 16 }}>{description}</p>
            {specs.length > 0 && (
                <ul style={{ padding: 0, listStyle: 'none', marginBottom: 16 }}>
                    {specs.map((spec, idx) => (
                        <li key={idx} style={{ marginBottom: 6 }}>
                            <strong>{spec.label}:</strong> {spec.value}
                        </li>
                    ))}
                </ul>
            )}
            {actions.length > 0 && (
                <div style={{ display: 'flex', gap: 8 }}>
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={action.onClick}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 6,
                                border: 'none',
                                background: '#1976d2',
                                color: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModelInfoCard;