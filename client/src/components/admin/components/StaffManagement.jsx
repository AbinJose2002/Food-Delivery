import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import axios from 'axios';
import './StaffManagement.css';

const StaffManagement = () => {
    const { url } = useContext(StoreContext);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [staffPerformance, setStaffPerformance] = useState({});

    useEffect(() => {
        fetchStaff();
        fetchStaffPerformance();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await axios.get(`${url}/api/staff/list`, {
                headers: { token: localStorage.getItem('adminToken') }
            });
            setStaff(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const fetchStaffPerformance = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/dashboard`, {
                headers: { token: localStorage.getItem('adminToken') }
            });
            const performanceData = {};
            response.data.staffPerformance.forEach(staff => {
                performanceData[staff._id] = {
                    totalOrders: staff.totalOrders,
                    totalSales: staff.totalSales
                };
            });
            setStaffPerformance(performanceData);
        } catch (error) {
            console.error('Error fetching staff performance:', error);
        }
    };

    const handleStatusChange = async (staffId, newStatus) => {
        try {
            await axios.post(`${url}/api/staff/approve`, 
                { staffId, status: newStatus },
                { headers: { token: localStorage.getItem('adminToken') } }
            );
            fetchStaff();
        } catch (error) {
            console.error('Error updating staff status:', error);
        }
    };

    const filteredStaff = selectedStatus === 'all' 
        ? staff.filter(member => member.role !== 'admin')  // Filter out admins
        : staff.filter(member => member.status === selectedStatus && member.role !== 'admin');  // Filter by status and exclude admins

    return (
        <div className="staff-management">
            <div className="header-actions">
                <h2>Staff Management</h2>
                <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="status-filter"
                >
                    <option value="all">All Staff</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : filteredStaff.length > 0 ? (
                <div className="staff-grid">
                    {filteredStaff.map((member) => (
                        <div key={member._id} className={`staff-card ${member.status}`}>
                            <div className="staff-header">
                                <h3>{member.name}</h3>
                                <span className={`status-badge ${member.status}`}>
                                    {member.status}
                                </span>
                            </div>
                            <div className="staff-info">
                                <p><strong>Role:</strong> {member.role}</p>
                                <p><strong>Email:</strong> {member.email}</p>
                                <p><strong>Phone:</strong> {member.phone}</p>
                                <p><strong>Join Date:</strong> {new Date(member.joinDate).toLocaleDateString()}</p>
                                
                                {/* Add performance metrics */}
                                {staffPerformance[member._id] && (
                                    <div className="performance-stats">
                                        <h4>Performance</h4>
                                        <div className="stats-row">
                                            <div className="stat-item">
                                                <span className="stat-label">Orders Handled</span>
                                                <span className="stat-value">{staffPerformance[member._id].totalOrders}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Total Sales</span>
                                                <span className="stat-value">${staffPerformance[member._id].totalSales}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="staff-actions">
                                <select
                                    value={member.status}
                                    onChange={(e) => handleStatusChange(member._id, e.target.value)}
                                    className={`status-select ${member.status}`}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approve</option>
                                    <option value="rejected">Reject</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-staff-message">
                    No staff members found
                </div>
            )}
        </div>
    );
};

export default StaffManagement;
