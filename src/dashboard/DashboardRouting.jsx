import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/SideBar/Sidebar.jsx';
import Header from './components/Header/Header';
import './Style.css';
import { FaHome, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa';

const DashboardHome = React.lazy(() => import('./pages/Home/DashboardHome'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const TABS = [
    { id: 'home', icon: <FaHome />, label: 'Home', path: '/', undeletable: true },
    { id: 'manufacture-list', icon: <FaCog />, label: 'Manufacture List', path: '/manufacture' },
    { id: 'manufacture-create', icon: <FaCog />, label: 'Manufacture Create', path: '/manufacture/create' },
    { id: 'models-list', icon: <FaCog />, label: 'Models List', path: '/models' },
    { id: 'models-create', icon: <FaCog />, label: 'Models Create', path: '/models/create' },
    { id: 'parts-list', icon: <FaCog />, label: 'Parts List', path: '/parts' },
    { id: 'parts-create', icon: <FaCog />, label: 'Parts Create', path: '/parts/create' },
    { id: 'profiles-list', icon: <FaUser />, label: 'Profiles List', path: '/profiles' },
    { id: 'profiles-create', icon: <FaUser />, label: 'Profiles Create', path: '/profiles/create' },
    { id: 'profile-view', icon: <FaUser />, label: 'View Profile', path: '/profile/view' },
    { id: 'profile-edit', icon: <FaUser />, label: 'Edit Profile', path: '/profile/edit' },
    { id: 'settings-general', icon: <FaCog />, label: 'General', path: '/settings/general' },
    { id: 'settings-security', icon: <FaCog />, label: 'Security', path: '/settings/security' },
    { id: 'logout', icon: <FaSignOutAlt />, label: 'Logout', path: '/logout' }
];

const TAB_COMPONENTS = {
    home: (props) => <DashboardHome {...props} TABS />,
    'manufacture-list': NotFound,
    'manufacture-create': NotFound,
    'models-list': NotFound,
    'models-create': NotFound,
    'parts-list': NotFound,
    'parts-create': NotFound,
    'profiles-list': NotFound,
    'profiles-create': NotFound,
    'profile-view': NotFound,
    'profile-edit': NotFound,
    'settings-general': NotFound,
    'settings-security': NotFound,
};
// Example sidebar menu structure for Sidebar component


const layoutStyle = {
    display: 'flex',
    height: '100vh',
};

const sidebarStyle = {
    minWidth: '40px',
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

const DashboardRouting = () => {
  // Load tabs from localStorage or default to Home tab
  const getInitialTabs = () => {
  const saved = localStorage.getItem('dashboardTabs');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Merge with TABS to restore full tab info
      return parsed
        .map(savedTab => {
          const realTab = TABS.find(t => t.id === savedTab.id);
          return realTab ? { ...realTab, active: savedTab.active } : null;
        })
        .filter(Boolean);
    } catch {
      return [{ ...TABS[0], active: true }];
    }
  }
  return [{ ...TABS[0], active: true }];
};

  const [tabs, setTabs] = useState(getInitialTabs);
  const [activeTabId, setActiveTabId] = useState(
    getInitialTabs().find(t => t.active)?.id || 'home'
  );
  const navigate = useNavigate();

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboardTabs', JSON.stringify(tabs));
  }, [tabs]);

  // Open or switch tab
const openTab = (tabId) => {
  if (tabId === 'logout') {
    localStorage.removeItem('dashboardTabs');
    setTabs([{ ...TABS[0], active: true }]);
    setActiveTabId('home');
    navigate('/');
    return;
  }
  setTabs(prev => {
    if (prev.some(t => t.id === tabId)) {
      return prev.map(t => ({ ...t, active: t.id === tabId }));
    }
    const newTab = TABS.find(t => t.id === tabId);
    if (!newTab) return prev;
    return prev.map(t => ({ ...t, active: false })).concat({ ...newTab, active: true });
  });
  setActiveTabId(tabId);
};

  // Close tab
  const closeTab = (tab) => {
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== tab.id);
      if (tab.active && filtered.length) {
        filtered[filtered.length - 1].active = true;
        setActiveTabId(filtered[filtered.length - 1].id);
      }
      return filtered;
    });
  };

  const handleTabReorder = (newTabs) => {
    setTabs(newTabs);
    localStorage.setItem('dashboardTabs', JSON.stringify(newTabs));
};

  // Sidebar click handler
  const handleSidebarClick = (tabId) => {
    openTab(tabId);
  };

  // Find the active tab and its component
  const activeTab = tabs.find(t => t.active);
  const ActiveComponent = activeTab ? TAB_COMPONENTS[activeTab.id] : null;

  return (
    <div style={layoutStyle}>
      <div style={sidebarStyle}>
        <Sidebar onMenuClick={handleSidebarClick} />
      </div>
      <div style={mainStyle}>
        <Header
          tabs={tabs}
          onTabClick={tab => openTab(tab.id)}
          onTabClose={closeTab}
          onTabReorder={handleTabReorder}
          actions={[{ label: 'Settings', onClick: () => openTab('settings') }]}
        />
        <div style={contentStyle}>
          <Suspense fallback={<div>Loading...</div>}>
            {ActiveComponent && (activeTab.id === 'home'
        ? <DashboardHome onQuickAction={openTab} />
        : <ActiveComponent />)}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DashboardRouting;