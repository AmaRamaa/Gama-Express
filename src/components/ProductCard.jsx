import React from "react";
import { motion } from "framer-motion";
import GamaLogo from "/assets/GamaExpressSmallLogo.png";

const ProductCard = ({
  product,
  onClick,
  style = {},
  className = "",
  showBranding = true,
}) => {
  if (!product) return null;
  const {
    img,
    Description,
    Model,
    Car,
    AM,
    OEM,
    start_year,
    end_year,
    Variant,
    Category,
    Subcategory,
    Code,
  } = product;

  return (
    <motion.div
      className={`product-card ${className}`}
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 14,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        background: "#fff",
        padding: 20,
        width: 260,
        minHeight: 340,
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      whileHover={{ scale: 1.04, boxShadow: "0 6px 24px rgba(0,0,0,0.13)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
    >
      <div style={{ position: "relative", width: "100%", height: 140, marginBottom: 16 }}>
        <img
          src={img || "/assets/CARPLACEHOLDER.png"}
          alt={Description || Model || Car}
          style={{
            width: "100%",
            height: 140,
            objectFit: "contain",
            borderRadius: 10,
            background: "#fafafa",
            border: "1px solid #eee",
            display: "block",
          }}
          draggable={false}
        />
        {showBranding && (
          <motion.img
            src={GamaLogo}
            alt="Gama Express Branding"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 60,
              height: 60,
              opacity: 0.18,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              userSelect: "none",
            }}
            draggable={false}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.18 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        )}
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#e53935", marginBottom: 2 }}>
          {Car || Model}
        </div>
        <div style={{ color: "#444", fontSize: 15, marginBottom: 2, minHeight: 36 }}>
          {Description}
        </div>
        <div style={{ color: "#888", fontSize: 13, marginBottom: 2 }}>
          <span>Item: <span style={{ color: "#222" }}>{AM}</span></span>
        </div>
        {OEM && (
          <div style={{ color: "#888", fontSize: 13, marginBottom: 2 }}>
            OEM: <span style={{ color: "#222" }}>{OEM}</span>
          </div>
        )}
        {Code && (
          <div style={{ color: "#888", fontSize: 13, marginBottom: 2 }}>
            Code: <span style={{ color: "#222" }}>{Code}</span>
          </div>
        )}
        {Variant && (
          <div style={{ color: "#888", fontSize: 13, marginBottom: 2 }}>
            Variant: <span style={{ color: "#222" }}>{Variant}</span>
          </div>
        )}
        {(start_year || end_year) && (
          <div style={{ color: "#888", fontSize: 13, marginBottom: 2 }}>
            Years: <span style={{ color: "#222" }}>{start_year}{end_year ? ` - ${end_year}` : ""}</span>
          </div>
        )}
        {Category && (
          <div style={{ color: "#888", fontSize: 13, marginBottom: 2 }}>
            Category: <span style={{ color: "#222" }}>{Category}</span>
          </div>
        )}
        {Subcategory && (
          <div style={{ color: "#888", fontSize: 13, marginBottom: 2 }}>
            Subcategory: <span style={{ color: "#222" }}>{Subcategory}</span>
          </div>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.07, background: "#e53935", color: "#fff" }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%",
          padding: "10px 0",
          borderRadius: 8,
          border: "none",
          background: "#1976d2",
          color: "#fff",
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer",
          marginTop: 8,
          boxShadow: "0 1px 4px 0 rgba(60,80,120,0.08)",
          transition: "background 0.2s, color 0.2s",
        }}
        onClick={onClick}
      >
        View Details
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;
