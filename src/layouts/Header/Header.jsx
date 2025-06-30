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

    // Show header if mouse moves to top of screen (when hidden)
    useEffect(() => {
        if (!showHeader) {
            const handleMouseMove = (e) => {
                if (e.clientY <= 8) {
                    setShowHeader(true);
                }
            };
            window.addEventListener("mousemove", handleMouseMove);
            return () => window.removeEventListener("mousemove", handleMouseMove);
        }
    }, [showHeader]);

    // Fullscreen glassmorphic dropdown menu
    return (
        <>
            <div
                className={`header-container${showHeader ? " header-visible" : " header-hidden"}`}
                style={{
                    zIndex: 1500000,
                    position: "sticky",
                    top: 0,
                    width: "100%",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(8px) saturate(160%)",
                    WebkitBackdropFilter: "blur(8px) saturate(160%)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.10)"
                }}
            >
                <header className="bg-white shadow-sm" style={{ height: "100px", display: "flex", alignItems: "center", background: "transparent" }}>
                    <nav className="navbar navbar-expand-lg w-100">
                        <div className="container-fluid" style={{ maxWidth: 1400 }}>
                            <Link className="navbar-brand" to="/">
                                <img
                                    src={GamaLogo}
                                    alt="Logo"
                                    style={{ height: 48, marginLeft: 12, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.10))" }}
                                />
                            </Link>
                            <button
                                className="navbar-toggler"
                                type="button"
                                aria-label="Toggle navigation"
                                onClick={() => setMenuOpen(!menuOpen)}
                                style={{
                                    background: "rgba(255,255,255,0.7)",
                                    border: "none",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                    borderRadius: 12
                                }}
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="d-none d-lg-flex flex-grow-1 align-items-center"></div>
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
                                                background: isActive ? "rgba(229,57,53,0.10)" : "rgba(255,255,255,0.30)",
                                                transition: "background 0.2s, color 0.2s",
                                                backdropFilter: isActive ? "blur(4px)" : undefined,
                                                WebkitBackdropFilter: isActive ? "blur(4px)" : undefined
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
                                    style={{
                                        width: 220,
                                        fontSize: 14,
                                        background: "rgba(255,255,255,0.7)",
                                        border: "1px solid rgba(229,57,53,0.18)",
                                        boxShadow: "0 2px 8px rgba(229,57,53,0.08)",
                                        color: "#222"
                                    }}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button className="btn btn-danger rounded-end-pill ms-n2" type="submit" style={{ width: 44, height: 44, boxShadow: "0 2px 8px rgba(229,57,53,0.18)" }}>
                                    <i className="bi bi-search" style={{ fontSize: 20, color: "#fff" }}></i>
                                </button>
                            </form>
                            <div className="d-flex align-items-center header-customer-profile" style={{ gap: 8 }}>
                                <span className="fs-6 text-dark">{t('header.customerService', 'Customer service')}</span>
                                <span className="fs-4 text-dark ms-2" style={{ cursor: "pointer", filter: "drop-shadow(0 2px 8px rgba(229,57,53,0.10))" }} onClick={handleProfileClick}>
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
                                            background: i18n.language === lang ? "rgba(229,57,53,0.18)" : "rgba(255,255,255,0.30)",
                                            transition: "all 0.2s"
                                        }}
                                        onClick={() => i18n.changeLanguage(lang)}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </nav>
                </header>
            </div>
            {/* Glassmorphic fullscreen dropdown menu for mobile */}
            {menuOpen && (
                <div className="glass-dropdown-menu" onClick={() => setMenuOpen(false)}>
                    <div className="glass-dropdown-content" onClick={e => e.stopPropagation()}>
                        <button
                            className="btn btn-close btn-lg position-absolute"
                            style={{ top: 24, right: 32, zIndex: 2, background: "rgba(255,255,255,0.7)", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
                            aria-label="Close"
                            onClick={() => setMenuOpen(false)}
                        />
                        <ul className="list-unstyled text-center" style={{ marginTop: 80 }}>
                            {navLinks.map(link => (
                                <li key={link.label} style={{ margin: "32px 0" }}>
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) =>
                                            "glass-nav-link" + (isActive ? " glass-nav-link-active" : "")
                                        }
                                        style={{
                                            fontSize: 28,
                                            fontWeight: 600,
                                            color: "#fff",
                                            letterSpacing: 1,
                                            textShadow: "0 2px 12px rgba(0,0,0,0.22)",
                                            padding: "16px 40px",
                                            borderRadius: 20,
                                            background: "rgba(255,255,255,0.10)",
                                            boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.18)",
                                            backdropFilter: "blur(8px) saturate(180%)",
                                            WebkitBackdropFilter: "blur(8px) saturate(180%)",
                                            border: isActive ? "2px solid #e53935" : "2px solid rgba(255,255,255,0.18)",
                                            transition: "background 0.2s, color 0.2s, border 0.2s"
                                        }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {t(link.label)}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        <form className="d-flex justify-content-center mb-4" role="search" onSubmit={e => { handleSearch(e); setMenuOpen(false); }}>
                            <input
                                className="form-control rounded-pill border-0"
                                type="text"
                                placeholder={t('header.searchPlaceholder', 'Product name or item number...')}
                                style={{
                                    width: 260,
                                    fontSize: 16,
                                    background: "rgba(255,255,255,0.30)",
                                    color: "#fff",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                    border: "1px solid rgba(255,255,255,0.25)",
                                    marginRight: 8,
                                    backdropFilter: "blur(4px)",
                                    WebkitBackdropFilter: "blur(4px)",
                                    outline: "none"
                                }}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <button className="btn btn-danger rounded-pill" type="submit" style={{ width: 48, height: 48, boxShadow: "0 2px 8px rgba(229,57,53,0.18)" }}>
                                <i className="bi bi-search" style={{ fontSize: 22, color: "#fff" }}></i>
                            </button>
                        </form>
                        <div className="d-flex justify-content-center align-items-center mb-4" style={{ gap: 16 }}>
                            <span className="fs-5 text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>{t('header.customerService', 'Customer service')}</span>
                            <span className="fs-2 text-white" style={{ cursor: "pointer", filter: "drop-shadow(0 2px 8px rgba(229,57,53,0.18))" }} onClick={() => { handleProfileClick(); setMenuOpen(false); }}>
                                <i className="bi bi-person-circle"></i>
                            </span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center" style={{ gap: 16 }}>
                            {['en', 'sq'].map(lang => (
                                <button
                                    key={lang}
                                    className={`btn btn-sm px-4 ${i18n.language === lang ? "btn-danger text-white fw-bold" : "btn-outline-light text-white"}`}
                                    style={{
                                        borderRadius: 20,
                                        borderWidth: i18n.language === lang ? 2 : 1,
                                        borderColor: i18n.language === lang ? "#e53935" : "rgba(255,255,255,0.5)",
                                        boxShadow: i18n.language === lang ? "0 2px 8px rgba(229,57,53,0.12)" : undefined,
                                        background: i18n.language === lang ? "rgba(229,57,53,0.18)" : "rgba(255,255,255,0.10)",
                                        transition: "all 0.2s"
                                    }}
                                    onClick={() => { i18n.changeLanguage(lang); setMenuOpen(false); }}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <style>
                {`
                .active-nav {
                    color: #e53935 !important;
                    background: rgba(229,57,53,0.10) !important;
                    box-shadow: 0 2px 8px rgba(229,57,53,0.08);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }
                .nav-hover:hover {
                    background: rgba(255,255,255,0.40);
                    color: #e53935 !important;
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }
                .glass-dropdown-menu {
                    position: fixed;
                    inset: 0;
                    z-index: 2000000;
                    background: linear-gradient(120deg, rgba(30, 30, 40, 0.30) 0%, rgba(229,57,53,0.10) 100%);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    animation: glassFadeIn 0.25s;
                }
                .glass-dropdown-content {
                    margin-top: 40px;
                    background: rgba(255,255,255,0.18);
                    border-radius: 36px;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 0.5px 0 rgba(229,57,53,0.08);
                    border: 1.5px solid rgba(255,255,255,0.28);
                    padding: 56px 32px 36px 32px;
                    min-width: 340px;
                    max-width: 95vw;
                    width: 420px;
                    position: relative;
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                }
                .glass-nav-link {
                    color: #fff;
                    background: transparent;
                    text-decoration: none;
                    display: inline-block;
                    box-shadow: 0 2px 8px rgba(229,57,53,0.08);
                }
                .glass-nav-link-active,
                .glass-nav-link:hover {
                    background: rgba(229,57,53,0.22);
                    color: #fff !important;
                    text-shadow: 0 2px 12px rgba(229,57,53,0.18);
                    border: 2px solid #e53935 !important;
                    box-shadow: 0 4px 24px 0 rgba(229,57,53,0.10);
                }
                @media (min-width: 992px) {
                    .glass-dropdown-menu {
                        display: none !important;
                    }
                }
                @keyframes glassFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                `}
            </style>
        </>
    );
};

export default Header;
