import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Example dashboard pages

const DashboardHome = React.lazy(() => import('./pages/DashboardHome'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
import Sidebar from './components/SideBar/Sidebar.jsx'; 
import Header from './components/Header/Header';
import './Style.css'; // Assuming you have some styles for the dashboard

const layoutStyle = {
    display: 'flex',
    height: '100vh',
};

const sidebarStyle = {
    width: '240px',
    minWidth: '200px',
    background: '#23272f', // Changed to a dark color for sidebar
    color: '#fff', // Ensure text/icons are visible
    boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
    zIndex: 2,
};

const mainStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
};

const headerStyle = {
    height: '64px',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
};

const contentStyle = {
    flex: 1,
    padding: '24px',
    background: '#fafbfc',
    overflow: 'auto',
};

const DashboardRouting = () => (
    <React.Suspense fallback={<div>Loading...</div>}>
        <div style={layoutStyle}>
            <div style={sidebarStyle}>
                <Sidebar />
            </div>
            <div style={mainStyle}>
                <div >
                    <Header
                        title="Dashboard"
                        user={{ name: 'John Doe', avatar: 'https://via.placeholder.com/40' }}
                        actions={[{ label: 'Settings', onClick: () => alert('Settings clicked') }]}
                    />
                </div>
                <div style={contentStyle}>
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </div>
    </React.Suspense>
);

export default DashboardRouting;