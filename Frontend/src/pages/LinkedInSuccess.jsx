import { useEffect } from 'react';
import { FaLinkedin } from 'react-icons/fa';

function LinkedInSuccess() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (token) {
            localStorage.setItem("token", token);
            window.location.href = "/profile";
        } else {
            window.location.href = "/";
        }
    }, []);

    return (
        <div className="callback-screen">
            <div className="callback-card">
                <FaLinkedin style={{ fontSize: '48px', color: '#0a66c2' }} />
                <span className="spinner" style={{ width: '28px', height: '28px', borderThickness: '3px' }}></span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>Authenticating LinkedIn Session...</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Please wait while we finalize your sign in.</p>
            </div>
        </div>
    );
}

export default LinkedInSuccess;