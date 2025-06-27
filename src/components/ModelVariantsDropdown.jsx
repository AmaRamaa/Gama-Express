import React from "react";

const ModelVariantsDropdown = ({
    variants = [],
    selectedVariant,
    onChange,
    label = "Select Model Variant",
    disabled = false,
}) => {
    return (
        <div className="model-variants-dropdown">
            <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                {label}
                <select
                    value={selectedVariant || ""}
                    onChange={e => onChange && onChange(e.target.value)}
                    disabled={disabled}
                    style={{
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        fontSize: 15,
                        padding: "0.5rem 1rem",
                        width: "100%",
                        background: disabled ? "#f3f4f6" : "#fff",
                        marginTop: 6,
                    }}
                >
                    <option value="" disabled>
                        -- Select --
                    </option>
                    {variants.map(variant => (
                        <option key={variant.id || variant} value={variant.id || variant}>
                            {variant.name || variant}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};

export default ModelVariantsDropdown;