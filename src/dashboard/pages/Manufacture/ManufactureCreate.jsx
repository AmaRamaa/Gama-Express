import React, { useState } from "react";
import { supabase } from "../../../supaBase/supaBase";

const IMAGE_BASE = "/arc/assets/img/";

export default function ManufactureCreate() {
    const [form, setForm] = useState({
        manufacturer: "",
        image_path: "",
        search_code: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (form.imageFile) {
            const file = form.imageFile;
            const fileName = `${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from("manufacturer-images")
                .upload(fileName, file);

            if (uploadError) {
                setError("Failed to upload image.");
                setLoading(false);
                return;
            }
            form.image_path = `manufacturer-images/${fileName}`;
        }
        setError("");
        setSuccess(false);

        if (!form.manufacturer || !form.image_path) {
            setError("Manufacturer name and image path are required.");
            setLoading(false);
            return;
        }

        const { error: insertError } = await supabase
            .from("Manufacturers")
            .insert([
                {
                    manufacturer: form.manufacturer,
                    image_path: form.image_path,
                    search_code: form.search_code || null,
                },
            ]);

        if (insertError) {
            setError("Failed to create manufacturer.");
        } else {
            setSuccess(true);
            setForm({ manufacturer: "", image_path: "", search_code: "" });
        }
        setLoading(false);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
                padding: "2rem",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 4px 24px 0 rgba(60,80,120,0.10)",
                    border: "1px solid #e3e8f0",
                    padding: "2.5rem 2rem 2rem 2rem",
                    minWidth: 340,
                    maxWidth: 420,
                    width: "100%",
                }}
            >
                <h2
                    style={{
                        fontSize: 22,
                        letterSpacing: 1,
                        color: "#2a3342",
                        fontWeight: 700,
                        marginBottom: "2rem",
                        textAlign: "center",
                    }}
                >
                    Create Manufacturer
                </h2>
                <div style={{ marginBottom: 22 }}>
                    <label
                        style={{
                            fontWeight: 600,
                            marginBottom: 6,
                            display: "block",
                            color: "#334155",
                        }}
                    >
                        Name *
                    </label>
                    <input
                        type="text"
                        name="manufacturer"
                        value={form.manufacturer}
                        onChange={handleChange}
                        required
                        autoFocus
                        style={{
                            borderRadius: 8,
                            border: "1px solid #cbd5e1",
                            fontSize: 15,
                            padding: "0.5rem 1rem",
                            width: "100%",
                            background: "#f8fafc",
                        }}
                    />
                </div>
                <div style={{ marginBottom: 22 }}>
                    <label
                        style={{
                            fontWeight: 600,
                            marginBottom: 6,
                            display: "block",
                            color: "#334155",
                        }}
                    >
                        Image *
                    </label>
                    <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setForm((prev) => ({
                                ...prev,
                                imageFile: file,
                                image_path: file
                                    ? (file.name.startsWith("/") ? file.name : "/arc/assets/img/" + file.name)
                                    : "",
                            }));
                            setError("");
                            setSuccess(false);
                        }}
                        required
                        style={{
                            borderRadius: 8,
                            border: "1px solid #cbd5e1",
                            fontSize: 15,
                            padding: "0.5rem 1rem",
                            width: "100%",
                            background: "#f8fafc",
                        }}
                    />
                    {form.imageFile && (
                        <div style={{ marginTop: 10 }}>
                            <img
                                src={form.imageFile ? URL.createObjectURL(form.imageFile) : ""}
                                alt="Preview"
                                style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: "contain",
                                    background: "#f8f8f8",
                                    borderRadius: 8,
                                    border: "1px solid #e3e8f0",
                                    boxShadow: "0 1px 4px 0 rgba(60,80,120,0.08)",
                                }}
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        </div>
                    )}
                </div>
                <div style={{ marginBottom: 22 }}>
                    <label
                        style={{
                            fontWeight: 600,
                            marginBottom: 6,
                            display: "block",
                            color: "#334155",
                        }}
                    >
                        Search Code
                    </label>
                    <input
                        type="text"
                        name="search_code"
                        value={form.search_code}
                        onChange={handleChange}
                        placeholder="Optional"
                        style={{
                            borderRadius: 8,
                            border: "1px solid #cbd5e1",
                            fontSize: 15,
                            padding: "0.5rem 1rem",
                            width: "100%",
                            background: "#f8fafc",
                        }}
                    />
                </div>
                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#b91c1c",
                            borderRadius: 8,
                            padding: "0.5rem 1rem",
                            marginBottom: 16,
                            fontWeight: 500,
                            fontSize: 15,
                        }}
                    >
                        {error}
                    </div>
                )}
                {success && (
                    <div
                        style={{
                            background: "#d1fae5",
                            color: "#047857",
                            borderRadius: 8,
                            padding: "0.5rem 1rem",
                            marginBottom: 16,
                            fontWeight: 500,
                            fontSize: 15,
                        }}
                    >
                        Manufacturer created successfully!
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.75rem",
                        fontWeight: 700,
                        fontSize: 16,
                        boxShadow: "0 1px 4px 0 rgba(60,80,120,0.08)",
                        transition: "background 0.2s",
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? "Creating..." : "Create Manufacturer"}
                </button>
            </form>
        </div>
    );
}