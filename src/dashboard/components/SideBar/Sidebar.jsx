import React, { useState } from "react";
import { FaBars, FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const menuItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { icon: <FaUser />, label: "Profile", path: "/profile" },
    { icon: <FaCog />, label: "Settings", path: "/settings" },
    { icon: <FaSignOutAlt />, label: "Logout", path: "/logout" },
];

const Sidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <nav className={`sidebar bg-dark text-white position-fixed h-100 ${open ? "show" : ""}`} style={{ width: open ? 220 : 60, transition: "width 0.3s" }}>
                <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                    <span className="fs-4 fw-bold">{open ? "Dashboard" : <FaHome />}</span>
                    <button
                        className="btn btn-outline-light btn-sm ms-2"
                        onClick={() => setOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <FaBars />
                    </button>
                </div>
                <ul className="nav flex-column mt-3">
                {menuItems.map((item) => (
                    <li key={item.label} className="nav-item">
                        <a href={item.path} className="nav-link text-white d-flex align-items-center">
                            {item.icon}
                            {open && <span className="ms-2">{item.label}</span>}
                        </a>
                    </li>
                ))}
            </ul>
            {open && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
                    style={{ zIndex: 1040 }}
                    onClick={() => setOpen(false)}
                    aria-label="Close sidebar overlay"
                />
            )}
            </nav>
        </>
    );
};

export default Sidebar;