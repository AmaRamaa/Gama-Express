import React, { useState, useEffect } from 'react';

// Example: get active section from localStorage or another source
const getActiveSection = () => {
    // You can change this logic to fetch from API, context, etc.
    // For demo, let's get from localStorage or default to 'actions'
    return localStorage.getItem('activeSection') || 'actions';
};

// Read dashboardHomeSections from localStorage, or use default
// Read dashboardTabs from localStorage and map to quick actions
const getQuickActions = () => {
    try {
        const raw = localStorage.getItem("dashboardTabs");
        // console.log("Raw tabs from localStorage:", raw);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        // Map each tab to a quick action item
        return parsed.map(tab => ({
            id: tab.id,
            label: tab.label?.split(' ').map(w => w[0]).join('').toUpperCase() || tab.id?.toUpperCase() || '',
            desc: tab.label || tab.id,
            color: '#42A5F5', // You can customize color logic if needed
            link: tab.path || '#',
        }));
    } catch {
        return [];
    }
};

const getAllSections = () => [
    {
        id: 'actions',
        title: 'Veprimet e shpejta',
        items: getQuickActions(),
    },
    {
        id: 'reports',
        title: 'Raportet e shpejta',
        items: [
            { id: 'profiles-list', icon: <FaUser />, label: 'PL', desc: 'Profiles List', color: '#42A5F5', link: '/profiles' },
            { id: 'profiles-create', icon: <FaUser />, label: 'PC', desc: 'Profiles Create', color: '#42A5F5', link: '/profiles/create' },
            { id: 'profile-view', icon: <FaUser />, label: 'VP', desc: 'View Profile', color: '#42A5F5', link: '/profile/view' },
            { id: 'profile-edit', icon: <FaUser />, label: 'EP', desc: 'Edit Profile', color: '#42A5F5', link: '/profile/edit' },
            { id: 'settings-general', icon: <FaCog />, label: 'G', desc: 'General', color: '#42A5F5', link: '/settings/general' },
            { id: 'settings-security', icon: <FaCog />, label: 'S', desc: 'Security', color: '#42A5F5', link: '/settings/security' },
        ],
    },
];

// Only include "Veprimet e shpejta" if active
const getInitialSections = () =>
    getAllSections().filter(
        section => section.id !== 'actions' || getActiveSection() === 'actions'
    );

function Section({ section, onDragStart, onDragOver, onDrop, draggable }) {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <div
            draggable={draggable}
            onDragStart={e => {
                setIsDragging(true);
                onDragStart(e, section.id);
            }}
            onDragEnd={() => setIsDragging(false)}
            onDragOver={e => onDragOver(e)}
            onDrop={e => {
                setIsDragging(false);
                onDrop(e, section.id);
            }}
            style={{
                marginBottom: '2rem',
                background: '#f7f7f7',
                borderRadius: 12,
                padding: '1.5rem',
                minHeight: 120,
                boxShadow: isDragging
                    ? '0 8px 24px #0003, 0 1.5px 6px #0001'
                    : '0 1px 4px #0001',
                opacity: isDragging ? 0.85 : 1,
                transform: isDragging ? 'scale(1.03) rotate(-1deg)' : 'none',
                transition: 'box-shadow 0.2s, opacity 0.2s, transform 0.2s',
                position: 'relative',
                cursor: 'grab',
            }}
        >
            {/* Drag handle */}
            <div
                style={{
                    position: 'absolute',
                    left: 12,
                    top: 12,
                    cursor: 'grab',
                    opacity: 0.7,
                    userSelect: 'none',
                    fontSize: 20,
                    display: 'flex',
                    alignItems: 'center',
                }}
                title="Drag to reorder"
            >
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                    <circle cx="5" cy="6" r="1.3" fill="#bbb"/>
                    <circle cx="5" cy="10" r="1.3" fill="#bbb"/>
                    <circle cx="5" cy="14" r="1.3" fill="#bbb"/>
                    <circle cx="15" cy="6" r="1.3" fill="#bbb"/>
                    <circle cx="15" cy="10" r="1.3" fill="#bbb"/>
                    <circle cx="15" cy="14" r="1.3" fill="#bbb"/>
                </svg>
            </div>
            <div style={{ fontWeight: 600, marginBottom: 20, color: '#2a2a2a', fontSize: 17, paddingLeft: 36 }}>
                {section.title}
            </div>
            <div style={{ display: 'flex', gap: 32, paddingLeft: 24 }}>
                {section.items.map(item => (
                    <div key={item.id} style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                width: 54,
                                height: 54,
                                background: item.color,
                                color: '#fff',
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: 24,
                                margin: '0 auto 10px auto',
                                boxShadow: '0 2px 8px #0002',
                                transition: 'box-shadow 0.2s, transform 0.2s',
                                cursor: 'pointer',
                                transform: isDragging ? 'scale(0.97)' : 'none',
                            }}
                        >
                            {item.label}
                        </div>
                        <div style={{ fontSize: 13, color: '#444', maxWidth: 90 }}>{item.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const LOCAL_STORAGE_KEY = "dashboardHomeSections";
const DashboardHome = () => {
    // Load from localStorage or use initialSections
    const [sections, setSections] = useState(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : getInitialSections();
    });
    const [draggedId, setDraggedId] = useState(null);

    // Refresh quick actions on mount (in case localStorage changes)
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!saved) {
            setSections(getInitialSections());
        } else {
            // Update only the actions section's items if dashboardTabs changed
            setSections(prevSections => {
                return prevSections.map(section => {
                    if (section.id === 'actions') {
                        return { ...section, items: getQuickActions() };
                    }
                    return section;
                });
            });
        }
        // eslint-disable-next-line
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sections));
    }, [sections]);

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