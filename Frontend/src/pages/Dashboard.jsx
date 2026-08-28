import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            
            // If no token exists, immediately redirect to login
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

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h1 className="dashboard-title">Dashboard</h1>
                {user ? (
                    <>
                        <h2 className="dashboard-name">
                            {user.name}
                        </h2>
                        <p className="dashboard-email">
                            {user.email}
                        </p>
                        <button className="dashboard-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <p style={{ color: '#94a3b8' }}>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;