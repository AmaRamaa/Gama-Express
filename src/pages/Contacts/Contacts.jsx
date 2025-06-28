import React from "react";

const whatsappNumber = "+38344100531";
const viberNumber = "+38344100531";
const emailAddress = "gamaexpress18@gmail.com";

export default function Contacts() {
    return (
        <div style={{
            maxWidth: 480,
            margin: "60px auto",
            padding: 40,
            borderRadius: 12,
            background: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)"
        }}>
            <h1 style={{
                textAlign: "center",
                color: "#991b1b",
                marginBottom: 32,
                fontWeight: 700,
                fontSize: 32,
                letterSpacing: 1
            }}>
                Contact Us
            </h1>
            <div style={{display: "flex", flexDirection: "column", gap: 24}}>
                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#22c55e",
                        color: "#fff",
                        padding: "14px 24px",
                        borderRadius: 6,
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: 18,
                        transition: "background 0.2s",
                        boxShadow: "0 1px 4px rgba(34,197,94,0.10)"
                    }}
                >
                    <img
                        src="/WhatsAppLogo.png"
                        alt="WhatsApp"
                        style={{width: 28, height: 28, marginRight: 14, background: "#fff", borderRadius: "50%", padding: 4}}
                    />
                    WhatsApp
                </a>
                <a
                    href={`viber://chat?number=%2B${viberNumber}`}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#7c3aed",
                        color: "#fff",
                        padding: "14px 24px",
                        borderRadius: 6,
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: 18,
                        transition: "background 0.2s",
                        boxShadow: "0 1px 4px rgba(124,58,237,0.10)"
                    }}
                >
                    <img
                        src="/ViberLogo.png"
                        alt="Viber"
                        style={{width: 28, height: 28, marginRight: 14, background: "#fff", borderRadius: "50%"}}
                    />
                    Viber
                </a>
                <form
                    action={`mailto:${emailAddress}`}
                    method="POST"
                    encType="text/plain"
                    style={{
                        background: "#f9fafb",
                        padding: 24,
                        borderRadius: 8,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14
                    }}
                >
                    <h2 style={{
                        margin: 0,
                        fontSize: 20,
                        color: "#991b1b",
                        fontWeight: 600,
                        letterSpacing: 0.5
                    }}>
                        Customer Complaints
                    </h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                        style={{
                            padding: 10,
                            borderRadius: 5,
                            border: "1px solid #e5e7eb",
                            fontSize: 16,
                            background: "#fff"
                        }}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        style={{
                            padding: 10,
                            borderRadius: 5,
                            border: "1px solid #e5e7eb",
                            fontSize: 16,
                            background: "#fff"
                        }}
                    />
                    <textarea
                        name="message"
                        placeholder="Describe your complaint..."
                        rows={4}
                        required
                        style={{
                            padding: 10,
                            borderRadius: 5,
                            border: "1px solid #e5e7eb",
                            fontSize: 16,
                            background: "#fff",
                            resize: "vertical"
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            background: "#991b1b",
                            color: "#fff",
                            padding: "12px 0",
                            border: "none",
                            borderRadius: 5,
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: "pointer",
                            marginTop: 6
                        }}
                    >
                        Send Email
                    </button>
                </form>
            </div>
        </div>
    );
}