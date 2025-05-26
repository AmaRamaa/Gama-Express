import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
        <div className="container">
            <div className="row">
                <div className="col-md-3 mb-4">
                    <h5 className="text-uppercase mb-3">Quick Links</h5>
                    <ul className="list-unstyled">
                        <li><Link className="text-light text-decoration-none" to="/">Home</Link></li>
                        <li><Link className="text-light text-decoration-none" to="/shop">Shop</Link></li>
                        <li><Link className="text-light text-decoration-none" to="/about">About</Link></li>
                        <li><Link className="text-light text-decoration-none" to="/contact">Contact</Link></li>
                        <li><Link className="text-light text-decoration-none" to="/faq">FAQ</Link></li>
                    </ul>
                </div>
                <div className="col-md-3 mb-4">
                    <h5 className="text-uppercase mb-3">Account</h5>
                    <ul className="list-unstyled">
                        <li><Link className="text-light text-decoration-none" to="/login">Login</Link></li>
                        <li><Link className="text-light text-decoration-none" to="/register">Register</Link></li>
                        <li><Link className="text-light text-decoration-none" to="/account">Dashboard</Link></li>
                    </ul>
                </div>
                <div className="col-md-3 mb-4">
                    <h5 className="text-uppercase mb-3">Blog</h5>
                    <ul className="list-unstyled">
                        <li><Link className="text-light text-decoration-none" to="/blog">Blog Listing</Link></li>
                    </ul>
                </div>
                <div className="col-md-3 mb-4">
                    <h5 className="text-uppercase mb-3">Contact</h5>
                    <p className="mb-1">Email: <a href="mailto:info@example.com" className="text-light text-decoration-none">info@example.com</a></p>
                    <p className="mb-0">Phone: <a href="tel:+1234567890" className="text-light text-decoration-none">+1 234 567 890</a></p>
                </div>
            </div>
            <div className="text-center border-top border-secondary pt-3 mt-3">
                <p className="mb-0">&copy; {new Date().getFullYear()} Gama Express. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;