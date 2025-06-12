import React, { useEffect, useState, useRef } from "react";
import GamaLogo from "../../assets/GamaExpressLogo1.png";
import { supabase } from "../../supaBase/supaBase";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


// Responsive styles
const styles = {
    page: {
        fontFamily: "Inter, Arial, sans-serif",
        background: "linear-gradient(135deg, #f8f8f8 60%, #e0e7ff 100%)",
        minHeight: "100vh",
        padding: 0,
        margin: 0,
    },
    marqueeSection: {
        overflowX: "hidden",
        margin: "32px 0",
        position: "relative",
        background: "linear-gradient(90deg, #fff 80%, #e0e7ff 100%)",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(80,80,180,0.07)",
        padding: "16px 0",
    },
    marqueeContainer: {
        width: "100%",
        position: "relative",
        height: 220,
        maxWidth: 1200,
        margin: "0 auto",
    },
    marqueeTrack: {
        display: "flex",
        gap: 24,
        minWidth: 0,
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
        textDecoration: "none",
        color: "#222",
        padding: 20,
        transition: "box-shadow 0.2s, transform 0.2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
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
    aboutSection: {
        maxWidth: 900,
        margin: "32px auto",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(80,80,180,0.07)",
        padding: 32,
        textAlign: "center",
    },
    aboutLogo: {
        width: 260,
        maxWidth: "90%",
        marginBottom: 24,
        filter: "drop-shadow(0 2px 8px #e0e7ff)",
    },
    aboutImg: {
        width: 320,
        maxWidth: "100%",
        marginTop: 24,
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(80,80,180,0.10)",
    },
    "@media (max-width: 700px)": {
        marqueeContainer: { height: 170 },
        card: { width: 150, minWidth: 120, padding: 10 },
        aboutSection: { padding: 16 },
        aboutLogo: { width: 180 },
        aboutImg: { width: 180 },
    },
};

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

function MarqueeCard({ item, responsiveStyle, styles }) {
    const [cardRef, hovered] = useHover();
    return (
        <a
            href={item.link}
            ref={cardRef}
            style={{
                ...responsiveStyle("card"),
                ...(hovered ? styles.cardHover : {}),
            }}
        >
            <img src={item.img} alt={item.Model} style={styles.cardImg} />
            <div style={{ fontWeight: "bold", marginBottom: 4, fontSize: 16 }}>{item.Car}</div>
            <div style={{ fontSize: 13, color: "#6366f1", fontWeight: 500 }}>Item: {item.AM}</div>
        </a>
    );
}

export default function Home() {
    const [newItems, setNewItems] = useState([]);
    const marqueeRef = useRef();

    useEffect(() => {
        async function fetchItems() {
            const { data, error } = await supabase
                .from("Parts")
                .select("*");
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

    // Marquee animation
    useEffect(() => {
        const el = marqueeRef.current;
        if (!el || newItems.length === 0) return;
        let req;
        let pos = 0;
        let speed = 0.7; // px per frame
        let trackWidth = el.scrollWidth / 2;

        function step() {
            pos -= speed;
            if (Math.abs(pos) >= trackWidth) pos = 0;
            el.style.transform = `translateX(${pos}px)`;
            req = requestAnimationFrame(step);
        }

        // Duplicate for seamless loop
        if (el.children.length === newItems.slice(0, 10).length) {
            for (let i = 0; i < newItems.slice(0, 10).length; i++) {
                el.appendChild(el.children[i].cloneNode(true));
            }
        }
        req = requestAnimationFrame(step);
        return () => cancelAnimationFrame(req);
    }, [newItems]);

    // Responsive style helper
    function responsiveStyle(key) {
        // You can enhance this for more complex responsive logic
        return styles[key];
    }

    return (
        <div style={styles.page}>
            {/* Marquee Section */}
            <section style={styles.marqueeSection}>
                <div style={styles.marqueeContainer}>
                    <div ref={marqueeRef} style={styles.marqueeTrack}>
                        {newItems.slice(0, 10).map((item, idx) => (
                            <MarqueeCard
                                key={idx}
                                item={item}
                                responsiveStyle={responsiveStyle}
                                styles={styles}
                            />
                        ))}
                    </div>
                </div>
                <div style={{
                    position: "absolute",
                    left: 0, top: 0, bottom: 0, width: 60,
                    background: "linear-gradient(90deg, #f8f8f8 80%, transparent)",
                    pointerEvents: "none"
                }} />
                <div style={{
                    position: "absolute",
                    right: 0, top: 0, bottom: 0, width: 60,
                    background: "linear-gradient(270deg, #f8f8f8 80%, transparent)",
                    pointerEvents: "none"
                }} />
                <h2 style={{
                    position: "absolute",
                    left: 32, top: 8,
                    fontSize: 22,
                    color: "#6366f1",
                    fontWeight: 700,
                    letterSpacing: 1,
                    textShadow: "0 2px 8px #e0e7ff",
                    zIndex: 2,
                }}>Νέα Ανταλλακτικά</h2>
            </section>
            {/* About Section */}
            <section style={styles.aboutSection}>
                <img src={GamaLogo} alt="Gama Express" style={styles.aboutLogo} />
                <p style={{ color: "#222", fontWeight: "bold", fontSize: 17, marginBottom: 12 }}>
                    Καλώς ήρθατε στη Gama Express! Εδώ θα βρείτε μοναδικά ανταλλακτικά αυτοκινήτων με άμεση διαθεσιμότητα και εξυπηρέτηση.
                </p>
                <p style={{ color: "#222", fontSize: 15, marginBottom: 12 }}>
                    Ανακαλύψτε τη μεγάλη μας γκάμα και επωφεληθείτε από τις προσφορές μας. Η ομάδα μας είναι πάντα δίπλα σας για να σας βοηθήσει!
                </p>
                <img src="https://www.prasco.net/images/warehouse.jpg" alt="Warehouse" style={styles.aboutImg} />
            </section>
        </div>
    );
}
