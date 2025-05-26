import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "../Sidebar/Sidebar";

const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            <header className="bg-light border-bottom py-2">
                <div className="container d-flex align-items-center justify-content-between">
                    <div>
                        <button
                            className="btn btn-outline-secondary me-2 d-md-none"
                            onClick={toggleSidebar}
                            aria-label="Open sidebar"
                        >
                            ☰
                        </button>
                        <Link to="/" className="navbar-brand fw-bold">
                            GAMA <span className="text-primary">EXPRESS</span>
                        </Link>
                    </div>
                    <nav className="d-none d-md-block">
                        <Link to="/shop" className="nav-link d-inline px-2">Shop</Link>
                        <Link to="/about" className="nav-link d-inline px-2">About</Link>
                        <Link to="/blog" className="nav-link d-inline px-2">Blog</Link>
                        <Link to="/contact" className="nav-link d-inline px-2">Contact</Link>
                    </nav>
                    <div>
                        <Link to="/cart" className="btn btn-outline-secondary me-2" title="View Cart">
                            <span role="img" aria-label="cart">🛒</span>
                        </Link>
                        <Link to="/account" className="btn btn-outline-secondary" title="Account">
                            <span role="img" aria-label="account">👤</span>
                        </Link>
                    </div>
                </div>
            </header>
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={closeSidebar} />
            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="offcanvas-backdrop fade show"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.3)",
                        zIndex: 1040
                    }}
                    onClick={closeSidebar}
                />
            )}
        </>
    );
};

export default Header;
