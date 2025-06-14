import React from 'react';

const Header = ({ title, user, actions }) => {
    return (
        <header className="d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom shadow-sm">
            <div className="flex-grow-1">
                <h1 className="m-0 fs-3 fw-semibold">{title || 'Dashboard'}</h1>
            </div>
            <div className="flex-grow-1 text-center">
                {actions && actions.map((action, idx) => (
                    <button
                        key={idx}
                        className="btn btn-primary mx-2"
                        onClick={action.onClick}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
            <div className="flex-grow-1 text-end">
                {user && (
                    <div className="d-inline-flex align-items-center">
                        <span className="me-3 fw-medium">{user.name}</span>
                        <img
                            src={user.avatar}
                            alt="avatar"
                            className="rounded-circle border border-primary"
                            style={{ width: 36, height: 36, objectFit: 'cover' }}
                        />
                    </div>
                )}
            </div>
        </header>
    );
};


export default Header;