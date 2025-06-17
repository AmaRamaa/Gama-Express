import React, { useState } from "react";
import { supabase } from "../../../supaBase/supaBase";

// CSV columns for template and parsing
const CSV_FORMAT = [
    "Description",
    "Model",
    "Car",
    "OEM",
    "AM",
    "img",
    "start_year",
    "end_year",
    "Variant",
    "Category",
    "Subcategory",
    "Code"
];

// Simple CSV parser (assumes no commas in values)
function parseCSV(text) {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i]);
        return obj;
    });
}

const IMAGE_BASE = "/arc/assets/img/";

export default function PartsCreate() {
    const [form, setForm] = useState({
        Description: "",
        Model: "",
        Car: "",
        OEM: "",
        AM: "",
        img: "",
        start_year: "",
        end_year: "",
        Variant: "",
        Category: "",
        Subcategory: "",
        Code: "",
        imageFile: null,
    });
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [csvMode, setCsvMode] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [csvResult, setCsvResult] = useState(null);

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
            img: file ? "" : prev.img,
        }));
        setError("");
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        let imgPath = form.img;

        // Upload image if present
        if (form.imageFile) {
            const file = form.imageFile;
            const fileName = `${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from("part-images")
                .upload(fileName, file);

            if (uploadError) {
                setError("Failed to upload image.");
                setUploading(false);
                return;
            }
            imgPath = `part-images/${fileName}`;
        }

        // Validate required fields (add more as needed)
        if (!form.Description || !form.Model || !imgPath) {
            setError("Description, Model, and Image are required.");
            setUploading(false);
            return;
        }

        const payload = {
            Description: form.Description,
            Model: form.Model,
            Car: form.Car,
            OEM: form.OEM,
            AM: form.AM,
            img: imgPath,
            start_year: form.start_year === "" ? null : Number(form.start_year),
            end_year: form.end_year === "" ? null : Number(form.end_year),
            Variant: form.Variant,
            Category: form.Category,
            Subcategory: form.Subcategory,
            Code: form.Code,
        };

        const { error: insertError } = await supabase
            .from("Parts")
            .insert([payload]);

        if (insertError) {
            setError("Failed to create part.");
        } else {
            setSuccess(true);
            setForm({
                Description: "",
                Model: "",
                Car: "",
                OEM: "",
                AM: "",
                img: "",
                start_year: "",
                end_year: "",
                Variant: "",
                Category: "",
                Subcategory: "",
                Code: "",
                imageFile: null,
            });
        }
        setUploading(false);
    };

    // CSV logic
    const handleCsvFile = (e) => {
        setCsvFile(e.target.files[0]);
        setCsvResult(null);
        setError("");
        setSuccess(false);
    };

    const handleCsvUpload = async () => {
        if (!csvFile) {
            setError("Please select a CSV file.");
            return;
        }
        setUploading(true);
        setError("");
        setSuccess(false);

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const text = evt.target.result;
                const rows = parseCSV(text);
                // Validate headers
                const headers = Object.keys(rows[0] || {});
                if (CSV_FORMAT.some(h => !headers.includes(h))) {
                    setError("CSV format is invalid. Please use the provided template.");
                    setUploading(false);
                    return;
                }
                // Prepare data for insert
                const insertRows = rows.map(row => ({
                    Description: row.Description,
                    Model: row.Model,
                    Car: row.Car,
                    OEM: row.OEM,
                    AM: row.AM,
                    img: row.img,
                    start_year: row.start_year === "" ? null : Number(row.start_year),
                    end_year: row.end_year === "" ? null : Number(row.end_year),
                    Variant: row.Variant,
                    Category: row.Category,
                    Subcategory: row.Subcategory,
                    Code: row.Code,
                }));
                const { error: insertError } = await supabase
                    .from("Parts")
                    .insert(insertRows);

                if (insertError) {
                    setError("Failed to insert some or all parts.");
                    setCsvResult(null);
                } else {
                    setSuccess(true);
                    setCsvResult({ count: insertRows.length });
                }
            } catch (err) {
                setError("Failed to parse CSV.");
                setCsvResult(null);
            }
            setUploading(false);
        };
        reader.readAsText(csvFile);
    };

    const downloadCsvTemplate = () => {
        const header = CSV_FORMAT.join(",");
        const example = "Spoiler,Model X,Car X,OEM123,AM456,/arc/assets/img/spoiler.png,2010,2015,Base,Body,Exterior,SPX-001";
        const csv = `${header}\n${example}`;
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "parts_template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ maxWidth: 520, margin: "0 auto", padding: 24 }}>
            <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600, marginRight: 12 }}>
                    <input
                        type="checkbox"
                        checked={csvMode}
                        onChange={e => {
                            setCsvMode(e.target.checked);
                            setSuccess(false);
                            setError("");
                            setCsvFile(null);
                            setCsvResult(null);
                        }}
                        style={{ marginRight: 6 }}
                    />
                    Upload CSV/Excel
                </label>
            </div>
            {/* Single Part Form */}
            {!csvMode && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: "#fff",
                        borderRadius: 18,
                        boxShadow: "0 4px 24px 0 rgba(60,80,120,0.10)",
                        border: "1px solid #e3e8f0",
                        padding: "2.5rem 2rem 2rem 2rem",
                        minWidth: 340,
                        maxWidth: 480,
                        width: "100%",
                        margin: "0 auto"
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
                        Create Part
                    </h2>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Description *
                        </label>
                        <input
                            type="text"
                            name="Description"
                            value={form.Description}
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
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Model *
                        </label>
                        <input
                            type="text"
                            name="Model"
                            value={form.Model}
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
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Car
                        </label>
                        <input
                            type="text"
                            name="Car"
                            value={form.Car}
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
                    <div style={{ marginBottom: 18, display: "flex", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                                OEM
                            </label>
                            <input
                                type="text"
                                name="OEM"
                                value={form.OEM}
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
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                                AM
                            </label>
                            <input
                                type="text"
                                name="AM"
                                value={form.AM}
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
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Image *
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required={!form.img}
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
                            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                                Selected: {form.imageFile.name}
                            </div>
                        )}
                    </div>
                    <div style={{ marginBottom: 18, display: "flex", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                                Start Year
                            </label>
                            <input
                                type="number"
                                name="start_year"
                                value={form.start_year}
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
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                                End Year
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
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Variant
                        </label>
                        <input
                            type="text"
                            name="Variant"
                            value={form.Variant}
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
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Category
                        </label>
                        <input
                            type="text"
                            name="Category"
                            value={form.Category}
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
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Subcategory
                        </label>
                        <input
                            type="text"
                            name="Subcategory"
                            value={form.Subcategory}
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
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Code
                        </label>
                        <input
                            type="text"
                            name="Code"
                            value={form.Code}
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
                    {error && (
                        <div
                            style={{
                                background: "#fee2e2",
                                color: "#b91c1c",
                                borderRadius: 8,
                                padding: "0.5rem 1rem",
                                marginTop: 8,
                                fontWeight: 500,
                                fontSize: 15,
                                textAlign: "center",
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
                                marginTop: 8,
                                fontWeight: 500,
                                fontSize: 15,
                                textAlign: "center",
                            }}
                        >
                            Part created successfully!
                        </div>
                    )}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={uploading}
                        style={{
                            width: "100%",
                            background: uploading ? "#a5b4fc" : "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "0.75rem",
                            fontWeight: 700,
                            fontSize: 16,
                            boxShadow: "0 1px 4px 0 rgba(60,80,120,0.08)",
                            transition: "background 0.2s",
                            cursor: uploading ? "not-allowed" : "pointer",
                            marginTop: 12,
                        }}
                    >
                        {uploading ? "Saving..." : "Create Part"}
                    </button>
                </form>
            )}
            {/* CSV Upload Form */}
            {csvMode && (
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 18,
                        boxShadow: "0 4px 24px 0 rgba(60,80,120,0.10)",
                        border: "1px solid #e3e8f0",
                        padding: "2.5rem 2rem 2rem 2rem",
                        minWidth: 340,
                        maxWidth: 480,
                        width: "100%",
                        margin: "0 auto"
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
                        Upload Parts CSV
                    </h2>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            CSV File
                        </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleCsvFile}
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
                    <div style={{ marginBottom: 18, display: "flex", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <button
                                onClick={downloadCsvTemplate}
                                style={{
                                    width: "100%",
                                    background: "#e0f2fe",
                                    color: "#0c4b33",
                                    border: "1px solid #0c4b33",
                                    borderRadius: 8,
                                    padding: "0.75rem",
                                    fontWeight: 700,
                                    fontSize: 16,
                                    cursor: "pointer",
                                    transition: "background 0.2s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                Download CSV Template
                            </button>
                        </div>
                        <div style={{ flex: 1 }}>
                            <button
                                onClick={handleCsvUpload}
                                disabled={uploading}
                                style={{
                                    width: "100%",
                                    background: uploading ? "#a5b4fc" : "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "0.75rem",
                                    fontWeight: 700,
                                    fontSize: 16,
                                    cursor: uploading ? "not-allowed" : "pointer",
                                }}
                            >
                                {uploading ? "Uploading..." : "Upload CSV"}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div
                            style={{
                                background: "#fee2e2",
                                color: "#b91c1c",
                                borderRadius: 8,
                                padding: "0.5rem 1rem",
                                marginTop: 8,
                                fontWeight: 500,
                                fontSize: 15,
                                textAlign: "center",
                            }}
                        >
                            {error}
                        </div>
                    )}
                    {success && csvResult && (
                        <div
                            style={{
                                background: "#d1fae5",
                                color: "#047857",
                                borderRadius: 8,
                                padding: "0.5rem 1rem",
                                marginTop: 8,
                                fontWeight: 500,
                                fontSize: 15,
                                textAlign: "center",
                            }}
                        >
                            Successfully uploaded {csvResult.count} parts!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}