import React, { useEffect, useState } from "react";
import { supabase } from "../../../supaBase/supaBase";

const IMAGE_BASE = "/arc/assets/img/";

export default function ManufactureList() {
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [filter, setFilter] = useState(""); // 1. Add filter state

    useEffect(() => {
        fetchManufacturers();
    }, []);

    const fetchManufacturers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("Manufacturers")
            .select("id, manufacturer, image_path, search_code");
        if (!error) setManufacturers(data);
        setLoading(false);
    };

    const exportCSV = () => {
        if (!manufacturers.length) return;
        const header = ["ID", "Name", "Image Path"];
        const rows = manufacturers.map((m) => [
            m.id,
            `"${m.manufacturer.replace(/"/g, '""')}"`,
            `"${m.image_path.replace(/"/g, '""')}"`,
        ]);
        const csvContent = [header, ...rows]
            .map((row) => row.join(","))
            .join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "manufacturers.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const startEdit = (m) => {
        setEditingId(m.id);
        setEditData({
            manufacturer: m.manufacturer,
            image_path: m.image_path,
            search_code: m.search_code || "",
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const saveEdit = async (id) => {
        const { manufacturer, image_path, search_code } = editData;
        const { error } = await supabase
            .from("Manufacturers")
            .update({ manufacturer, image_path, search_code })
            .eq("id", id);
        if (!error) {
            setManufacturers((prev) =>
                prev.map((m) =>
                    m.id === id ? { ...m, manufacturer, image_path, search_code } : m
                )
            );
            cancelEdit();
        } else {
            alert("Failed to update manufacturer.");
        }
    };

    // 2. Filter manufacturers based on filter state
    const filteredManufacturers = manufacturers.filter((m) => {
        const f = filter.toLowerCase();
        return (
            m.manufacturer.toLowerCase().includes(f) ||
            (m.search_code && m.search_code.toLowerCase().includes(f)) ||
            String(m.id).includes(f)
        );
    });

    if (loading) return <div>Loading manufacturers...</div>;

    return (
        <div
            style={{
                display: "flex",
                gap: "2rem",
                background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                minHeight: "100vh",
                padding: "2rem",
                fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
            }}
        >
            {/* Left: Manufacturers List */}
            <div
                className="container py-4"
                style={{
                    minWidth: 320,
                    maxWidth: "100%",
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 4px 24px 0 rgba(60,80,120,0.10)",
                    border: "1px solid #e3e8f0",
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
                        Manufacturers
                    </h2>
                    <button
                        className="btn btn-outline-primary"
                        style={{
                            borderRadius: 8,
                            border: "1px solid #3b82f6",
                            color: "#2563eb",
                            fontWeight: 600,
                            background: "#f1f5fa",
                            transition: "background 0.2s, color 0.2s",
                        }}
                        onClick={exportCSV}
                    >
                        Export as CSV
                    </button>
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by name, search code, or ID..."
                        style={{
                            borderRadius: 8,
                            border: "1px solid #cbd5e1",
                            fontSize: 15,
                            padding: "0.5rem 1rem",
                        }}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                    <table className="table table-bordered align-middle bg-white shadow-sm" style={{ borderRadius: 12, overflow: "hidden" }}>
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: 48, background: "#f1f5fa", border: "none" }}>Logo</th>
                                <th style={{ background: "#f1f5fa", border: "none" }}>Name</th>
                                <th style={{ background: "#f1f5fa", border: "none" }}>ID</th>
                                <th style={{ background: "#f1f5fa", border: "none" }}>Image Path</th>
                                <th style={{ background: "#f1f5fa", border: "none" }}>Search Code</th>
                                <th style={{ background: "#f1f5fa", border: "none" }}>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredManufacturers.map((m) =>
                                editingId === m.id ? (
                                    <tr key={m.id} style={{ background: "#f8fafc" }}>
                                        <td>
                                            <img
                                                src={
                                                    editData.image_path?.startsWith("/")
                                                        ? editData.image_path
                                                        : IMAGE_BASE + editData.image_path
                                                }
                                                alt={editData.manufacturer}
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
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                name="manufacturer"
                                                value={editData.manufacturer}
                                                onChange={handleEditChange}
                                                style={{
                                                    borderRadius: 6,
                                                    border: "1px solid #cbd5e1",
                                                    padding: "0.25rem 0.5rem",
                                                    width: "100%",
                                                }}
                                            />
                                        </td>
                                        <td>{m.id}</td>
                                        <td>
                                            <input
                                                className="form-control font-monospace small"
                                                name="image_path"
                                                value={editData.image_path}
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
                                                className="form-control"
                                                name="search_code"
                                                value={editData.search_code}
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
                                                className="btn btn-success btn-sm me-2"
                                                style={{
                                                    borderRadius: 6,
                                                    fontWeight: 600,
                                                    boxShadow: "0 1px 4px 0 rgba(60,80,120,0.08)",
                                                }}
                                                onClick={() => saveEdit(m.id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                style={{
                                                    borderRadius: 6,
                                                    fontWeight: 600,
                                                }}
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={m.id} style={{ transition: "background 0.2s" }}>
                                        <td>
                                            <img
                                                src={
                                                    m.image_path?.startsWith("/")
                                                        ? m.image_path
                                                        : IMAGE_BASE + m.image_path
                                                }
                                                alt={m.manufacturer}
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
                                        </td>
                                        <td className="fw-semibold" style={{ fontWeight: 600, color: "#334155" }}>
                                            {m.manufacturer}
                                        </td>
                                        <td style={{ color: "#64748b" }}>{m.id}</td>
                                        <td>
                                            <span className="font-monospace small">{m.image_path}</span>
                                        </td>
                                        <td>
                                            <span className="text-muted">
                                                {m.search_code || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                style={{
                                                    borderRadius: 6,
                                                    color: "#2563eb",
                                                    border: "1px solid #3b82f6",
                                                    fontWeight: 600,
                                                    background: "#f1f5fa",
                                                    transition: "background 0.2s, color 0.2s",
                                                }}
                                                onClick={() => startEdit(m)}
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
        </div>
    );
}