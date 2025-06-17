import React, { useEffect, useState } from "react";
import { supabase } from "../../../supaBase/supaBase";

export default function ProfilesList() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("Profiles")
                .select("id, user_id, role, created_at, updated_at");
            if (!error) setProfiles(data || []);
            setLoading(false);
        };
        fetchProfiles();
    }, []);

    const filteredProfiles = profiles.filter((p) => {
        const f = filter.toLowerCase();
        return (
            String(p.id).includes(f) ||
            (p.user_id && p.user_id.toLowerCase().includes(f)) ||
            (p.role && p.role.toLowerCase().includes(f)) ||
            (p.created_at && p.created_at.toLowerCase().includes(f)) ||
            (p.updated_at && p.updated_at.toLowerCase().includes(f))
        );
    });

    const exportCSV = () => {
        if (!filteredProfiles.length) return;
        const header = ["ID", "User ID", "Role", "Created At", "Updated At"];
        const rows = filteredProfiles.map(p => [
            p.id,
            `"${(p.user_id || "").replace(/"/g, '""')}"`,
            `"${(p.role || "").replace(/"/g, '""')}"`,
            `"${(p.created_at || "").replace(/"/g, '""')}"`,
            `"${(p.updated_at || "").replace(/"/g, '""')}"`
        ]);
        const csvContent =
            [header, ...rows]
                .map(row => row.join(","))
                .join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "profiles.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) return <div>Loading profiles...</div>;

    return (
        <div style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: 24,
            background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
            minHeight: "80vh",
            fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
        }}>
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ marginBottom: 24, display: "flex" }}>
                <h2 style={{
                    fontSize: 22,
                    letterSpacing: 1,
                    color: "#2a3342",
                    fontWeight: 700,
                    marginBottom: 0,
                }}>
                    User Profiles
                </h2>
                <button
                    className="btn btn-outline-primary"
                    onClick={exportCSV}
                    style={{
                        borderRadius: 8,
                        border: "1px solid #2563eb",
                        color: "#2563eb",
                        background: "#f1f5fa",
                        fontWeight: 600,
                        padding: "0.5rem 1.2rem",
                        fontSize: 15,
                        cursor: "pointer",
                        transition: "background 0.2s, color 0.2s",
                    }}
                >
                    Export as CSV
                </button>
            </div>
            <div className="mb-3" style={{ marginBottom: 18 }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Filter by ID, user ID, role, or date..."
                    style={{
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        fontSize: 15,
                        padding: "0.5rem 1rem",
                        maxWidth: 400,
                        marginBottom: 0,
                    }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <div className="table-responsive">
                <table className="table table-bordered align-middle bg-white shadow-sm" style={{ borderRadius: 12, overflow: "hidden" }}>
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProfiles.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td style={{ fontFamily: "monospace", fontSize: 13 }}>{p.user_id}</td>
                                <td>{p.role}</td>
                                <td>{p.created_at ? new Date(p.created_at).toLocaleString() : ""}</td>
                                <td>{p.updated_at ? new Date(p.updated_at).toLocaleString() : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!filteredProfiles.length && (
                    <div style={{ color: "#64748b", textAlign: "center", marginTop: 24 }}>
                        No profiles found.
                    </div>
                )}
            </div>
        </div>
    );
}