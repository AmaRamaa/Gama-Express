import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const initialSections = [
    {
        id: 'actions',
        title: 'Veprimet e shpejta',
        items: [
            { id: 'LS', label: 'LS', desc: 'Libri i shitjeve', color: '#FFA726' },
            { id: 'SV', label: 'SV', desc: 'Shitja vendore', color: '#FFD54F' },
            { id: 'A', label: 'A', desc: 'Artikujt', color: '#789262' },
        ],  
    },
    {
        id: 'reports',
        title: 'Raportet e shpejta',
        items: [
            { id: 'KA', label: 'KA', desc: 'Kartela e artikullit', color: '#FFA726' },
            { id: 'KB', label: 'KB', desc: 'Kartela e bleresit', color: '#789262' },
        ],
    },
];

function Section({ section, onDragStart, onDragOver, onDrop, draggable }) {
    return (
        <div
            draggable={draggable}
            onDragStart={e => onDragStart(e, section.id)}
            onDragOver={e => onDragOver(e)}
            onDrop={e => onDrop(e, section.id)}
            style={{
                marginBottom: '2rem',
                background: '#f7f7f7',
                borderRadius: 8,
                padding: '1rem',
                minHeight: 120,
                boxShadow: '0 1px 4px #0001',
            }}
        >
            <div style={{ fontWeight: 500, marginBottom: 16, color: '#3a3a3a', fontSize: 16 }}>
                {section.title}
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
                {section.items.map(item => (
                    <div key={item.id} style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                background: item.color,
                                color: '#fff',
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: 22,
                                margin: '0 auto 8px auto',
                                boxShadow: '0 1px 2px #0002',
                            }}
                        >
                            {item.label}
                        </div>
                        <div style={{ fontSize: 13, color: '#444', maxWidth: 80 }}>{item.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const DashboardHome = () => {
    const [sections, setSections] = useState(initialSections);
    const [draggedId, setDraggedId] = useState(null);

    const onDragStart = (e, id) => {
        setDraggedId(id);
    };

    const onDragOver = e => {
        e.preventDefault();
    };

    const onDrop = (e, dropId) => {
        e.preventDefault();
        if (draggedId === dropId) return;
        const draggedIdx = sections.findIndex(s => s.id === draggedId);
        const dropIdx = sections.findIndex(s => s.id === dropId);
        if (draggedIdx === -1 || dropIdx === -1) return;
        const newSections = [...sections];
        const [removed] = newSections.splice(draggedIdx, 1);
        newSections.splice(dropIdx, 0, removed);
        setSections(newSections);
        setDraggedId(null);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, color: '#444' }}>
                Good Afternoon, Amar Rama
            </div>
            {sections.map(section => (
                <Section
                    key={section.id}
                    section={section}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    draggable
                />
            ))}
        </div>
    );
};

export default DashboardHome;