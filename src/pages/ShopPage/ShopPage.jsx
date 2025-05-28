import React from 'react';


const carImages = [
    { src: '/src/assets/img/alfa.png', alt: 'ALFA ROMEO' },
    { src: '/src/assets/img/audi.png', alt: 'AUDI' },
    { src: '/src/assets/img/bmw.png', alt: 'BMW' },
    { src: '/src/assets/img/chevrolet.png', alt: 'CHEVROLET' },
    { src: '/src/assets/img/chrysler.png', alt: 'CHRYSLER' },
    { src: '/src/assets/img/citroen.png', alt: 'CITROEN' },
    { src: '/src/assets/img/dacia.png', alt: 'DACIA' },
    { src: '/src/assets/img/daewoo.png', alt: 'DAEWOO' },
    { src: '/src/assets/img/daihatsu.png', alt: 'DAIHATSU' },
    { src: '/src/assets/img/dodge.png', alt: 'DODGE' },
    { src: '/src/assets/img/ds.png', alt: 'DS' },
    { src: '/src/assets/img/fiat.png', alt: 'FIAT' },
    { src: '/src/assets/img/ford.png', alt: 'FORD' },
    { src: '/src/assets/img/honda.png', alt: 'HONDA' },
    { src: '/src/assets/img/hyundai.png', alt: 'HYUNDAI' },
    { src: '/src/assets/img/infiniti.png', alt: 'INFINITI' },
    { src: '/src/assets/img/isuzu.png', alt: 'ISUZU' },
    { src: '/src/assets/img/iveco.png', alt: 'IVECO' },
    { src: '/src/assets/img/jaguar.png', alt: 'JAGUAR' },
    { src: '/src/assets/img/jeep.png', alt: 'JEEP' },
    { src: '/src/assets/img/kia.png', alt: 'KIA' },
    { src: '/src/assets/img/lada.png', alt: 'LADA' },
    { src: '/src/assets/img/lancia.png', alt: 'LANCIA' },
    { src: '/src/assets/img/land.png', alt: 'LAND ROVER' },
    { src: '/src/assets/img/lexus.png', alt: 'LEXUS' },
    { src: '/src/assets/img/mazda.png', alt: 'MAZDA' },
    { src: '/src/assets/img/mercedes.png', alt: 'MERCEDES' },
    { src: '/src/assets/img/mini.png', alt: 'MINI' },
    { src: '/src/assets/img/mitsubishi.png', alt: 'MITSUBISHI' },
    { src: '/src/assets/im</option>g/nissan.png', alt: 'NISSAN' },
    { src: '/src/assets/img/opel.png', alt: 'OPEL' },
    { src: '/src/assets/img/peugeot.png', alt: 'PEUGEOT' },
    { src: '/src/assets/img/porsche.png', alt: 'PORSCHE' },
    { src: '/src/assets/img/range.png', alt: 'RANGE ROVER' },
    { src: '/src/assets/img/renault.png', alt: 'RENAULT' },
    { src: '/src/assets/img/rover (1).jpg', alt: 'ROVER' },
    { src: '/src/assets/img/saab.png', alt: 'SAAB' },
    { src: '/src/assets/img/seat.png', alt: 'SEAT' },
    { src: '/src/assets/img/skoda.png', alt: 'SKODA' },
    { src: '/src/assets/img/smart.png', alt: 'SMART' },
    { src: '/src/assets/img/ssangyong.png', alt: 'SSANGYONG' },
    { src: '/src/assets/img/subaru.png', alt: 'SUBARU' },
    { src: '/src/assets/img/suzuki.png', alt: 'SUZUKI' },
    { src: '/src/assets/img/toyota.png', alt: 'TOYOTA' },
    { src: '/src/assets/img/volvo.png', alt: 'VOLVO' },
    { src: '/src/assets/img/vw.png', alt: 'VW' },
    { src: '/src/assets/img/zastava.png', alt: 'ZASTAVA' },
];

const ShopPage = () => {
    // Get unique manufacturers from carImages
    const manufacturers = carImages.map(car => car.alt);

    const [step, setStep] = React.useState(1);
    const [selectedManufacturer, setSelectedManufacturer] = React.useState('');
    const [selectedModel, setSelectedModel] = React.useState('');
    const [selectedYear, setSelectedYear] = React.useState('');

    // Dummy models and years for demonstration
    const modelsByManufacturer = {
        'ALFA ROMEO': [
            'ALFA 33', 'ALFA 75', '145', '146', '147', '155', '156', '159', '164', '166',
            'SPIDER', 'BRERA', 'GT', 'MITO', 'GIULIETTA', 'GIULIA', 'STELVIO', 'TONALE', 'JUNIOR'
        ],
        'AUDI': [
            '</label>80', '100', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8',
            'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'E-TRON', 'R8'
        ],
        'BMW': [
            '1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series',
            'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z3', 'Z4', 'M2', 'M3', 'M4', 'M5', 'M6', 'i3', 'i8'
        ],
        'CHEVROLET': [
            'Aveo', 'Cruze', 'Spark', 'Malibu', 'Camaro', 'Impala', 'Trax', 'Equinox', 'Tahoe', 'Suburban', 'Silverado'
        ],
        'CHRYSLER': [
            '300', 'Pacifica', 'Voyager', '200', 'Sebring', 'Aspen', 'PT Cruiser', 'Crossfire'
        ],
        'CITROEN': [
            'C1', 'C2', 'C3', 'C3 Aircross', 'C4', 'C4 Cactus', 'C4 Picasso', 'C5', 'Berlingo', 'Jumper', 'Jumpy'
        ],
        'DACIA': [
            'Duster', 'Sandero', 'Logan', 'Dokker', 'Lodgy', 'Spring'
        ],
        'DAEWOO': [
            'Lanos', 'Nubira', 'Matiz', 'Leganza', 'Espero', 'Tico', 'Kalos'
        ],
        'DAIHATSU': [
            'Terios', 'Sirion', 'Charade', 'Cuore', 'Materia', 'Copen', 'Move'
        ],
        'DODGE': [
            'Charger', 'Durango', 'Ram', 'Challenger', 'Journey', 'Caliber', 'Avenger', 'Nitro'
        ],
        'DS': [
            'DS3', 'DS4', 'DS5', 'DS7', 'DS9'
        ],
        'FIAT': [
            '500', '500L', '500X', 'Panda', 'Tipo', 'Punto', 'Bravo', 'Doblo', 'Fiorino', 'Qubo', 'Freemont', 'Linea'
        ],
        'FORD': [
            'Focus', 'Fiesta', 'Mondeo', 'Kuga', 'EcoSport', 'C-Max', 'S-Max', 'Galaxy', 'Ranger', 'Mustang', 'Edge', 'Fusion'
        ],
        'HONDA': [
            'Civic', 'Accord', 'CR-V', 'Jazz', 'HR-V', 'Insight', 'Prelude', 'Legend', 'FR-V'
        ],
        'HYUNDAI': [
            'i10', 'i20', 'i30', 'i40', 'Tucson', 'Santa Fe', 'Kona', 'Elantra', 'Accent', 'Getz', 'Sonata'
        ],
        'INFINITI': [
            'Q30', 'Q50', 'Q60', 'Q70', 'QX30', 'QX50', 'QX60', 'QX70', 'QX80'
        ],
        'ISUZU': [
            'D-Max', 'MU-X', 'Trooper', 'Rodeo', 'Campo', 'Axiom'
        ],
        'IVECO': [
            'Daily', 'Eurocargo', 'Stralis', 'Trakker', 'Massif'
        ],
        'JAGUAR': [
            'XE', 'XF', 'XJ', 'F-Pace', 'E-Pace', 'I-Pace', 'F-Type', 'S-Type', 'X-Type'
        ],
        'JEEP': [
            'Wrangler', 'Cherokee', 'Grand Cherokee', 'Compass', 'Renegade', 'Patriot', 'Commander'
        ],
        'KIA': [
            'Ceed', 'Sportage', 'Rio', 'Picanto', 'Sorento', 'Stonic', 'Optima', 'Carens', 'Soul', 'Niro'
        ],
        'LADA': [
            'Niva', 'Vesta', 'Granta', 'Kalina', 'Priora', 'Samara', '2107', '2105'
        ],
        'LANCIA': [
            'Ypsilon', 'Delta', 'Thema', 'Musa', 'Lybra', 'Phedra', 'Dedra'
        ],
        'LAND ROVER': [
            'Discovery', 'Defender', 'Freelander', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar'
        ],
        'LEXUS': [
            'IS', 'ES', 'GS', 'LS', 'RX', 'NX', 'UX', 'CT', 'LC', 'RC', 'GX', 'LX'
        ],
        'MAZDA': [
            '2', '3', '6', 'CX-3', 'CX-30', 'CX-5', 'CX-7', 'CX-9', 'MX-5', 'RX-8'
        ],
        'MERCEDES': [
            'A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'SL', 'SLC', 'SLK', 'Vito', 'Viano'
        ],
        'MINI': [
            'Cooper', 'Countryman', 'Clubman', 'Paceman', 'Cabrio', 'Roadster', 'Coupe'
        ],
        'MITSUBISHI': [
            'Lancer', 'Outlander', 'ASX', 'Pajero', 'Eclipse Cross', 'Colt', 'Space Star'
        ],
        'NISSAN': [
            'Qashqai', 'Juke', 'Micra', 'X-Trail', 'Navara', 'Leaf', 'Note', 'Almera', 'Primera', 'Pathfinder'
        ],
        'OPEL': [
            'Astra', 'Corsa', 'Insignia', 'Mokka', 'Zafira', 'Meriva', 'Vectra', 'Adam', 'Crossland', 'Grandland'
        ],
        'PEUGEOT': [
            '108', '208', '2008', '308', '3008', '508', '5008', '206', '207', '307', '407', '607', 'Partner', 'Rifter'
        ],
        'PORSCHE': [
            '911', 'Cayenne', 'Macan', 'Panamera', 'Boxster', 'Cayman', 'Taycan'
        ],
        'RANGE ROVER': [
            'Evoque', 'Velar', 'Sport', 'Classic', 'Autobiography'
        ],
        'RENAULT': [
            'Clio', 'Megane', 'Captur', 'Kadjar', 'Scenic', 'Laguna', 'Talisman', 'Koleos', 'Espace', 'Twizy', 'Zoe'
        ],
        'ROVER': [
            '75', '200', '400', '600', '800', '25', '45', 'Streetwise'
        ],
        'SAAB': [
            '9-3', '9-5', '900', '9000'
        ],
        'SEAT': [
            'Ibiza', 'Leon', 'Ateca', 'Arona', 'Toledo', 'Altea', 'Tarraco', 'Mii'
        ],
        'SKODA': [
            'Octavia', 'Fabia', 'Superb', 'Scala', 'Kamiq', 'Karoq', 'Kodiaq', 'Rapid', 'Roomster', 'Yeti'
        ],
        'SMART': [
            'Fortwo', 'Forfour', 'Roadster'
        ],
        'SSANGYONG': [
            'Tivoli', 'Korando', 'Rexton', 'Actyon', 'Kyron', 'Musso'
        ],
        'SUBARU': [
            'Impreza', 'Forester', 'Outback', 'Legacy', 'XV', 'BRZ', 'Levorg'
        ],
        'SUZUKI': [
            'Swift', 'Vitara', 'SX4', 'Ignis', 'Jimny', 'Baleno', 'S-Cross', 'Alto'
        ],
        'TOYOTA': [
            'Corolla', 'Camry', 'Yaris', 'Auris', 'Avensis', 'RAV4', 'C-HR', 'Prius', 'Land Cruiser', 'Aygo', 'Verso', 'Hilux'
        ],
        'VOLVO': [
            'S40', 'S60', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC70', 'XC90', 'C30', 'C70'
        ],
        'VW': [
            'Golf', 'Passat', 'Polo', 'Tiguan', 'Touran', 'Touareg', 'Up!', 'Arteon', 'T-Roc', 'Sharan', 'Caddy', 'Transporter', 'Multivan', 'Amarok', 'Jetta', 'Beetle', 'Scirocco'
        ],
        'ZASTAVA': [
            'Yugo', 'Skala', 'Florida', '10', '128', '750'
        ],
    };
    // Years for each model (example: 2000-2024 for all, for demo purposes)
    const yearsByModel = {};
    Object.values(modelsByManufacturer).flat().forEach(model => {
        yearsByModel[model] = Array.from({ length: 25 }, (_, i) => (2000 + i).toString());
    });

    const handleManufacturerChange = (e) => {
        setSelectedManufacturer(e.target.value);
        setSelectedModel('');
        setSelectedYear('');
        setStep(2);
    };

    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
        setSelectedYear('');
        setStep(3);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // handle search logic here
    };

    return (
    <div
        className="container-fluid mt-5"
        style={{
            maxWidth: '100vw',
            padding: 0,
            background: '#fff', // changed
            borderRadius: '0 0 8px 8px',
        }}
    >
        <form
            className="d-flex flex-wrap gap-3 p-4 shadow-sm"
            style={{
                width: '100%',
                border: 'none',
                borderRadius: '0',
                background: 'transparent',
                boxSizing: 'border-box',
                alignItems: 'flex-end',
            }}
            onSubmit={handleSubmit}
        >
            {/* Manufacturer Select */}
            <div className="flex-grow-1" style={{ minWidth: 200 }}>
                <label htmlFor="manufacturer" className="form-label fw-semibold" style={{ color: '#0a2266' }}>
                    Manufacturer
                </label>
                <select
                    id="manufacturer"
                    name="manufacturer"
                    className="form-select"
                    style={{
                        border: '2px solid red', // changed
                        borderRadius: '8px',
                        background: '#fff', // changed
                        color: '#0a2266',
                    }}
                    value={selectedManufacturer}
                    onChange={handleManufacturerChange}
                >
                    <option value="" style={{ color: '#0a2266' }}>Select Manufacturer</option>
                    {manufacturers.map((name, idx) => (
                        <option key={idx} value={name} style={{ color: '#0a2266' }}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Model Select */}
            {step >= 2 && (
                <div className="flex-grow-1" style={{ minWidth: 200 }}>
                    <label htmlFor="model" className="form-label fw-semibold" style={{ color: '#0a2266' }}>
                        Model
                    </label>
                    <select
                        id="model"
                        name="model"
                        className="form-select"
                        style={{
                            border: '2px solid red', // changed
                            borderRadius: '8px',
                            background: '#fff', // changed
                            color: '#0a2266',
                        }}
                        value={selectedModel}
                        onChange={handleModelChange}
                        disabled={!selectedManufacturer}
                    >
                        <option value="" style={{ color: '#0a2266' }}>Select Model</option>
                        {(modelsByManufacturer[selectedManufacturer] || []).map((model, idx) => (
                            <option key={idx} value={model} style={{ color: '#0a2266' }}>
                                {model}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Year Select */}
            {step >= 3 && (
                <div className="flex-grow-1" style={{ minWidth: 200 }}>
                    <label htmlFor="year" className="form-label fw-semibold" style={{ color: '#0a2266' }}>
                        Year
                    </label>
                    <select
                        id="year"
                        name="year"
                        className="form-select"
                        style={{
                            border: '2px solid red', // changed
                            borderRadius: '8px',
                            background: '#fff', // changed
                            color: '#0a2266',
                        }}
                        value={selectedYear}
                        onChange={handleYearChange}
                        disabled={!selectedModel}
                    >
                        <option value="" style={{ color: '#0a2266' }}>Select Year</option>
                        {(yearsByModel[selectedModel] || []).map((year, idx) => (
                            <option key={idx} value={year} style={{ color: '#0a2266' }}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Submit Button */}
            <div style={{ minWidth: 150 }}>
                <button
                    type="submit"
                    className="btn w-100 fw-bold"
                    style={{
                        backgroundColor: '#fff',
                        color: '#0a2266',
                        border: '2px solid red', // changed
                        borderRadius: '8px',
                        padding: '10px 16px',
                    }}
                    disabled={
                        !selectedManufacturer ||
                        (step >= 2 && !selectedModel) ||
                        (step >= 3 && !selectedYear)
                    }
                >
                    Search
                </button>
            </div>
        </form>

        <section>
            <div
                className="cars-container container"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '16px',
                    marginTop: '40px',
                    justifyItems: 'center',
                    width: '100%',
                    maxWidth: '100vw',
                    background: '#fff', // changed
                    borderRadius: '0 0 8px 8px',
                    paddingBottom: '24px',
                }}
            >
                {carImages.map((car, idx) => (
                    <div
                        className="car-box"
                        key={idx}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '12px',
                            border: '1px solid red', // changed
                            borderRadius: '8px',
                            background: '#fff', // changed
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    >
                        <img
                            src={car.src}
                            alt={car.alt}
                            className="car-img"
                            style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'contain',
                                marginBottom: '8px',
                                // filter removed
                            }}
                        />
                        <div
                            className="car-name"
                            style={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                textAlign: 'center',
                                color: '#0a2266', // changed for contrast
                            }}
                        >
                            {car.alt}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </div>
);

};

export default ShopPage;
