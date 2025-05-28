import React from 'react';

const Sidebar = () => {
    return (
        <aside style={{
            width: '240px',
            height: '100vh',
            background: '#222',
            color: '#fff',
            padding: '1.5rem',
            boxSizing: 'border-box'
        }}>
            <h2>Sidebar</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>Dashboard</li>
                <li>Profile</li>
                <li>Settings</li>
            </ul>
        </aside>
    );
};

export default Sidebar;