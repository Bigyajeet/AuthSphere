import { useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';

function GithubSuccess() {
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
                <FaGithub style={{ fontSize: '48px', color: '#ffffff' }} />
                <span className="spinner" style={{ width: '28px', height: '28px', borderThickness: '3px' }}></span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>Authenticating GitHub Session...</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Please wait while we finalize your sign in.</p>
            </div>
        </div>
    );
}

export default GithubSuccess;