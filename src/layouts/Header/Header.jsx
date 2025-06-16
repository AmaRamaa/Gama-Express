import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import GamaLogo from "../../assets/Gamalogo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import { supabase } from "../../supaBase/supaBase";

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
    const [search, setSearch] = useState("");
    const [showHeader, setShowHeader] = useState(true); // NEW
    const lastScrollY = useRef(window.scrollY); // NEW
    const location = useLocation();
    const navigate = useNavigate();

    // Scroll handler for sticky header animation
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 50) {
                setShowHeader(true);
            } else if (currentScrollY > lastScrollY.current) {
                setShowHeader(false); // scrolling down
            } else {
                setShowHeader(true); // scrolling up
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/catalog?search=${encodeURIComponent(search.trim())}`);
        }
    };

    const handleProfileClick = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            navigate("/profile");
        } else {
            navigate("/login");
        }
    };

    return (
        <div
            className={`header-container${showHeader ? " header-visible" : " header-hidden"}`}
            style={{
                zIndex: 1500000,
                position: "sticky",
                top: 0,
                width: "100%",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"
            }}
        >
            <header className="bg-white shadow-sm" style={{ height: "100px", display: "flex", alignItems: "center" }}>
                <nav className="navbar navbar-expand-lg w-100">
                    <div className="container-fluid" style={{ maxWidth: 1400 }}>
                        <Link className="navbar-brand" to="/">
                            <img
                                src={GamaLogo}
                                alt="Logo"
                                style={{ height: 48, marginLeft: 12 }}
                            />
                        </Link>
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
                            <form className="d-flex align-items-center me-3" role="search" onSubmit={handleSearch}>
                                <input
                                    className="form-control rounded-start-pill border-danger"
                                    type="text"
                                    placeholder="Product name or item number..."
                                    style={{ width: 220, fontSize: 14 }}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button className="btn btn-danger rounded-end-pill ms-n2" type="submit" style={{ width: 44, height: 44 }}>
                                    <i className="bi bi-search" style={{ fontSize: 20, color: "#fff" }}></i>
                                </button>
                            </form>
                            <div className="d-flex align-items-center" style={{ gap: 8 }}>
                                <span className="fs-6 text-dark">Customer service</span>
                                <span className="fs-4 text-dark ms-2" style={{ cursor: "pointer" }} onClick={handleProfileClick}>
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
