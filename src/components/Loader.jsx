import React from "react";

const loaderStyles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 24,
        animation: "spin 2s linear infinite",
    },
    text: {
        fontSize: 22,
        color: "#1e293b",
        fontWeight: 600,
        letterSpacing: 1,
        marginTop: 8,
        fontFamily: "Segoe UI, Arial, sans-serif",
    },
    "@keyframes spin": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
    },
};

// Inline keyframes for React (since we can't use external CSS)
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
}
`;
document.head.appendChild(styleSheet);

import GamaExpressSmallLogo from "../assets/GamaExpressSmallLogo.png";

const Loader = () => (
    <div style={loaderStyles.container}>
        <img
            src={GamaExpressSmallLogo}
            alt="Gama Express Logo"
            style={loaderStyles.logo}
        />
        <div style={loaderStyles.text}>Loading Gama Express...</div>
    </div>
);

export default Loader;