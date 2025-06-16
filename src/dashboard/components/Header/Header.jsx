import React from 'react';
import { supabase } from "../../../supaBase/supaBase";
import { useNavigate } from 'react-router-dom';

const Header = ({
    tabs = [],
    onTabClick,
    onTabClose,
    actions,
    user,
    onTabReorder // <-- Add this prop to handle reordering
}) => {
    const [allowed, setAllowed] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [draggedIdx, setDraggedIdx] = React.useState(null);
    const [dragOverIdx, setDragOverIdx] = React.useState(null);

    const navigate = window.location ? (path) => { window.location.href = path; } : () => {};

    React.useEffect(() => {
        const checkUser = async () => {
            setLoading(true);
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                if (!currentUser) {
                    setAllowed(false);
                    setLoading(false);
                    navigate('/');
                    return;
                }
                const { data, error } = await supabase
                    .from('Profiles')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .single();

                if (data?.role === "admin") {
                    setAllowed(true);
                } else {
                    setAllowed(false);
                    navigate('/');
                }
                setLoading(false);
            } catch (error) {
                setAllowed(false);
                setLoading(false);
                navigate('/');
            }
        };
        checkUser();
    }, []);

    // Drag handlers
    const handleDragStart = (e, idx) => {
        setDraggedIdx(idx);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, idx) => {
        e.preventDefault();
        setDragOverIdx(idx);
    };

    const handleDrop = (e, idx) => {
        e.preventDefault();
        if (draggedIdx === null || draggedIdx === idx) {
            setDraggedIdx(null);
            setDragOverIdx(null);
            return;
        }
        const newTabs = [...tabs];
        const [removed] = newTabs.splice(draggedIdx, 1);
        newTabs.splice(idx, 0, removed);
        setDraggedIdx(null);
        setDragOverIdx(null);
        if (onTabReorder) onTabReorder(newTabs); // <-- this updates parent state
    };

    const handleDragEnd = () => {
        setDraggedIdx(null);
        setDragOverIdx(null);
    };

    // Save tabs order to localStorage when reordered
    const handleTabReorder = (newTabs) => {
        if (onTabReorder) onTabReorder(newTabs);
        // Save to localStorage (use a unique key if needed)
        localStorage.setItem('dashboardTabsOrder', JSON.stringify(newTabs.map(tab => tab.id || tab.label)));
    };

    // On mount, restore tabs order from localStorage if available
    React.useEffect(() => {
        const savedOrder = localStorage.getItem('dashboardTabsOrder');
        if (savedOrder && tabs.length > 0) {
            const order = JSON.parse(savedOrder);
            // Reorder tabs according to saved order
            const orderedTabs = order
                .map(id => tabs.find(tab => (tab.id || tab.label) === id))
                .filter(Boolean);
            // Add any new tabs not in saved order
            const remainingTabs = tabs.filter(tab => !order.includes(tab.id || tab.label));
            if (orderedTabs.length > 0 && onTabReorder) {
                onTabReorder([...orderedTabs, ...remainingTabs]);
            }
        }
        // eslint-disable-next-line
    }, [tabs.length]);

    if (loading) return null;
    if (!allowed) return <div className="alert alert-danger m-4">You are not allowed to access this page.</div>;

    return (
        <header className="d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom shadow-sm">
            <div className="flex-grow-1 d-flex align-items-center">
                <ul className="nav nav-tabs" style={{ userSelect: 'none' }}>
                    {tabs.map((tab, idx) => (
                        <li
                            className="nav-item d-flex align-items-center"
                            key={tab.id || idx}
                            style={{
                                position: 'relative',
                                opacity: draggedIdx === idx ? 0.7 : 1,
                                zIndex: draggedIdx === idx ? 2 : 1,
                                boxShadow: dragOverIdx === idx && draggedIdx !== null
                                    ? '0 4px 16px #2196f355'
                                    : draggedIdx === idx
                                        ? '0 2px 8px #1976d233'
                                        : 'none',
                                borderRadius: 8,
                                transition: 'box-shadow 0.2s, opacity 0.2s'
                            }}
                            draggable
                            onDragStart={e => handleDragStart(e, idx)}
                            onDragOver={e => handleDragOver(e, idx)}
                            onDrop={e => {
                                e.preventDefault();
                                if (draggedIdx === null || draggedIdx === idx) {
                                    setDraggedIdx(null);
                                    setDragOverIdx(null);
                                    return;
                                }
                                const newTabs = [...tabs];
                                const [removed] = newTabs.splice(draggedIdx, 1);
                                newTabs.splice(idx, 0, removed);
                                setDraggedIdx(null);
                                setDragOverIdx(null);
                                if (onTabReorder) onTabReorder(newTabs); // <-- this updates parent state
                            }}
                            onDragEnd={handleDragEnd}
                        >
                            <button
                                className={`nav-link${tab.active ? ' active' : ''}`}
                                onClick={() => onTabClick(tab)}
                                type="button"
                                style={{
                                    position: 'relative',
                                    paddingRight: tabs.length > 1 ? 24 : undefined,
                                    cursor: 'grab',
                                    background: draggedIdx === idx ? '#e3f2fd' : dragOverIdx === idx ? '#f1f8e9' : undefined,
                                    transition: 'background 0.2s'
                                }}
                            >
                                {/* Drag handle icon */}
                                <span
                                    style={{
                                        marginRight: 8,
                                        cursor: 'grab',
                                        opacity: 0.7,
                                        userSelect: 'none',
                                        fontSize: 16,
                                        verticalAlign: 'middle'
                                    }}
                                    title="Drag to reorder"
                                >
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                        <circle cx="5" cy="6" r="1.1" fill="#bbb"/>
                                        <circle cx="5" cy="10" r="1.1" fill="#bbb"/>
                                        <circle cx="5" cy="14" r="1.1" fill="#bbb"/>
                                        <circle cx="15" cy="6" r="1.1" fill="#bbb"/>
                                        <circle cx="15" cy="10" r="1.1" fill="#bbb"/>
                                        <circle cx="15" cy="14" r="1.1" fill="#bbb"/>
                                    </svg>
                                </span>
                                {tab.label}
                                {tabs.length > 1 && (
                                    <span
                                        type="button"
                                        className="btn btn-sm btn-link text-danger"
                                        onClick={e => { e.stopPropagation(); onTabClose(tab); }}
                                        title="Close tab"
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            right: 4,
                                            transform: 'translateY(-50%)',
                                            padding: 0,
                                            fontSize: 16,
                                            lineHeight: 1,
                                            background: 'none',
                                            border: 'none'
                                        }}
                                        tabIndex={-1}
                                    >
                                        &times;
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-grow-1 text-end"></div>
        </header>
    );
};

export default Header;