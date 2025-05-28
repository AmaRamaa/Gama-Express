import React from "react";
import GamaLogo from "../../assets/GamaExpressLogo1.png";

const Header = () => {
    return (
        <header style={{
            background: "#fff",
            boxShadow: "0 2px 6px #0001",
            padding: "0",
            display: "flex",
            justifyContent: "center"
        }}>
            <div style={{
                width: "100%",
                maxWidth: 1400,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 90
            }}>
                {/* Hamburger + Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    {/* Hamburger */}
                    <button style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        marginRight: 12,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: 40
                    }}>
                        <span style={{
                            width: 32,
                            height: 3,
                            background: "#444",
                            margin: "4px 0",
                            borderRadius: 2,
                            display: "block"
                        }} />
                        <span style={{
                            width: 32,
                            height: 3,
                            background: "#444",
                            margin: "4px 0",
                            borderRadius: 2,
                            display: "block"
                        }} />
                        <span style={{
                            width: 32,
                            height: 3,
                            background: "#444",
                            margin: "4px 0",
                            borderRadius: 2,
                            display: "block"
                        }} />
                    </button>
                    {/* Logo */}
                    <img
                        src={GamaLogo}
                        alt="Logo"
                        style={{ height: 48 }}
                    />
                </div>

                {/* Search */}
                <div style={{
                    flex: 1,
                    margin: "0 32px",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <input
                        type="text"
                        placeholder="Search for products, categories..."
                        style={{
                            width: 420,
                            padding: "10px 16px",
                            border: "2px solid #e53935",
                            borderRadius: 8,
                            outline: "none",
                            fontSize: 14,
                            background: "#fafafa"
                        }}
                    />
                </div>

                {/* Store & Contact */}
                <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                    {/* Store Location */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                            display: "inline-block",
                            width: 20,
                            height: 20,
                            border: "2px solid #e53935",
                            borderRadius: "50%",
                            marginRight: 4
                        }} />
                        <div>
                            <div style={{ fontSize: 13, color: "#444" }}>Our store</div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: "#222" }}>Location</div>
                        </div>
                    </div>
                    {/* Contact Sales */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                            display: "inline-block",
                            width: 20,
                            height: 20,
                            border: "2px solid #e53935",
                            borderRadius: "50%",
                            marginRight: 4
                        }} />
                        <div>
                            <div style={{ fontSize: 13, color: "#444" }}>Contact Sales</div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#222" }}>+383 44 100 531</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;