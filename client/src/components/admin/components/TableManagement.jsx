import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './TableManagement.css';

const TableManagement = () => {
    const { url } = useContext(StoreContext);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [formData, setFormData] = useState({
        tableNumber: '',
        capacity: '',
        location: 'indoor', // indoor/outdoor
        status: 'available' // available/occupied/reserved
    });

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await axios.get(`${url}/api/tables/list`);
            setTables(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedTable) {
                await axios.put(
                    `${url}/api/tables/${selectedTable._id}`, 
                    formData,
                    { headers: { token: localStorage.getItem('adminToken') } }
                );
            } else {
                await axios.post(
                    `${url}/api/tables/add`, 
                    formData,
                    { headers: { token: localStorage.getItem('adminToken') } }
                );
            }
            fetchTables();
            setShowForm(false);
            setSelectedTable(null);
            setFormData({
                tableNumber: '',
                capacity: '',
                location: 'indoor',
                status: 'available'
            });
        } catch (error) {
            console.error('Error saving table:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this table?')) {
            try {
                await axios.delete(
                    `${url}/api/tables/${id}`,
                    { headers: { token: localStorage.getItem('adminToken') } }
                );
                fetchTables();
            } catch (error) {
                console.error('Error deleting table:', error);
            }
        }
    };

    return (
        <div className="table-management">
            <div className="header-actions">
                <h2>Table Management</h2>
                <button className="add-btn" onClick={() => setShowForm(true)}>
                    <FaPlus /> Add New Table
                </button>
            </div>

            {showForm && (
                <div className="form-overlay">
                    <div className="table-form">
                        <h3>{selectedTable ? 'Edit Table' : 'Add New Table'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="number"
                                    placeholder="Table Number"
                                    value={formData.tableNumber}
                                    onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="number"
                                    placeholder="Capacity"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                >
                                    <option value="indoor">Indoor</option>
                                    <option value="outdoor">Outdoor</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="reserved">Reserved</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="save-btn">
                                    {selectedTable ? 'Update' : 'Save'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowForm(false);
                                        setSelectedTable(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="tables-grid">
                    {tables.map((table) => (
                        <div key={table._id} className={`table-card ${table.status}`}>
                            <div className="table-header">
                                <h3>Table {table.tableNumber}</h3>
                                <span className={`status-badge ${table.status}`}>
                                    {table.status}
                                </span>
                            </div>
                            <div className="table-info">
                                <p><strong>Capacity:</strong> {table.capacity} seats</p>
                                <p><strong>Location:</strong> {table.location}</p>
                            </div>
                            <div className="table-actions">
                                <button 
                                    className="edit-btn"
                                    onClick={() => {
                                        setSelectedTable(table);
                                        setFormData({
                                            tableNumber: table.tableNumber,
                                            capacity: table.capacity,
                                            location: table.location,
                                            status: table.status
                                        });
                                        setShowForm(true);
                                    }}
                                >
                                    <FaEdit />
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDelete(table._id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TableManagement;
