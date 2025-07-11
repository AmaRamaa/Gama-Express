import React, { useEffect, useState } from "react";
import { supabase } from "../../../supaBase/supaBase";

// For CSV parsing
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

const CSV_FORMAT = [
    "model",
    "search_code",
    "start_year",
    "end_year",
    "variant",
    "code",
    "image_path"
];

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
    const [csvMode, setCsvMode] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [csvResult, setCsvResult] = useState(null);

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
                    manufacturer: selectedManufacturer.manufacturer,
                    model: row.model,
                    search_code: row.search_code || null,
                    start_year: Number(row.start_year),
                    end_year: Number(row.end_year),
                    variant: row.variant,
                    code: row.code,
                    image_path: row.image_path,
                }));
                const { error: insertError, data } = await supabase
                    .from("Models")
                    .insert(insertRows);

                if (insertError) {
                    setError("Failed to insert some or all models.");
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
        const example = "A4,SC123,2000,2005,Base,1234,/arc/assets/img/audi_a4.png";
        const csv = `${header}\n${example}`;
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "models_template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) return <div>Loading manufacturers...</div>;

    return (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
            <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600, marginRight: 12 }}>
                    <input
                        type="checkbox"
                        checked={csvMode}
                        onChange={e => {
                            setCsvMode(e.target.checked);
                            setSuccess(false);
                            setError("");
                            // Reset only CSV-related state when switching modes
                            setCsvFile(null);
                            setCsvResult(null);
                        }}
                        style={{ marginRight: 6 }}
                    />
                    Upload CSV/Excel
                </label>
            </div>
            {/* Single Model Form */}
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
                        maxWidth: 420,
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
                        Create Model
                    </h2>
                    {/* Manufacturer select */}
                    <div style={{ marginBottom: 18 }}>
                        <label
                            style={{
                                fontWeight: 600,
                                marginBottom: 6,
                                display: "block",
                                color: "#334155",
                            }}
                        >
                            Manufacturer *
                        </label>
                        <select
                            name="manufacturer"
                            value={selectedManufacturer ? selectedManufacturer.id : ""}
                            onChange={(e) => {
                                const selected = manufacturers.find(m => m.id === Number(e.target.value));
                                setSelectedManufacturer(selected || null);
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
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Model *
                        </label>
                        <input
                            type="text"
                            name="model"
                            value={form.model}
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
                            Search Code
                        </label>
                        <input
                            type="text"
                            name="search_code"
                            value={form.search_code}
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
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                            Code *
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={form.code}
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
                            Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
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
                            Model created successfully!
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
                        {uploading ? "Saving..." : "Create Model"}
                    </button>
                </form>
            )}
            {/* CSV Upload UI */}
            {csvMode && (
                <div
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
                        {selectedManufacturer
                            ? `Upload CSV for ${selectedManufacturer.manufacturer}`
                            : "Upload CSV"}
                    </h2>
                    {!selectedManufacturer ? (
                        <div style={{ marginBottom: 22 }}>
                            <label
                                style={{
                                    fontWeight: 600,
                                    marginBottom: 6,
                                    display: "block",
                                    color: "#334155",
                                }}
                            >
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
                            <div
                                style={{
                                    marginBottom: 24,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={downloadCsvTemplate}
                                    style={{
                                        background: "#f1f5f9",
                                        color: "#2563eb",
                                        border: "1px solid #2563eb",
                                        borderRadius: 8,
                                        padding: "0.5rem 1.2rem",
                                        fontWeight: 600,
                                        fontSize: 15,
                                        cursor: "pointer",
                                        marginBottom: 0,
                                        transition: "background 0.2s, color 0.2s",
                                    }}
                                >
                                    Download CSV Format
                                </button>
                                <label
                                    htmlFor="csv-upload"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        background: "#f8fafc",
                                        border: "1px dashed #cbd5e1",
                                        borderRadius: 8,
                                        padding: "1.2rem 1rem",
                                        textAlign: "center",
                                        color: "#64748b",
                                        fontWeight: 500,
                                        fontSize: 15,
                                        cursor: "pointer",
                                        marginBottom: 0,
                                    }}
                                >
                                    {csvFile ? (
                                        <>
                                            <span style={{ color: "#2563eb", fontWeight: 600 }}>
                                                {csvFile.name}
                                            </span>
                                            <span
                                                style={{
                                                    marginLeft: 12,
                                                    color: "#ef4444",
                                                    cursor: "pointer",
                                                    fontWeight: 700,
                                                }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setCsvFile(null);
                                                }}
                                            >
                                                &times;
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: 18, marginRight: 8 }}>📄</span>
                                            Click to select CSV file
                                        </>
                                    )}
                                    <input
                                        id="csv-upload"
                                        type="file"
                                        accept=".csv"
                                        onChange={handleCsvFile}
                                        style={{ display: "none" }}
                                    />
                                </label>
                                <div style={{
                                    fontSize: 13,
                                    color: "#64748b",
                                    marginTop: 4,
                                    marginBottom: 0,
                                    textAlign: "center"
                                }}>
                                    Only .csv files. Use the template for correct columns.
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleCsvUpload}
                                disabled={uploading || !csvFile}
                                style={{
                                    width: "100%",
                                    background: uploading || !csvFile ? "#a5b4fc" : "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "0.75rem",
                                    fontWeight: 700,
                                    fontSize: 16,
                                    boxShadow: "0 1px 4px 0 rgba(60,80,120,0.08)",
                                    transition: "background 0.2s",
                                    cursor: uploading || !csvFile ? "not-allowed" : "pointer",
                                    marginBottom: 8,
                                }}
                            >
                                {uploading ? "Uploading..." : "Upload CSV"}
                            </button>
                            {csvResult && (
                                <div
                                    style={{
                                        background: "#d1fae5",
                                        color: "#047857",
                                        borderRadius: 8,
                                        padding: "0.5rem 1rem",
                                        marginTop: 16,
                                        fontWeight: 500,
                                        fontSize: 15,
                                        textAlign: "center",
                                    }}
                                >
                                    {csvResult.count} models created successfully!
                                </div>
                            )}
                        </>
                    )}
                    {error && (
                        <div
                            style={{
                                background: "#fee2e2",
                                color: "#b91c1c",
                                borderRadius: 8,
                                padding: "0.5rem 1rem",
                                marginTop: 16,
                                fontWeight: 500,
                                fontSize: 15,
                                textAlign: "center",
                            }}
                        >
                            {error}
                        </div>
                    )}
                    {success && !csvResult && (
                        <div
                            style={{
                                background: "#d1fae5",
                                color: "#047857",
                                borderRadius: 8,
                                padding: "0.5rem 1rem",
                                marginTop: 16,
                                fontWeight: 500,
                                fontSize: 15,
                                textAlign: "center",
                            }}
                        >
                            Models created successfully!
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedManufacturer(null);
                                    setCsvFile(null);
                                    setSuccess(false);
                                    setError("");
                                }}
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
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}