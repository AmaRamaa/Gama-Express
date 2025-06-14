import React from 'react';

const NotFound = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center'
    }}>
        <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
        <h2 style={{ margin: '1rem 0' }}>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
    </div>
);

export default NotFound;