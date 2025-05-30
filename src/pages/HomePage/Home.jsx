import React, { useEffect, useState } from "react";
import GamaLogo from "../../assets/GamaExpressLogo1.png";
import { supabase } from "../../supaBase/supaBase";

export default function Home() {
    const [newItems, setNewItems] = useState([]);

    useEffect(() => {
        async function fetchItems() {
            const { data, error } = await supabase
                .from("Parts") // replace with your table name
                .select("*"); // adjust columns as needed
            if (!error && data) {
                setNewItems(
                    data.map((item) => ({
                        ...item,
                        img: "https://xcar.gr/shop/image/cache/remote//559044d07b0a9f87fc1a96e93ff5ccde-1100x900.jpg", // placeholder image
                        link: "#",
                    }))
                );
            }
        }
        fetchItems();
    }, []);

    return (
        <div style={{ fontFamily: "Arial, sans-serif", background: "#f8f8f8", minHeight: "100vh" }}>
            {/* New Items */}
            <section style={{ overflowX: "hidden", margin: "32px 0", position: "relative" }}>
                <div
                    style={{
                        width: "100%",
                        position: "relative",
                        height: 180,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: 24,
                            minWidth: 0,
                            position: "absolute",
                            left: 0,
                            top: 0,
                            willChange: "transform",
                            transition: "none",
                            height: "100%",
                        }}
                        ref={el => {
                            // Animation logic
                            if (!el) return;
                            let start = null;
                            let req;
                            let scrollWidth = el.scrollWidth;
                            let containerWidth = el.parentElement.offsetWidth;
                            let speed = 0.5; // px per frame
                            let pos = 0;

                            function step(ts) {
                                if (!start) start = ts;
                                pos -= speed;
                                if (Math.abs(pos) >= scrollWidth) {
                                    pos = 0;
                                }
                                el.style.transform = `translateX(${pos}px)`;
                                req = requestAnimationFrame(step);
                            }

                            // Duplicate items for seamless loop
                            if (el.children.length === newItems.slice(0, 10).length) {
                                for (let i = 0; i < newItems.slice(0, 10).length; i++) {
                                    el.appendChild(el.children[i].cloneNode(true));
                                }
                            }

                            // Start animation
                            req = requestAnimationFrame(step);

                            // Cleanup
                            return () => {
                                cancelAnimationFrame(req);
                            };
                        }}
                    >
                        {newItems.slice(0, 10).map((item, idx) => (
                            <a
                                key={idx}
                                href={item.link}
                                style={{
                                    background: "#fff",
                                    borderRadius: 8,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                    width: 200,
                                    minWidth: 200,
                                    textAlign: "center",
                                    textDecoration: "none",
                                    color: "#222",
                                    padding: 16,
                                    transition: "box-shadow 0.2s"
                                }}
                            >
                                <img src={item.img} alt={item.Model} style={{ width: 120, height: 80, objectFit: "contain", marginBottom: 12 }} />
                                <div style={{ fontWeight: "bold", marginBottom: 4 }}>{item.Car}</div>
                                <div style={{ fontSize: 12, color: "#888" }}>Item: {item.AM}</div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
            {/* About Section */}
            <section style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: 32, textAlign: "center" }}>
                <img src={GamaLogo} alt="Gama Express" style={{ width: 320, maxWidth: "100%", marginBottom: 24 }} />
                <p style={{ color: "#222", fontWeight: "bold", fontSize: 15, marginBottom: 12 }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae magni assumenda quibusdam id voluptates blanditiis expedita dignissimos explicabo consequuntur unde impedit, placeat distinctio iure vel! Temporibus debitis quidem repellat quod.
                </p>
                <p style={{ color: "#222", fontSize: 15, marginBottom: 12 }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta voluptates labore id laudantium vitae, optio cumque ipsa repellendus perferendis quasi quibusdam libero nihil quisquam aperiam nisi ut officia vel reiciendis.
                </p>
                <img src="https://www.prasco.net/images/warehouse.jpg" alt="Warehouse" style={{ width: 320, maxWidth: "100%", marginTop: 24, borderRadius: 8 }} />
            </section>
        </div>
    );
}
