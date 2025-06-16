import React, { useState } from "react";
import { supabase } from "../../supaBase/supaBase";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const { data, error } = await supabase.auth.signInWithPassword({
            email: form.username,
            password: form.password,
        });
        if (error) {
            setError(error.message || "Invalid username or password");
        }
        navigate("/");
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow" style={{ maxWidth: 400, width: "100%" }}>
                <div className="card-header bg-danger text-white text-center">
                    <h2 className="mb-0">Login</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                        {error && (
                            <div className="alert alert-danger py-2 mb-3" role="alert">
                                {error}
                            </div>
                        )}
                        <button type="submit" className="btn btn-danger w-100">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;