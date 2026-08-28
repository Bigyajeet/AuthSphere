import { useEffect } from 'react';
import { FaFacebook } from 'react-icons/fa';

function FacebookSuccess() {
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
                <FaFacebook style={{ fontSize: '48px', color: '#1877f2' }} />
                <span className="spinner" style={{ width: '28px', height: '28px', borderThickness: '3px' }}></span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>Authenticating Facebook Session...</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Please wait while we finalize your sign in.</p>
            </div>
        </div>
    );
}

export default FacebookSuccess;