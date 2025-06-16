import React from 'react';
import { supabase } from "../../../supaBase/supaBase"
import { useNavigate } from 'react-router-dom';

const Header = ({ tabs = [], onTabClick, onTabClose, actions, user }) => {
    const [allowed, setAllowed] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const navigate = window.location ? (path) => { window.location.href = path; } : () => {};

    React.useEffect(() => {
        const checkUser = async () => {
            setLoading(true);
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                if (!currentUser) {
                    setAllowed(false);
                    setLoading(false);
                    navigate('/');
                    return;
                }
                // Fetch the profile for the current user
                const { data, error } = await supabase
                    .from('Profiles')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .single();

                console.log("Profile data:", data);
                if (data?.role === "admin") {
                    setAllowed(true);
                } else {
                    setAllowed(false);
                    navigate('/');
                }
                setLoading(false);
            } catch (error) {
                setAllowed(false);
                setLoading(false);
                navigate('/');
                console.error("Error checking user:", error);
            }
        };
        checkUser();
    }, []);

    if (loading) return null;
    if (!allowed) return <div className="alert alert-danger m-4">You are not allowed to access this page.</div>;

    return (
        <header className="d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom shadow-sm">
            <div className="flex-grow-1 d-flex align-items-center">
                <ul className="nav nav-tabs">
                    {tabs.map((tab, idx) => (
                        <li className="nav-item d-flex align-items-center" key={tab.id || idx} style={{ position: 'relative' }}>
                            <button
                                className={`nav-link${tab.active ? ' active' : ''}`}
                                onClick={() => onTabClick(tab)}
                                type="button"
                                style={{ position: 'relative', paddingRight: tabs.length > 1 ? 24 : undefined }}
                            >
                                {tab.label}
                                {tabs.length > 1 && (
                                    <span
                                        type="button"
                                        className="btn btn-sm btn-link text-danger"
                                        onClick={e => { e.stopPropagation(); onTabClose(tab); }}
                                        title="Close tab"
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            right: 4,
                                            transform: 'translateY(-50%)',
                                            padding: 0,
                                            fontSize: 16,
                                            lineHeight: 1,
                                            background: 'none',
                                            border: 'none'
                                        }}
                                        tabIndex={-1}
                                    >
                                        &times;
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* User Info */}
            <div className="flex-grow-1 text-end">
            </div>
        </header>
    );
};

export default Header;