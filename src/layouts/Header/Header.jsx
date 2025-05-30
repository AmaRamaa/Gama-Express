import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import GamaLogo from "../../assets/Gamalogo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

const navLinks = [
    { label: "HOME", to: "/" },
    { label: "THE COMPANY", to: "/company" },
    { label: "CATALOG", to: "/catalog" },
    { label: "CONTACTS", to: "/contacts" },
    { label: "NEWS", to: "/news" },
    { label: "LEGAL DISCLAIMER", to: "/legal" }
];

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="header-container"
            style={{zIndex: 1500000, position: "sticky", top: 0, width: "100%", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}>  
            {/* Top Bar
            <div className="bg-danger text-white text-center fw-semibold py-2" style={{ fontSize: 16 }}>
              
            </div> */}

            {/* Main Header */}
            <header className="bg-white shadow-sm" style={{ height: "100px", display: "flex", alignItems: "center" }}>
                <nav className="navbar navbar-expand-lg w-100">
                    <div className="container-fluid" style={{ maxWidth: 1400 }}>
                        {/* Logo */}
                        <Link className="navbar-brand" to="/">
                            <img
                                src={GamaLogo}
                                alt="Logo"
                                style={{ height: 48, marginLeft: 12 }}
                            />
                        </Link>
                        {/* Hamburger */}
                        <button
                            className="navbar-toggler"
                            type="button"
                            aria-label="Toggle navigation"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}>
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center" style={{ gap: 24 }}>
                                {navLinks.map(link => (
                                    <li className="nav-item position-relative" key={link.label}>
                                        <NavLink
                                            className={({ isActive }) =>
                                                "nav-link" + (isActive ? " fw active" : "")
                                            }
                                            to={link.to}
                                            style={({ isActive }) => ({
                                                fontSize: 18,
                                                paddingBottom: isActive ? 6 : undefined,
                                                position: "relative"
                                            })}
                                        >
                                            {link.label}
                                            {/* Active underline */}
                                            <span
                                                style={{
                                                    display: "block",
                                                    position: "absolute",
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    height: 3,
                                                    background: "#e53935",
                                                    borderRadius: 2,
                                                    opacity: location.pathname === link.to ? 1 : 0,
                                                    transition: "opacity 0.2s"
                                                }}
                                            />
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                            <form className="d-flex align-items-center me-3" role="search">
                                <input
                                    className="form-control rounded-start-pill border-danger"
                                    type="text"
                                    placeholder="Product name or item number..."
                                    style={{ width: 220, fontSize: 14 }}
                                />
                                <button className="btn btn-danger rounded-end-pill ms-n2" type="submit" style={{ width: 44, height: 44 }}>
                                    <i className="bi bi-search" style={{ fontSize: 20, color: "#fff" }}></i>
                                </button>
                            </form>
                            {/* User/Login */}
                            <div className="d-flex align-items-center" style={{ gap: 8 }}>
                                <span className="fs-6 text-dark">Customer service</span>
                                <span className="fs-6 text-dark">Login</span>
                                <span className="fs-4 text-dark ms-2" style={{ cursor: "pointer" }}>
                                    <i className="bi bi-person-circle"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Header;
