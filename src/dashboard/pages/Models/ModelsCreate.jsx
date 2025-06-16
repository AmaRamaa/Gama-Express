import React, { useEffect, useState } from "react";
import { supabase } from "../../../supaBase/supaBase";

const IMAGE_BASE = "/arc/assets/img/";

export default function ModelsCreate() {
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);
    const [form, setForm] = useState({
        model: "",
        search_code: "",
        start_year: "",
        end_year: "",
        variant: "",
        code: "",
        image_path: "",
        imageFile: null,
    });
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchManufacturers = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("Manufacturers")
                .select("id, manufacturer, image_path");
            if (!error) setManufacturers(data || []);
            setLoading(false);
        };
        fetchManufacturers();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccess(false);
    };

    const handleFileChange = (e) => {
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        let imagePath = form.image_path;

        // Upload image if present
        if (form.imageFile) {
            const file = form.imageFile;
            const fileName = `${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from("model-images")
                .upload(fileName, file);

            if (uploadError) {
                setError("Failed to upload image.");
                setUploading(false);
                return;
            }
            imagePath = `model-images/${fileName}`;
        }

        // Validate required fields
        if (
            !form.model ||
            !form.start_year ||
            !form.code ||
            !imagePath
        ) {
            setError("All fields are required.");
            setUploading(false);
            return;
        }

        const { error: insertError } = await supabase
            .from("Models")
            .insert([
                {
                    manufacturer: selectedManufacturer.manufacturer,
                    model: form.model,
                    search_code: form.search_code || null,
                    start_year: Number(form.start_year),
                    end_year: Number(form.end_year),
                    variant: form.variant,
                    code: form.code,
                    image_path: imagePath,
                },
            ]);

        if (insertError) {
            setError("Failed to create model.");
        } else {
            setSuccess(true);
            setForm({
                model: "",
                search_code: "",
                start_year: "",
                end_year: "",
                variant: "",
                code: "",
                image_path: "",
                imageFile: null,
            });
        }
        setUploading(false);
    };

    if (loading) return <div>Loading manufacturers...</div>;

    return (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
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
                    margin: "0 auto"
                }}
            >
                <h2 style={{
                    fontSize: 22,
                    letterSpacing: 1,
                    color: "#2a3342",
                    fontWeight: 700,
                    marginBottom: "2rem",
                    textAlign: "center",
                }}>
                    {selectedManufacturer
                        ? `Create Model for ${selectedManufacturer.manufacturer}`
                        : "Create Model"}
                </h2>
                {!selectedManufacturer ? (
                    <div style={{ marginBottom: 22 }}>
                        <label style={{
                            fontWeight: 600,
                            marginBottom: 6,
                            display: "block",
                            color: "#334155",
                        }}>
                            Manufacturer *
                        </label>
                        <select
                            name="manufacturer"
                            value={form.manufacturer || ""}
                            onChange={(e) => {
                                const selected = manufacturers.find(m => m.id === Number(e.target.value));
                                setSelectedManufacturer(selected || null);
                                setForm({ ...form, manufacturer: e.target.value });
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
                        >
                            <option value="">Select manufacturer</option>
                            {manufacturers.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.manufacturer}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: 22 }}>
                            <label style={{
                                fontWeight: 600,
                                marginBottom: 6,
                                display: "block",
                                color: "#334155",
                            }}>
                                Model Name *
                            </label>
                            <input
                                type="text"
                                name="model"
                                value={form.model}
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
                            <label style={{
                                fontWeight: 600,
                                marginBottom: 6,
                                display: "block",
                                color: "#334155",
                            }}>
                                Search Code (JSON)
                            </label>
                            <input
                                type="text"
                                name="search_code"
                                value={form.search_code}
                                onChange={handleChange}
                                placeholder='e.g. {"key":"value"}'
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
                            <label style={{
                                fontWeight: 600,
                                marginBottom: 6,
                                display: "block",
                                color: "#334155",
                            }}>
                                Start Year *
                            </label>
                            <input
                                type="number"
                                name="start_year"
                                value={form.start_year}
                                onChange={handleChange}
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
                        </div>
                        <div style={{ marginBottom: 22 }}>
                            <label style={{
                                fontWeight: 600,
                                marginBottom: 6,
                                display: "block",
                                color: "#334155",
                            }}>
                                End Year *
                            </label>
                            <input
                                type="number"
                                name="end_year"
                                value={form.end_year}
                                onChange={handleChange}

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
                            <label style={{
                                fontWeight: 600,
                                marginBottom: 6,
                                display: "block",
                                color: "#334155",
                            }}>
                                Variant
                            </label>
                            <input
                                type="text"
                                name="variant"
                                value={form.variant}
                                onChange={handleChange}

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
                            <label style={{
                                fontWeight: 600,
                                marginBottom: 6,
                                display: "block",
                                color: "#334155",
                            }}>
                                Code
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}

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
                            <label style={{
                                fontWeight: 600,
                                marginBottom: 6,
                                display: "block",
                                color: "#334155",
                            }}>
                                Image *
                            </label>
                            <input
                                type="file"
                                name="imageFile"
                                accept="image/*"
                                onChange={handleFileChange}
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
                        {error && (
                            <div style={{
                                background: "#fee2e2",
                                color: "#b91c1c",
                                borderRadius: 8,
                                padding: "0.5rem 1rem",
                                marginBottom: 16,
                                fontWeight: 500,
                                fontSize: 15,
                            }}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div style={{
                                background: "#d1fae5",
                                color: "#047857",
                                borderRadius: 8,
                                padding: "0.5rem 1rem",
                                marginBottom: 16,
                                fontWeight: 500,
                                fontSize: 15,
                            }}>
                                Model created successfully!
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={uploading}
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
                                cursor: uploading ? "not-allowed" : "pointer",
                            }}
                        >
                            {uploading ? "Creating..." : "Create Model"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedManufacturer(null)}
                            style={{
                                width: "100%",
                                marginTop: 12,
                                background: "#f3f4f6",
                                color: "#222",
                                border: "none",
                                borderRadius: 8,
                                padding: "0.75rem",
                                fontWeight: 700,
                                fontSize: 16,
                                cursor: "pointer",
                            }}
                        >
                            Back to Manufacturers
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
