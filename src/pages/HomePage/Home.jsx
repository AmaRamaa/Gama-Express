import React, { useEffect, useState, useRef } from "react";
import GamaLogo from "../../assets/GamaExpressLogo1.png";
import { supabase } from "../../supaBase/supaBase";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


// Styles
const styles = {
    page: {
        fontFamily: "Inter, Arial, sans-serif",
        background: "linear-gradient(135deg, #f8f8f8 60%, #e0e7ff 100%)",
        minHeight: "100vh",
        padding: 0,
        margin: 0,
    },
    heroSection: {
        maxWidth: 900,
        margin: "48px auto 32px",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(80,80,180,0.07)",
        padding: 32,
        textAlign: "center",
    },
    logo: {
        width: 240,
        maxWidth: "90%",
        marginBottom: 24,
        filter: "drop-shadow(0 2px 8px #e0e7ff)",
    },
    heroText: {
        color: "#222",
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 10,
    },
    heroSubText: {
        color: "#444",
        fontSize: 15,
        marginBottom: 10,
    },
    warehouseImg: {
        width: 320,
        maxWidth: "100%",
        marginTop: 24,
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(80,80,180,0.10)",
    },
    sectionTitle: {
        fontSize: 22,
        color: "#6366f1",
        fontWeight: 700,
        letterSpacing: 1,
        textAlign: "center",
        margin: "24px auto 16px",
        textShadow: "0 2px 8px #e0e7ff",
    },
    marqueeSection: {
        overflowX: "hidden",
        margin: "0 auto 48px",
        background: "linear-gradient(90deg, #fff 80%, #e0e7ff 100%)",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(80,80,180,0.07)",
        padding: "16px 0",
        position: "relative",
        maxWidth: 1200,
    },
    marqueeContainer: {
        width: "100%",
        position: "relative",
        height: 220,
        margin: "0 auto",
    },
    marqueeTrack: {
        display: "flex",
        gap: 24,
        position: "absolute",
        left: 0,
        top: 0,
        willChange: "transform",
        height: "100%",
        alignItems: "center",
    },
    card: {
        background: "linear-gradient(135deg, #fff 70%, #e0e7ff 100%)",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(80,80,180,0.10)",
        width: 220,
        minWidth: 180,
        maxWidth: 240,
        textAlign: "center",
        color: "#222",
        padding: 20,
        transition: "box-shadow 0.2s, transform 0.2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        textDecoration: "none",
    },
    cardHover: {
        boxShadow: "0 6px 24px rgba(80,80,180,0.18)",
        transform: "translateY(-4px) scale(1.03)",
    },
    cardImg: {
        width: 120,
        height: 80,
        objectFit: "contain",
        marginBottom: 12,
        borderRadius: 8,
        background: "#f3f4f6",
    },
    fadeLeft: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 60,
        background: "linear-gradient(90deg, #f8f8f8 80%, transparent)",
        pointerEvents: "none",
    },
    fadeRight: {
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 60,
        background: "linear-gradient(270deg, #f8f8f8 80%, transparent)",
        pointerEvents: "none",
    },
};

// Hover Hook
function useHover() {
    const [hovered, setHovered] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const onEnter = () => setHovered(true);
        const onLeave = () => setHovered(false);
        node.addEventListener("mouseenter", onEnter);
        node.addEventListener("mouseleave", onLeave);
        return () => {
            node.removeEventListener("mouseenter", onEnter);
            node.removeEventListener("mouseleave", onLeave);
        };
    }, []);
    return [ref, hovered];
}

// Card Component
function MarqueeCard({ item }) {
    const [cardRef, hovered] = useHover();
    return (
        <a
            href={item.link}
            ref={cardRef}
            style={{
                ...styles.card,
                ...(hovered ? styles.cardHover : {}),
            }}
        >
            <img src={item.img} alt={item.Model} style={styles.cardImg} />
            <div style={{ fontWeight: "bold", fontSize: 16 }}>{item.Car}</div>
            <div style={{ fontSize: 13, color: "#6366f1", fontWeight: 500 }}>Item Code: {item.AM}</div>
        </a>
    );
}

// Home Page Component
export default function Home() {
    const [newItems, setNewItems] = useState([]);
    const marqueeRef = useRef();

    useEffect(() => {
        async function fetchItems() {
            const { data, error } = await supabase.from("Parts").select("*");
            if (!error && data) {
                setNewItems(
                    data.map((item) => ({
                        ...item,
                        img: "https://xcar.gr/shop/image/cache/remote//559044d07b0a9f87fc1a96e93ff5ccde-1100x900.jpg",
                        link: "#",
                    }))
                );
            }
        }
        fetchItems();
    }, []);

    useEffect(() => {
        const el = marqueeRef.current;
        if (!el || newItems.length === 0) return;
        let req;
        let pos = 0;
        const speed = 0.7;
        const trackWidth = el.scrollWidth / 2;

        function step() {
            pos -= speed;
            if (Math.abs(pos) >= trackWidth) pos = 0;
            el.style.transform = `translateX(${pos}px)`;
            req = requestAnimationFrame(step);
        }

        if (el.children.length === newItems.slice(0, 10).length) {
            for (let i = 0; i < newItems.slice(0, 10).length; i++) {
                el.appendChild(el.children[i].cloneNode(true));
            }
        }

        req = requestAnimationFrame(step);
        return () => cancelAnimationFrame(req);
    }, [newItems]);

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.heroSection}>
                <img src={GamaLogo} alt="Gama Express Logo" style={styles.logo} />
                <p style={styles.heroText}>
                    Welcome to Gama Express – your one-stop destination for premium auto parts!
                </p>
                <p style={styles.heroSubText}>
                    Browse through our vast inventory, discover unbeatable deals, and enjoy fast service backed by a passionate team ready to help you.
                </p>
                <img
                    src="https://www.prasco.net/images/warehouse.jpg"
                    alt="Gama Warehouse"
                    style={styles.warehouseImg}
                />
            </section>

            {/* Product Marquee */}
            <h2 style={styles.sectionTitle}>Latest Products</h2>
            <section style={styles.marqueeSection}>
                <div style={styles.marqueeContainer}>
                    <div ref={marqueeRef} style={styles.marqueeTrack}>
                        {newItems.slice(0, 10).map((item, idx) => (
                            <MarqueeCard key={idx} item={item} />
                        ))}
                    </div>
                    <div style={styles.fadeLeft} />
                    <div style={styles.fadeRight} />
                </div>
            </section>
            
        </div>
    );
}
