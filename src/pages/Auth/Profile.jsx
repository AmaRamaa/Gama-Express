import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supaBase/supaBase";

const profileStyles = {
    container: {
        maxWidth: "400px",
        margin: "40px auto",
        padding: "32px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        textAlign: "center",
        fontFamily: "Segoe UI, Arial, sans-serif",
    },
    heading: {
        fontSize: "2rem",
        marginBottom: "24px",
        color: "#2d3748",
    },
    label: {
        fontWeight: "bold",
        color: "#4a5568",
    },
    value: {
        color: "#2d3748",
        marginBottom: "16px",
        display: "block",
    },
    button: {
        marginTop: "24px",
        padding: "10px 28px",
        background: "#3182ce",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background 0.2s",
    },
};
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getProfile = async () => {
            setLoading(true);
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                setProfile(null);
                setLoading(false);
                return;
            }

            setProfile({
                email: user.email,
                id: user.id,
            });
            setLoading(false);
        };

        getProfile();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        navigate("/login"); // Redirect to login page after sign out
        // Optionally, you can reload if needed, but usually navigate is enough
        // window.location.reload();
    };

    if (loading)
        return (
            <div style={profileStyles.container}>
            <div>Loading...</div> 
            </div>
        );
    if (!profile)
        return (
            <div style={profileStyles.container}>
                <div>No profile found. Please log in.</div>
            </div>
        );

    return (
        <div style={profileStyles.container}>
            <h2 style={profileStyles.heading}>Profile</h2>
            <p>
                <span style={profileStyles.label}>Email:</span>
                <span style={profileStyles.value}>{profile.email}</span>
            </p>
            <p>
                <span style={profileStyles.label}>User ID:</span>
                <span style={profileStyles.value}>{profile.id}</span>
            </p>
            <button
                style={profileStyles.button}
                onClick={handleSignOut}
                onMouseOver={e => (e.target.style.background = "#2b6cb0")}
                onMouseOut={e => (e.target.style.background = "#3182ce")}
            >
                Sign Out
            </button>
        </div>
    );
};

export default Profile;
