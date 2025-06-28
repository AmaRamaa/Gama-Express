import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import 'bootstrap/dist/css/bootstrap.min.css';

// Use the public URL for the logo image
const GamaExpressLogo = "/GamaExpressLogo1.png";

const brandsData = [
    {
        name: 'TYC',
        description: 'TYC specializes in innovative automotive lighting and cooling solutions, blending advanced technology with reliability for modern vehicles.',
        image: '/TYC.png',
    },
    {
        name: 'DEPO',
        description: 'DEPO is renowned for its precision-engineered automotive lighting products, offering safety and style for drivers worldwide.',
        image: '/DEPO.png',
    },
    {
        name: 'Nissens',
        description: 'Nissens delivers advanced thermal solutions, including radiators and climate systems, engineered for efficiency and durability.',
        image: '/Nissens.png',
    },
    {
        name: 'Valeo',
        description: 'Valeo is a global leader in smart automotive systems, providing innovative solutions for comfort, safety, and energy efficiency.',
        image: '/Valeo.png',
    },
    {
        name: 'Mars Tech',
        description: 'Mars Tech offers dependable automotive components, focusing on quality and performance to keep vehicles running smoothly.',
        image: '/Mars.png',
    },
    {
        name: 'API',
        description: 'API delivers high-performance automotive parts, combining innovation and reliability for a superior driving experience.',
        image: '/AP.png',
    },
    {
        name: 'Mageti Marelli',
        description: 'Mageti Marelli is a leading global supplier of automotive components and systems, known for innovation in lighting, electronics, and powertrain solutions.',
        image: '/Mageti Marelli.png',
    },
    {
        name: 'OEM',
        description: 'Original Equipment Manufacturer: Trusted for producing high-quality, factory-standard automotive parts that ensure optimal vehicle performance.',
        image: '/OEM.png',
    },  
];



const BrandCard = ({ brand }) => {
    const { t } = useTranslation();
    const [hovered, setHovered] = useState(false);

    const getDescriptionWithBoldName = () => {
        const { name } = brand;
        // Use translation if available, fallback to brand.description
        const desc = t(`brands.${name}.description`, brand.description);
        const index = desc.indexOf(name);
        if (index === -1) return desc;
        return (
            <>
                {desc.substring(0, index)}
                <strong>{name}</strong>
                {desc.substring(index + name.length)}
            </>
        );
    };

    return (
        <div
            className={`card shadow-sm text-center h-100 border-0 ${hovered ? 'shadow-lg' : ''}`}
            style={{
                width: '200px',
                transition: 'box-shadow 0.3s, transform 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'visible',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="card-body d-flex flex-column align-items-center p-3">
                <img
                    src={brand.image}
                    alt={brand.name}
                    className="mb-2"
                    style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'contain',
                        transition: 'transform 0.3s',
                        transform: hovered ? 'scale(1.08)' : 'scale(1)',
                    }}
                />
                <h5 className="card-title mb-2 fw-bold">{brand.name}</h5>
            </div>
            <div
                className="position-absolute w-100"
                style={{
                    left: 0,
                    top: '100%',
                    zIndex: 10,
                    background: '#f8f9fa',
                    borderRadius: '0 0 1rem 1rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                    padding: hovered ? '1rem' : '0 1rem',
                    maxHeight: hovered ? '200px' : '0',
                    opacity: hovered ? 1 : 0,
                    pointerEvents: hovered ? 'auto' : 'none',
                    transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
                    fontSize: '0.97rem',
                    color: '#444',
                    overflow: 'hidden',
                }}
            >
                {hovered && getDescriptionWithBoldName()}
            </div>
        </div>
    );
};

const BrandsList = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
        {brandsData.map((brand, idx) => (
            <BrandCard key={brand.name + idx} brand={brand} />
        ))}
    </div>
);

const Company = () => {
    const { t } = useTranslation();
    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem', textAlign: 'center', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)'}}>
            <img src={GamaExpressLogo} alt="Gama Express Logo" />
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '1rem' }}>{t('company.about')}</h1>
            <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: '2rem', lineHeight: 1.7 }}>
                {t('company.description')}
            </p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>{t('company.brands')}</h2>
            <BrandsList />
        </div>
    );
};

export default Company;
