import React, { useState, useEffect } from "react";
import { supabase } from "../../../supaBase/supaBase";

const ModelsList = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);

    // Add filter states
    const [manufacturerFilter, setManufacturerFilter] = useState("");
    const [modelFilter, setModelFilter] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            // Fetch manufacturers
            const { data: manufacturersData, error: manufacturersError } = await supabase
                .from("Manufacturers")
                .select("id, manufacturer, image_path");

            if (manufacturersError) {
                console.error(manufacturersError);
                return;
            }

            // Fetch models with all relevant fields
            const { data: modelsData, error: modelsError } = await supabase
                .from("Models")
                .select("id, model, code, variant, start_year, end_year, image_path, manufacturer");

            if (modelsError) {
                console.error(modelsError);
                return;
            }

            // Map manufacturers with their models, including all fields and correct image path
            const manufacturersWithModels = manufacturersData.map((m) => ({
                id: m.id,
                name: m.manufacturer,
                image: m.image_path,
                models: modelsData
                    .filter((model) => model.manufacturer === m.manufacturer)
                    .map((model) => ({
                        id: model.id,
                        name: model.model,
                        code: model.code,
                        variant: model.variant,
                        start_year: model.start_year,
                        end_year: model.end_year,
                        image: model.image_path
                            ? (model.image_path.startsWith("/") ? model.image_path : "/arc/assets/img/" + model.image_path)
                            : "",
                    })),
            }));

            setManufacturers(manufacturersWithModels);
        };

        fetchData();
    }, []);

    const handleManufacturerClick = (id) => {
        setSelectedManufacturer(id === selectedManufacturer ? null : id);
    };

    const [editingModelId, setEditingModelId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const handleEditClick = (model) => {
        setEditingModelId(model.id);
        setEditForm({
            model: model.name,
            code: model.code || "",
            variant: model.variant || "",
            start_year: model.start_year || "",
            end_year: model.end_year || "",
            image_path: model.image || "",
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async (modelId) => {
        // Update in Supabase
        const { error } = await supabase
            .from("Models")
            .update({
                model: editForm.model,
                code: editForm.code,
                variant: editForm.variant,
                start_year: editForm.start_year,
                end_year: editForm.end_year,
                image_path: editForm.image_path,
            })
            .eq("id", modelId);

        if (error) {
            alert("Failed to update model");
            return;
        }

        // Update local state
        setManufacturers((prev) =>
            prev.map((man) =>
                man.id === selectedManufacturer
                    ? {
                        ...man,
                        models: man.models.map((m) =>
                            m.id === modelId
                                ? {
                                    ...m,
                                    name: editForm.model,
                                    code: editForm.code,
                                    variant: editForm.variant,
                                    start_year: editForm.start_year,
                                    end_year: editForm.end_year,
                                    image: editForm.image_path,
                                }
                                : m
                        ),
                    }
                    : man
            )
        );
        setEditingModelId(null);
    };

    const handleEditCancel = () => {
        setEditingModelId(null);
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "2rem",
                background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                minHeight: "80vh",
                padding: "2rem",
                fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
            }}
        >
            {/* Left: Manufacturers List */}
            <div
                className="container py-4"
                style={{
                    minWidth: 320,
                    maxWidth: 400,
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
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by name or ID..."
                        style={{
                            borderRadius: 8,
                            border: "1px solid #cbd5e1",
                            fontSize: 15,
                            padding: "0.5rem 1rem",
                        }}
                        value={manufacturerFilter}
                        onChange={e => setManufacturerFilter(e.target.value)}
                    />
                </div>
                <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                    <table className="table table-bordered align-middle bg-white shadow-sm" style={{ borderRadius: 12, overflow: "hidden" }}>
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: 48, background: "#f1f5fa", border: "none" }}>Logo</th>
                                <th style={{ background: "#f1f5fa", border: "none" }}>Name</th>
                                <th style={{ background: "#f1f5fa", border: "none" }}>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {manufacturers
                                .filter(m => {
                                    const f = manufacturerFilter || "";
                                    return (
                                        m.name?.toLowerCase().includes(f.toLowerCase()) ||
                                        String(m.id).includes(f)
                                    );
                                })
                                .map(manufacturer => (
                                    <tr
                                        key={manufacturer.id}
                                        style={{
                                            background:
                                                selectedManufacturer === manufacturer.id
                                                    ? "linear-gradient(90deg, #e0e7ef 0%, #f8fafc 100%)"
                                                    : undefined,
                                            cursor: "pointer",
                                            transition: "background 0.2s",
                                        }}
                                        onClick={() => handleManufacturerClick(manufacturer.id)}
                                    >
                                        <td>
                                            {manufacturer.image ? (
                                                <img
                                                    src={
                                                        manufacturer.image.startsWith("/")
                                                            ? manufacturer.image
                                                            : "/arc/assets/img/" + manufacturer.image
                                                    }
                                                    alt={manufacturer.name}
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        objectFit: "contain",
                                                        background: "#f8f8f8",
                                                        borderRadius: 8,
                                                        border: "1px solid #e3e8f0",
                                                        boxShadow: "0 1px 4px 0 rgba(60,80,120,0.08)",
                                                    }}
                                                    onError={e => (e.target.style.display = "none")}
                                                />
                                            ) : (
                                                <span className="text-muted">N/A</span>
                                            )}
                                        </td>
                                        <td className="fw-semibold" style={{ fontWeight: 600, color: "#334155" }}>
                                            {manufacturer.name}
                                        </td>
                                        <td style={{ color: "#64748b" }}>{manufacturer.id}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div
                style={{
                    flex: 1,
                    maxHeight: "80vh",
                    overflowY: "auto",
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 4px 24px 0 rgba(60,80,120,0.10)",
                    border: "1px solid #e3e8f0",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2
                        style={{
                            fontSize: 22,
                            letterSpacing: 1,
                            color: "#2a3342",
                            fontWeight: 700,
                        }}
                    >
                        {selectedManufacturer
                            ? manufacturers.find(m => m.id === selectedManufacturer)?.name + " Models"
                            : "Models"}
                    </h2>
                    {selectedManufacturer ? (
                        <>
                            <div className="mb-3" style={{ maxWidth: 320 }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Filter models by name, code, or ID..."
                                    style={{
                                        borderRadius: 8,
                                        border: "1px solid #cbd5e1",
                                        fontSize: 15,
                                        padding: "0.5rem 1rem",
                                    }}
                                    value={modelFilter}
                                    onChange={e => setModelFilter(e.target.value)}
                                    display="inline-block"
                                />
                            </div>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "separate",
                                    borderSpacing: 0,
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    boxShadow: "0 1px 8px 0 rgba(60,80,120,0.06)",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th style={{ background: "#f1f5fa", padding: "0.75rem", border: "none", fontWeight: 700 }}>
                                            Model Name
                                        </th>
                                        <th style={{ background: "#f1f5fa", padding: "0.75rem", border: "none", fontWeight: 700 }}>
                                            Code
                                        </th>
                                        <th style={{ background: "#f1f5fa", padding: "0.75rem", border: "none", fontWeight: 700 }}>
                                            Variant
                                        </th>
                                        <th style={{ background: "#f1f5fa", padding: "0.75rem", border: "none", fontWeight: 700 }}>
                                            Start Year
                                        </th>
                                        <th style={{ background: "#f1f5fa", padding: "0.75rem", border: "none", fontWeight: 700 }}>
                                            End Year
                                        </th>
                                        <th style={{ background: "#f1f5fa", padding: "0.75rem", border: "none", fontWeight: 700 }}>
                                            Image
                                        </th>
                                        <th style={{ background: "#f1f5fa", padding: "0.75rem", border: "none", fontWeight: 700 }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {manufacturers
                                        .find(m => m.id === selectedManufacturer)
                                        ?.models.filter(model => {
                                            const f = modelFilter.toLowerCase();
                                            return (
                                                model.name?.toLowerCase().includes(f) ||
                                                model.code?.toLowerCase().includes(f) ||
                                                model.variant?.toLowerCase().includes(f) ||
                                                String(model.id).includes(f)
                                            );
                                        })
                                        .map(model =>
                                            editingModelId === model.id ? (
                                                <tr key={model.id}>
                                                    <td style={{ padding: "0.5rem" }}>
                                                        <input
                                                            name="model"
                                                            value={editForm.model}
                                                            onChange={handleEditChange}
                                                            style={{
                                                                borderRadius: 6,
                                                                border: "1px solid #cbd5e1",
                                                                padding: "0.25rem 0.5rem",
                                                                width: "100%",
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "0.5rem" }}>
                                                        <input
                                                            name="code"
                                                            value={editForm.code}
                                                            onChange={handleEditChange}
                                                            style={{
                                                                borderRadius: 6,
                                                                border: "1px solid #cbd5e1",
                                                                padding: "0.25rem 0.5rem",
                                                                width: "100%",
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "0.5rem" }}>
                                                        <input
                                                            name="variant"
                                                            value={editForm.variant}
                                                            onChange={handleEditChange}
                                                            style={{
                                                                borderRadius: 6,
                                                                border: "1px solid #cbd5e1",
                                                                padding: "0.25rem 0.5rem",
                                                                width: "100%",
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "0.5rem" }}>
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
                                                    <td style={{ padding: "0.5rem" }}>
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
                                                    <td style={{ padding: "0.5rem" }}>
                                                        <input
                                                            name="image_path"
                                                            value={editForm.image_path}
                                                            onChange={handleEditChange}
                                                            style={{
                                                                borderRadius: 6,
                                                                border: "1px solid #cbd5e1",
                                                                padding: "0.25rem 0.5rem",
                                                                width: "100%",
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "0.5rem" }}>
                                                        <button
                                                            onClick={() => handleEditSave(model.id)}
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
                                                <tr key={model.id} style={{ transition: "background 0.2s" }}>
                                                    <td style={{ padding: "0.5rem", fontWeight: 500, color: "#334155" }}>
                                                        {model.name}
                                                    </td>
                                                    <td style={{ padding: "0.5rem", color: "#64748b" }}>
                                                        {model.code || ""}
                                                    </td>
                                                    <td style={{ padding: "0.5rem", color: "#64748b" }}>
                                                        {model.variant || ""}
                                                    </td>
                                                    <td style={{ padding: "0.5rem", color: "#64748b" }}>
                                                        {model.start_year || ""}
                                                    </td>
                                                    <td style={{ padding: "0.5rem", color: "#64748b" }}>
                                                        {model.end_year || ""}
                                                    </td>
                                                    <td style={{ padding: "0.5rem" }}>
                                                        {model.image ? (
                                                            <img
                                                                src={
                                                                    model.image.startsWith("/")
                                                                        ? model.image
                                                                        : "/arc/assets/img/" +
                                                                        model.image.replace(/^assets[\\/]/, "")
                                                                }
                                                                alt={model.name}
                                                                style={{
                                                                    width: 40,
                                                                    height: 30,
                                                                    objectFit: "cover",
                                                                    borderRadius: 6,
                                                                    border: "1px solid #e3e8f0",
                                                                    background: "#f8fafc",
                                                                }}
                                                                onError={e => (e.target.style.display = "none")}
                                                            />
                                                        ) : (
                                                            <span className="text-muted">N/A</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: "0.5rem" }}>
                                                        <button
                                                            onClick={() => handleEditClick(model)}
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
                        </>
                    ) : (
                        <p
                            style={{
                                color: "#64748b",
                                fontSize: 18,
                                textAlign: "center",
                                marginTop: "4rem",
                            }}
                        >
                            Select a manufacturer to view its models.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModelsList;