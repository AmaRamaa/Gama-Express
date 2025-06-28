import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';

const Sidebar = () => {
    const { t } = useTranslation();
    return (
        <aside style={{
            width: '240px',
            height: '100vh',
            background: '#222',
            color: '#fff',
            padding: '1.5rem',
            boxSizing: 'border-box'
        }}>
            <h2>{t('sidebar.title', 'Sidebar')}</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>{t('sidebar.dashboard', 'Dashboard')}</li>
                <li>{t('sidebar.profile', 'Profile')}</li>
                <li>{t('sidebar.settings', 'Settings')}</li>
            </ul>
        </aside>
    );
};

export default Sidebar;