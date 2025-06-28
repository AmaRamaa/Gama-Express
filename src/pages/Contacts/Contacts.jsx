import React from "react";
import { useTranslation } from 'react-i18next';
import '../../i18n';

const whatsappNumber = "+38344100531";
const viberNumber = "+38344100531";
const emailAddress = "gamaexpress18@gmail.com";

export default function Contacts() {
    const { t } = useTranslation();
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
                {t('contacts.title', 'Contact Us')}
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
                    {t('contacts.whatsapp', 'WhatsApp')}
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
                        style={{width: 28, height: 28, marginRight: 14, background: "#fff", borderRadius: "50%", padding: 4}}
                    />
                    {t('contacts.viber', 'Viber')}
                </a>
                <a
                    href={`mailto:${emailAddress}`}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#e11d48",
                        color: "#fff",
                        padding: "14px 24px",
                        borderRadius: 6,
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: 18,
                        transition: "background 0.2s",
                        boxShadow: "0 1px 4px rgba(225,29,72,0.10)"
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{marginRight: 14, background: "#fff", borderRadius: "50%", padding: 4}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12A2.25 2.25 0 0 0 7.5 20.25h9a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 16.5 3.75z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7.5 6 4.5 4.5L16.5 6" /></svg>
                    {t('contacts.email', 'Email')}
                </a>
            </div>
        </div>
    );
}