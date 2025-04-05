import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUtensils, FaChair, FaChartLine, FaUsers, FaClipboard } from 'react-icons/fa';
import './AdminDashboard.css';
import Analytics from './components/Analytics';
import FoodManagement from './components/FoodManagement';
import TableManagement from './components/TableManagement';
import StaffManagement from './components/StaffManagement';

const AdminDashboard = () => {
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('analytics');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        activeStaff: 0,
        popularItems: [],
        recentOrders: [],
        staffPerformance: []
    });

    useEffect(() => {
        if (!localStorage.getItem('adminToken')) {
            navigate('/admin/login');
            return;
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/dashboard`, {
                headers: { token: localStorage.getItem('adminToken') }
            });
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'analytics':
                return <Analytics stats={stats} />;
            case 'food':
                return <FoodManagement />;
            case 'tables':
                return <TableManagement />;
            case 'staff':
                return <StaffManagement />;
            default:
                return <Analytics stats={stats} />;
        }
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-nav">
                <h2>Admin Dashboard</h2>
                <div className="admin-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <FaChartLine /> Analytics
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'food' ? 'active' : ''}`}
                        onClick={() => setActiveTab('food')}
                    >
                        <FaUtensils /> Food Items
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'tables' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tables')}
                    >
                        <FaChair /> Tables
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
                        onClick={() => setActiveTab('staff')}
                    >
                        <FaUsers /> Staff
                    </button>
                    <button 
                        className="tab-btn logout"
                        onClick={() => {
                            localStorage.removeItem('adminToken');
                            navigate('/admin/login');
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <div className="admin-content">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    renderContent()
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
