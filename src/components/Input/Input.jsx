import React from "react";
import { motion } from "framer-motion";

const Input = React.forwardRef(
  (
    {
      label = "",
      value = "",
      onChange,
      placeholder = "",
      type = "text",
      icon = null,
      error = "",
      style = {},
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`dynamic-input-wrapper ${className}`} style={{ marginBottom: 18, ...style }}>
        {label && (
          <label style={{ fontWeight: 600, marginBottom: 6, display: "block", color: error ? "#e53935" : "#334155" }}>
            {label}
          </label>
        )}
        <motion.div
          initial={{ boxShadow: "none" }}
          whileFocus={{ boxShadow: "0 0 0 2px #e53935" }}
          whileHover={{ boxShadow: "0 2px 8px rgba(229,57,53,0.10)" }}
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: 8,
            border: error ? "1.5px solid #e53935" : "1.5px solid #cbd5e1",
            background: error ? "#fff5f5" : "#f8fafc",
            padding: "0.5rem 1rem",
            transition: "border 0.2s, box-shadow 0.2s",
          }}
        >
          {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 16,
              flex: 1,
              color: "#222",
              padding: 0,
            }}
            {...props}
          />
        </motion.div>
        {error && (
          <div style={{ color: "#e53935", fontSize: 13, marginTop: 4 }}>{error}</div>
        )}
      </div>
    );
  }
);

export default Input;
