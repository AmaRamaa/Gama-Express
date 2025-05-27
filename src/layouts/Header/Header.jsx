import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaPhoneAlt, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import GamaLogo from "../../assets/GamaExpressLogo1.png"; // Adjust the import path as necessary

const Header = () => {
    return (
        <header className="bg-white border-bottom py-3" style={{ minHeight: 80 }}>
            <div className="container-fluid d-flex align-items-center justify-content-between">
                {/* Logo */}
                <div className="d-flex align-items-center" style={{ minWidth: 320 }}>
                    <img
                        src={GamaLogo}
                        alt="Gama Express Auto Pjes"
                        style={{ height: 60, marginRight: 24 , border: "none"}}
                    />
                </div>

                {/* Search Bar */}
                <div className="flex-grow-1 mx-4" style={{ maxWidth: 700 }}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control rounded-start-pill"
                            placeholder="Search for products, categories..."
                            style={{ height: 48, fontSize: 16, borderRight: "none" }}
                        />
                        <span className="input-group-text bg-white border-start-0 rounded-end-pill" style={{ cursor: "pointer" }}>
                            <FaSearch size={22} />
                        </span>
                    </div>
                </div>

                {/* Store Info & Actions */}
                <div className="d-flex align-items-center gap-4">
                    {/* Location */}
                    <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-circle border" style={{ minWidth: 90 }}>
                        <FaMapMarkerAlt color="#e53935" size={22} />
                        <div className="d-none d-lg-block">
                            <div className="small text-muted">Our store</div>
                            <div className="fw-bold" style={{ fontSize: 14 }}>Location</div>
                        </div>
                    </div>
                    {/* Phone */}
                    <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-circle border" style={{ minWidth: 120 }}>
                        <FaPhoneAlt color="#e53935" size={20} />
                        <div className="d-none d-lg-block">
                            <div className="small text-muted">Talk to a Specialist</div>
                            <div className="fw-bold" style={{ fontSize: 14 }}>+383 48 770 400</div>
                        </div>
                    </div>
                    {/* Icons */}
                    <Link to="/wishlist" className="mx-2 position-relative" title="Wishlist">
                        <FaHeart size={24} />
                    </Link>
                    <Link to="/cart" className="mx-2 position-relative" title="Cart">
                        <FaShoppingCart size={24} />
                        <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style={{ fontSize: 12 }}
                        >
                            0
                        </span>
                    </Link>
                    <Link to="/account" className="mx-2" title="Account">
                        <FaUser size={24} />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
