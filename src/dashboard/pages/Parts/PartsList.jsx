import React, { useEffect, useState } from "react";
import { supabase } from "../../../supaBase/supaBase";

const IMAGE_BASE = "/arc/assets/img/";

export default function PartsList() {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [editingPartId, setEditingPartId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        const fetchParts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("Parts")
                .select(
                    "id, OEM, AM, Description, Model, Car, img, start_year, end_year, Variant, Category, Subcategory, Code"
                );
            if (!error) setParts(data || []);
            setLoading(false);
        };
        fetchParts();
    }, []);

    const filteredParts = parts.filter((p) => {
        const f = filter.toLowerCase();
        return (
            (p.Description && p.Description.toLowerCase().includes(f)) ||
            (p.Model && p.Model.toLowerCase().includes(f)) ||
            (p.Car && p.Car.toLowerCase().includes(f)) ||
            (p.OEM && p.OEM.toLowerCase().includes(f)) ||
            (p.AM && p.AM.toLowerCase().includes(f)) ||
            (p.Code && p.Code.toLowerCase().includes(f)) ||
            String(p.id).includes(f)
        );
    });

    const handleEditClick = (part) => {
        setEditingPartId(part.id);
        setEditForm({
            OEM: part.OEM || "",
            AM: part.AM || "",
            Description: part.Description || "",
            Model: part.Model || "",
            Car: part.Car || "",
            img: part.img || "",
            start_year: part.start_year || "",
            end_year: part.end_year || "",
            Variant: part.Variant || "",
            Category: part.Category || "",
            Subcategory: part.Subcategory || "",
            Code: part.Code || "",
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async (partId) => {
        // Convert empty strings to null and ensure numbers for numeric fields
        const payload = {
            OEM: editForm.OEM,
            AM: editForm.AM,
            Description: editForm.Description,
            Model: editForm.Model,
            Car: editForm.Car,
            img: editForm.img,
            start_year: editForm.start_year === "" ? null : Number(editForm.start_year),
            end_year: editForm.end_year === "" ? null : Number(editForm.end_year),
            Variant: editForm.Variant,
            Category: editForm.Category,
            Subcategory: editForm.Subcategory,
            Code: editForm.Code,
        };

        const { error } = await supabase
            .from("Parts")
            .update(payload)
            .eq("id", partId);

        if (error) {
            alert("Failed to update part");
            return;
        }

        setParts((prev) =>
            prev.map((p) =>
                p.id === partId
                    ? { ...p, ...payload }
                    : p
            )
        );
        setEditingPartId(null);
    };

    const handleEditCancel = () => {
        setEditingPartId(null);
    };

    if (loading) return <div>Loading parts...</div>;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                minHeight: "80vh",
                padding: "2rem",
                fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2
                    className="mb-0"
                    style={{
                        fontSize: 22,
                        letterSpacing: 1,
                        color: "#2a3342",
                        fontWeight: 700,
                    }}
                >
                    Parts
                </h2>
                <button
                    onClick={() => {
                        // CSV header
                        const headers = [
                            "id",
                            "OEM",
                            "AM",
                            "Description",
                            "Model",
                            "Car",
                            "img",
                            "start_year",
                            "end_year",
                            "Variant",
                            "Category",
                            "Subcategory",
                            "Code"
                        ];
                        // CSV rows
                        const rows = filteredParts.map((p) =>
                            headers.map((h) => {
                                let val = p[h];
                                if (val === null || val === undefined) return "";
                                // Escape quotes
                                if (typeof val === "string" && (val.includes(",") || val.includes('"') || val.includes("\n"))) {
                                    val = '"' + val.replace(/"/g, '""') + '"';
                                }
                                return val;
                            }).join(",")
                        );
                        const csv = [headers.join(","), ...rows].join("\r\n");
                        // Download
                        const blob = new Blob([csv], { type: "text/csv" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "parts.csv";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }}
                    style={{
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.4rem 1.2rem",
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer",
                        boxShadow: "0 1px 4px 0 rgba(60,80,120,0.08)",
                    }}
                >
                    Export as CSV
                </button>
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Filter by description, model, car, OEM, AM, code, or ID..."
                    style={{
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        fontSize: 15,
                        padding: "0.5rem 1rem",
                        maxWidth: 400,
                    }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <table
                    className="table table-bordered align-middle bg-white shadow-sm"
                    style={{ borderRadius: 12, overflow: "hidden" }}
                >
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: 48, background: "#f1f5fa", border: "none" }}>Image</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>Description</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>Model</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>Car</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>OEM</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>AM</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>Code</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>Start Year</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>End Year</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>Variant</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>Category</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>Subcategory</th>
                            <th style={{ background: "#f1f5fa", border: "none" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParts.map((p) =>
                            editingPartId === p.id ? (
                                <tr key={p.id}>
                                    <td>
                                        <input
                                            name="img"
                                            value={editForm.img}
                                            onChange={handleEditChange}
                                            placeholder="Image path or upload below"
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                                marginBottom: 6,
                                            }}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                const fileName = `${Date.now()}_${file.name}`;
                                                const { error: uploadError } = await supabase.storage
                                                    .from("part-images")
                                                    .upload(fileName, file);
                                                if (uploadError) {
                                                    alert("Failed to upload image.");
                                                    return;
                                                }
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    img: `part-images/${fileName}`,
                                                }));
                                            }}
                                            style={{ width: "100%" }}
                                        />
                                        {editForm.img && (
                                            <img
                                                src={
                                                    /^https?:\/\//i.test(editForm.img)
                                                        ? editForm.img
                                                        : editForm.img.startsWith("/")
                                                            ? editForm.img
                                                            : IMAGE_BASE + editForm.img
                                                }
                                                alt="Preview"
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    objectFit: "cover",
                                                    borderRadius: 6,
                                                    border: "1px solid #e3e8f0",
                                                    background: "#f8fafc",
                                                    marginTop: 6,
                                                }}
                                                onError={e => (e.target.style.display = "none")}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            name="Description"
                                            value={editForm.Description}
                                            onChange={handleEditChange}
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="Model"
                                            value={editForm.Model}
                                            onChange={handleEditChange}
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="Car"
                                            value={editForm.Car}
                                            onChange={handleEditChange}
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="OEM"
                                            value={editForm.OEM}
                                            onChange={handleEditChange}
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="AM"
                                            value={editForm.AM}
                                            onChange={handleEditChange}
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="Code"
                                            value={editForm.Code}
                                            onChange={handleEditChange}
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="start_year"
                                            value={editForm.start_year}
                                            onChange={handleEditChange}
                                            type="number"
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="end_year"
                                            value={editForm.end_year}
                                            onChange={handleEditChange}
                                            type="number"
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="Variant"
                                            value={editForm.Variant}
                                            onChange={handleEditChange}
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="Category"
                                            value={editForm.Category}
                                            onChange={handleEditChange}
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="Subcategory"
                                            value={editForm.Subcategory}
                                            onChange={handleEditChange}
                                            style={{
                                                borderRadius: 6,
                                                border: "1px solid #cbd5e1",
                                                padding: "0.25rem 0.5rem",
                                                width: "100%",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleEditSave(p.id)}
                                            style={{
                                                background: "#2563eb",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 6,
                                                padding: "0.25rem 0.75rem",
                                                fontWeight: 600,
                                                marginRight: 4,
                                                cursor: "pointer",
                                                boxShadow: "0 1px 4px 0 rgba(60,80,120,0.08)",
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleEditCancel}
                                            style={{
                                                background: "#f1f5fa",
                                                color: "#64748b",
                                                border: "1px solid #cbd5e1",
                                                borderRadius: 6,
                                                padding: "0.25rem 0.75rem",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={p.id} style={{ transition: "background 0.2s" }}>
                                    <td>
                                        {p.img ? (
                                            <img
                                                src={
                                                    /^https?:\/\//i.test(p.img)
                                                        ? p.img
                                                        : p.img.startsWith("part-images/")
                                                            // If Supabase Storage, get public URL
                                                            ? supabase.storage.from("part-images").getPublicUrl(p.img.replace("part-images/", "")).data.publicUrl
                                                            : p.img.startsWith("/")
                                                                ? p.img
                                                                : IMAGE_BASE + p.img
                                                }
                                                alt={p.Description || "Part"}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    objectFit: "contain",
                                                    background: "#f8f8f8",
                                                    borderRadius: 8,
                                                    border: "1px solid #e3e8f0",
                                                    boxShadow: "0 1px 4px 0 rgba(60,80,120,0.08)",
                                                }}
                                                onError={(e) => (e.target.style.display = "none")}
                                            />
                                        ) : (
                                            <span className="text-muted">N/A</span>
                                        )}
                                    </td>
                                    <td style={{ fontWeight: 500, color: "#334155" }}>{p.Description}</td>
                                    <td style={{ color: "#64748b" }}>{p.Model}</td>
                                    <td style={{ color: "#64748b" }}>{p.Car}</td>
                                    <td style={{ color: "#64748b" }}>{p.OEM}</td>
                                    <td style={{ color: "#64748b" }}>{p.AM}</td>
                                    <td style={{ color: "#64748b" }}>{p.Code}</td>
                                    <td style={{ color: "#64748b" }}>{p.start_year}</td>
                                    <td style={{ color: "#64748b" }}>{p.end_year}</td>
                                    <td style={{ color: "#64748b" }}>{p.Variant}</td>
                                    <td style={{ color: "#64748b" }}>{p.Category}</td>
                                    <td style={{ color: "#64748b" }}>{p.Subcategory}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEditClick(p)}
                                            style={{
                                                background: "#f1f5fa",
                                                color: "#2563eb",
                                                border: "1px solid #3b82f6",
                                                borderRadius: 6,
                                                padding: "0.25rem 0.75rem",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                transition: "background 0.2s, color 0.2s",
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}