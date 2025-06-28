import { Link } from "react-router-dom";
import GamaLogo from "../../assets/GamaExpressLogo1.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const quickLinks = [
    { label: "Cookie Policy", to: "/cookie-policy" },
    { label: "Privacy", to: "/privacy" },
    { label: "Legal disclaimer", to: "/legal" },
    { label: "Codice Etico", to: "/codice-etico" },
    { label: "Informativa generale", to: "/informativa-generale" },
    { label: "Elimina i cookie salvati", to: "/elimina-cookie" }
];

const seats = [
    "Seat 1: Front Left",
    "Seat 2: Front Right",
    "Seat 3: Middle Left",
    "Seat 4: Middle Right",
    "Seat 5: Back Left",
    "Seat 6: Back Right"
];

const mainTextStyle = { color: "#555", fontStyle: "italic" };
const headingStyle = { color: "#555", fontWeight: 700, letterSpacing: 1, fontStyle: "italic" };
const linkStyle = { color: "#d32f2f", textDecoration: "none", fontWeight: 500, fontSize: 16, fontStyle: "italic" };

const Footer = () => (
    <footer style={{ background: "#fff", color: "#555", borderTop: "6px solid #d32f2f", marginTop: 40 }}>
        <div className="container" style={{ maxWidth: 1400, padding: "2.5rem 1rem" }}>
            <div className="row">
                {/* Quick Links */}
                <div className="col-md-4 mb-4">
                    <h5 style={headingStyle}>QUICK LINKS</h5>
                    <ul className="list-unstyled mt-3">
                        {quickLinks.map(link => (
                            <li key={link.label}>
                                <Link to={link.to} style={linkStyle}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Seats */}
                <div className="col-md-4 mb-4">
                    <h5 style={headingStyle}>SEATS</h5>
                    <ul className="list-unstyled mt-3">
                        {seats.map(seat => (
                            <li key={seat} style={{ ...mainTextStyle, fontSize: 16, fontWeight: 500 }}>{seat}</li>
                        ))}
                    </ul>
                </div>
                {/* Company Info */}
                <div className="col-md-4 mb-4">
                    <h5 style={headingStyle}>GAMA EXPRESS SH.P.K</h5>
                    <div style={{ color: "#d32f2f", fontSize: 16, margin: "16px 0 8px", fontStyle: "italic" }}>
                        Prroi i Mjellmët , 10000 Pristina, Kosovo 
                    </div>
                    <div style={{ ...mainTextStyle, fontSize: 16 }}>
                        Phone: <a href="tel:+38344100531" style={{ color: "#d32f2f", textDecoration: "none", fontStyle: "italic" }}>+38344100531</a>
                    </div>
                    <div style={{ ...mainTextStyle, fontSize: 16 }}>
                        Email: <a href="mailto:gamaexpress18@gmail.com" style={{ color: "#d32f2f", textDecoration: "none", fontStyle: "italic" }}>gamaexpress18@gmail.com</a>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top" style={{ borderColor: "#d32f2f" }}>
                <div>
                    <img src={GamaLogo} alt="Logo" style={{ height: 36, marginRight: 12 }} />
                    <span style={{ ...mainTextStyle, fontSize: 15 }}>
                        &copy; {new Date().getFullYear()} Gama Express. All rights reserved.
                    </span>
                </div>
                <div>
                    <a href="mailto:info@gamaexpress.com" className="me-3" style={{ color: "#d32f2f", fontSize: 20 }}>
                        <i className="bi bi-envelope-fill"></i>
                    </a>
                    <a href="tel:+1234567890" style={{ color: "#d32f2f", fontSize: 20 }}>
                        <i className="bi bi-telephone-fill"></i>
                    </a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;