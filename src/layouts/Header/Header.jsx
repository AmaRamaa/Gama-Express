import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import GamaLogo from "../../assets/Gamalogo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import { supabase } from "../../supaBase/supaBase";
import { useTranslation } from 'react-i18next';
import '../../i18n';

const navLinks = [
    { label: "header.home", to: "/" },
    { label: "header.company", to: "/company" },
    { label: "header.catalog", to: "/catalog" },
    { label: "header.contacts", to: "/contacts" },
    { label: "header.news", to: "/news" },
    { label: "header.legal", to: "/legal" }
];

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [showHeader, setShowHeader] = useState(true); // NEW
    const lastScrollY = useRef(window.scrollY); // NEW
    const location = useLocation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

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

    const { t } = useTranslation();

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
                                                "nav-link px-3 py-2 rounded" +
                                                (isActive
                                                    ? " fw-bold active-nav"
                                                    : " text-secondary nav-hover")
                                            }
                                            to={link.to}
                                            style={({ isActive }) => ({
                                                fontSize: 18,
                                                paddingBottom: isActive ? 6 : undefined,
                                                position: "relative",
                                                color: isActive ? "#e53935" : "#333",
                                                background: isActive ? "rgba(229,57,53,0.08)" : "transparent",
                                                transition: "background 0.2s, color 0.2s"
                                            })}
                                        >
                                            {t(link.label)}
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
                            <form className="d-flex align-items-center me-3 header-search-form" role="search" onSubmit={handleSearch}>
                                <input
                                    className="form-control rounded-start-pill border-danger"
                                    type="text"
                                    placeholder={t('header.searchPlaceholder', 'Product name or item number...')}
                                    style={{ width: 220, fontSize: 14 }}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button className="btn btn-danger rounded-end-pill ms-n2" type="submit" style={{ width: 44, height: 44 }}>
                                    <i className="bi bi-search" style={{ fontSize: 20, color: "#fff" }}></i>
                                </button>
                            </form>
                            <div className="d-flex align-items-center header-customer-profile" style={{ gap: 8 }}>
                                <span className="fs-6 text-dark">{t('header.customerService', 'Customer service')}</span>
                                <span className="fs-4 text-dark ms-2" style={{ cursor: "pointer" }} onClick={handleProfileClick}>
                                    <i className="bi bi-person-circle"></i>
                                </span>
                            </div>
                            {/* Language Switcher */}
                            <div className="d-flex align-items-center me-3 header-lang-switcher" style={{ gap: 8 , paddingLeft: 12 }}>
                                {['en', 'sq'].map(lang => (
                                    <button
                                        key={lang}
                                        className={`btn btn-sm px-3 ${i18n.language === lang ? "btn-danger text-white fw-bold" : "btn-outline-secondary"}`}
                                        style={{
                                            borderRadius: 20,
                                            borderWidth: i18n.language === lang ? 2 : 1,
                                            borderColor: i18n.language === lang ? "#e53935" : undefined,
                                            boxShadow: i18n.language === lang ? "0 2px 8px rgba(229,57,53,0.12)" : undefined,
                                            transition: "all 0.2s"
                                        }}
                                        onClick={() => i18n.changeLanguage(lang)}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <style>
                {`
                .active-nav {
                    color: #e53935 !important;
                    background: rgba(229,57,53,0.08) !important;
                    box-shadow: 0 2px 8px rgba(229,57,53,0.08);
                }
                .nav-hover:hover {
                    background: #f8f9fa;
                    color: #e53935 !important;
                }
                /* --- MOBILE RESPONSIVE HEADER --- */
                @media (max-width: 991.98px) {
                    .header-container header {
                        height: 70px !important;
                        min-height: 56px;
                        padding: 0 8px;
                    }
                    .navbar-brand img {
                        height: 36px !important;
                        margin-left: 0 !important;
                    }
                    .navbar-toggler {
                        margin-right: 8px;
                        font-size: 1.5rem;
                    }
                    .navbar-collapse {
                        background: #fff;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                        border-radius: 12px;
                        margin-top: 8px;
                        padding: 12px 8px 8px 8px;
                    }
                    .navbar-nav {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 8px !important;
                    }
                    .nav-link {
                        font-size: 16px !important;
                        width: 100%;
                        text-align: left;
                        padding: 8px 0 !important;
                    }
                    .header-search-form {
                        width: 100%;
                        margin: 8px 0 0 0 !important;
                        flex-direction: row !important;
                        justify-content: flex-start;
                    }
                    .header-search-form input {
                        width: 100% !important;
                        min-width: 0 !important;
                        font-size: 14px !important;
                    }
                    .header-search-form button {
                        width: 40px !important;
                        height: 40px !important;
                        margin-left: -8px !important;
                    }
                    .header-customer-profile {
                        margin: 8px 0 0 0 !important;
                        gap: 6px !important;
                        font-size: 15px !important;
                    }
                    .header-lang-switcher {
                        margin: 8px 0 0 0 !important;
                        gap: 6px !important;
                        padding-left: 0 !important;
                    }
                }
                @media (max-width: 575.98px) {
                    .header-container header {
                        height: 56px !important;
                        min-height: 48px;
                        padding: 0 2px;
                    }
                    .navbar-brand img {
                        height: 28px !important;
                    }
                    .navbar-toggler {
                        font-size: 1.2rem;
                    }
                    .navbar-collapse {
                        border-radius: 8px;
                        padding: 8px 2px 4px 2px;
                    }
                    .nav-link {
                        font-size: 15px !important;
                        padding: 6px 0 !important;
                    }
                    .header-search-form input {
                        font-size: 13px !important;
                    }
                    .header-customer-profile, .header-lang-switcher {
                        font-size: 13px !important;
                        gap: 4px !important;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default Header;
