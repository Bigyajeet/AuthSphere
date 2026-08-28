import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaUserCheck, FaEnvelope, FaShieldAlt, FaSignOutAlt, FaCopy, FaCheck, FaGoogle, FaGithub, FaFacebook, FaLinkedin, FaKey } from 'react-icons/fa';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const res = await API.get("/api/auth/profile");
                setUser(res.data);
            } catch (error) {
                console.error("Dashboard profile fetch error:", error);
                localStorage.removeItem("token");
                navigate("/");
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleCopyToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getProviderIcon = (provider) => {
        switch (provider?.toLowerCase()) {
            case 'google': return <FaGoogle style={{ color: '#ea4335' }} />;
            case 'github': return <FaGithub style={{ color: '#ffffff' }} />;
            case 'facebook': return <FaFacebook style={{ color: '#1877f2' }} />;
            case 'linkedin': return <FaLinkedin style={{ color: '#0a66c2' }} />;
            default: return <FaKey style={{ color: '#818cf8' }} />;
        }
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                {user ? (
                    <>
                        <div className="avatar-wrapper">
                            <div className="avatar-circle">
                                {getInitial(user.name)}
                            </div>
                            <span className="status-dot" title="Active Session"></span>
                        </div>

                        <h1 className="dashboard-name">{user.name}</h1>
                        <p className="dashboard-email">{user.email}</p>

                        <div className="profile-info-grid">
                            <div className="info-tile">
                                <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FaShieldAlt style={{ color: '#818cf8' }} /> Provider
                                </span>
                                <span className="provider-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {getProviderIcon(user.provider)}
                                    {user.provider || 'Local'}
                                </span>
                            </div>

                            <div className="info-tile">
                                <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FaEnvelope style={{ color: '#a855f7' }} /> Email Status
                                </span>
                                <span className="info-value" style={{ color: '#4ade80' }}>
                                    Verified
                                </span>
                            </div>

                            <div className="info-tile">
                                <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FaUserCheck style={{ color: '#38bdf8' }} /> Account ID
                                </span>
                                <span className="info-value" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                                    {user._id ? `${user._id.substring(0, 10)}...` : 'N/A'}
                                </span>
                            </div>
                        </div>

                        <button 
                            type="button" 
                            className="secondary-btn" 
                            onClick={handleCopyToken}
                            style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            {copied ? <FaCheck style={{ color: '#4ade80' }} /> : <FaCopy />}
                            {copied ? 'JWT Token Copied!' : 'Copy Session Token'}
                        </button>

                        <button className="logout-btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <FaSignOutAlt />
                            Sign Out
                        </button>
                    </>
                ) : (
                    <div style={{ padding: '40px 0' }}>
                        <span className="spinner" style={{ width: '32px', height: '32px', borderThickness: '3px' }}></span>
                        <p style={{ color: '#94a3b8', marginTop: '16px', fontSize: '14px' }}>Loading profile session...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;