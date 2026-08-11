import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(res.data);
        } catch (error) {
            console.log(error);
            navigate("/");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="dashboard-container">
            {/* Added dashboard-card wrapper to fix layout stretching */}
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
                    <>  
                        <p style={{ color: '#94a3b8' }}>Loading......</p>  
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;