import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = ({ open, onClose }) => (
    <div
        className={`offcanvas offcanvas-start${open ? " show" : ""}`}
        tabIndex="-1"
        style={{ visibility: open ? "visible" : "hidden", width: '220px' }}
    >
        <div className="offcanvas-header">
            <h5 className="offcanvas-title">Menu</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="offcanvas-body p-0">
            <nav className="p-3">
                <ul className="nav flex-column">
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/shop"
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            Shop
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/cart"
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            Cart
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/checkout"
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            Checkout
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/account"
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            Account
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            Login
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/register"
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            Register
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            About
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            Contact
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/blog"
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            Blog
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/faq"
                            className={({ isActive }) =>
                                'nav-link text-dark' + (isActive ? ' active fw-bold text-primary' : '')
                            }
                            onClick={onClose}
                        >
                            FAQ
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
);

export default Sidebar;