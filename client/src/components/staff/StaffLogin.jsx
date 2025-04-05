import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './Staff.css';

const StaffLogin = () => {
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${url}/api/staff/login`, formData);
            if (response.data.success) {
                localStorage.setItem('staffToken', response.data.token);
                localStorage.setItem('staffRole', response.data.staffData.role);
                localStorage.setItem('staffId', response.data.staffData.id); // Add this line
                localStorage.setItem('staffName', response.data.staffData.name); // Add this line
                navigate('/staff/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="staff-login-container">
            <div className="staff-login-box">
                <h2>Staff Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" className="staff-login-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="register-link">
                    <p>Don't have an account? <span onClick={() => navigate('/staff/register')}>Register here</span></p>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
