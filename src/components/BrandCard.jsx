import React from "react";
import { motion } from "framer-motion";

const BrandCard = ({
    brand,
    selected,
    onClick,
    headerRed = "#e53935",
    headerRedLight = "#ffeaea",
    showImage = true,
}) => (
    <motion.div
        initial={{ scale: 1, boxShadow: "none" }}
        animate={{
            scale: selected ? 1.03 : 1,
            boxShadow: selected
                ? "0 4px 16px rgba(229,57,53,0.15)"
                : "none",
            background: selected ? headerRedLight : "#fff",
            color: selected ? headerRed : "#333",
            fontWeight: selected ? 700 : 400,
        }}
        whileHover={{
            scale: 1.04,
            boxShadow: "0 6px 24px rgba(229,57,53,0.18)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
            padding: "10px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            border: `1.5px solid ${headerRed}`,
            borderRadius: 12,
            marginBottom: 8,
            minWidth: 180,
            minHeight: 48,
            userSelect: "none",
            outline: selected ? `2px solid ${headerRed}` : "none",
        }}
        onClick={onClick}
    >
        {showImage && brand.image_path && (
            <motion.img
                src={brand.image_path}
                alt={brand.name || brand.manufacturer}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    width: 30,
                    height: 30,
                    objectFit: "contain",
                    marginRight: 10,
                    verticalAlign: "middle",
                }}
            />
        )}
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
        >
            {brand.name || brand.manufacturer}
        </motion.span>
    </motion.div>
);

export default BrandCard;