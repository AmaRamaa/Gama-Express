import React, { useState } from 'react';
import Input from '../../components/Input/Input'; // Adjust the import path as necessary

const models = [
  {
    name: "Audi A1",
    image: "https://example.com/images/audi-a1.jpg"
  },
  {
    name: "Audi A3",
    image: "https://example.com/images/audi-a3.jpg"
  },
  // add more models and images here
];

export default function AudiCatalog() {
  const [hoveredModel, setHoveredModel] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div style={{ position: 'relative' }}>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {models.map((model) => (
          <li
            key={model.name}
            onMouseEnter={() => setHoveredModel(model)}
            onMouseLeave={() => setHoveredModel(null)}
            onMouseMove={handleMouseMove}
            style={{ cursor: 'pointer', margin: '10px 0' }}
          >
            {model.name}
          </li>
        ))}
      </ul>
      <div style={{ margin: '20px 0' }}>
        <Input
          label="Search Models"
          placeholder="Type to search..."
          type="text"
          onChange={() => {}}
        />
      </div>
      {hoveredModel && (
        <img
          src={hoveredModel.image}
          alt={hoveredModel.name}
          style={{
            position: 'fixed',
            top: mousePos.y + 15,
            left: mousePos.x + 15,
            width: '150px',
            height: 'auto',
            pointerEvents: 'none',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 9999,
            transition: 'top 0.1s, left 0.1s',
          }}
        />
      )}
    </div>
  );
}
