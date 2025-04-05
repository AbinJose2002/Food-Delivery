import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { FaClipboardList, FaCalendarAlt, FaSignOutAlt, FaChair, FaUtensils } from 'react-icons/fa';
import jsPDF from 'jspdf';
import './StaffDashboard.css';

const StaffDashboard = () => {
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [viewType, setViewType] = useState('unassigned');
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const staffToken = localStorage.getItem('staffToken');
    const staffId = localStorage.getItem('staffId');
    const staffName = localStorage.getItem('staffName');
    const [dateFilter, setDateFilter] = useState('all');
    const [availableTables, setAvailableTables] = useState([]);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [foods, setFoods] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [bill, setBill] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [allTables, setAllTables] = useState([]);
    const [tableStatusFilter, setTableStatusFilter] = useState('all');
    const [activeOrders, setActiveOrders] = useState(() => {
        const savedOrders = localStorage.getItem('activeOrders');
        return savedOrders ? JSON.parse(savedOrders) : {};
    });
    const [showBillModal, setShowBillModal] = useState(false);
    const [currentBillTable, setCurrentBillTable] = useState(null);

    useEffect(() => {
        if (!staffToken || !staffId) {
            navigate('/staff/login');
        }
        fetchData();
    }, [staffToken, activeTab]);

    useEffect(() => {
        if (activeTab === 'reservations' || activeTab === 'order') {
            fetchAvailableTables();
        }
        if (activeTab === 'order') {
            fetchFoods();
        }
        if (activeTab === 'tables') {
            fetchAllTables();
        }
    }, [activeTab]);

    useEffect(() => {
        localStorage.setItem('activeOrders', JSON.stringify(activeOrders));
    }, [activeOrders]);

    const fetchData = async () => {
        try {
            if (activeTab === 'orders') {
                const response = await axios.get(`${url}/api/order/listorders`, {
                    headers: { token: staffToken }
                });
                setOrders(response.data.data);
            } else if (activeTab === 'reservations') {
                const response = await axios.get(`${url}/api/reservation/list`, {
                    headers: { token: staffToken }
                });
                setReservations(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableTables = async () => {
        try {
            const response = await axios.get(`${url}/api/tables/list`);
            const availableTables = response.data.data.filter(table => table.status === 'available');
            setAvailableTables(availableTables);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const fetchFoods = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoods(response.data.data);
        } catch (error) {
            console.error('Error fetching foods:', error);
        }
    };

    const fetchAllTables = async () => {
        try {
            const response = await axios.get(`${url}/api/tables/list`);
            setAllTables(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleStatusUpdate = async (id, newStatus, type) => {
        try {
            const endpoint = type === 'order' ? 
                'order/update' : 'reservation/update';
            
            let tableId = null;
            if (type === 'reservation') {
                const reservation = reservations.find(r => r._id === id);
                if (reservation?.assignedTable) {
                    tableId = reservation.assignedTable._id;
                }
            }
            
            await axios.post(`${url}/api/${endpoint}`, {
                [type === 'order' ? 'order_id' : 'reservationId']: id,
                status: newStatus
            }, {
                headers: { token: staffToken }
            });
            
            if (type === 'reservation' && newStatus === 'Confirmed' && tableId) {
                await axios.post(`${url}/api/tables/${tableId}`, { status: 'reserved' });
            }
            
            if (type === 'reservation' && newStatus === 'Cancelled' && tableId) {
                await axios.post(`${url}/api/tables/${tableId}`, { status: 'available' });
            }
            
            fetchData();
            fetchAvailableTables();
            if (activeTab === 'tables') {
                fetchAllTables();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssignOrder = async (orderId) => {
        try {
            const response = await axios.post(
                `${url}/api/order/assign`,
                { orderId },
                { headers: { token: staffToken }
            });
            if (response.data.success) {
                fetchData();
            }
        } catch (error) {
            console.error('Error assigning order:', error);
        }
    };

    const handleTableAssign = async (reservationId, tableId) => {
        try {
            const reservation = reservations.find(r => r._id === reservationId);
            
            const response = await axios.post(
                `${url}/api/reservation/assign-table`,
                { reservationId, tableId },
                { headers: { token: staffToken } }
            );
            
            if (response.data.success) {
                setReservations(reservations.map(res => {
                    return res._id === reservationId 
                        ? { ...res, assignedTable: response.data.data.assignedTable }
                        : res;
                }));
                
                if (reservation.status === 'Confirmed') {
                    await axios.post(`${url}/api/tables/${tableId}`, { status: 'reserved' });
                }
                
                fetchAvailableTables();
                if (activeTab === 'tables') {
                    fetchAllTables();
                }
            }
        } catch (error) {
            console.error('Error assigning table:', error);
        }
    };

    const updateTableStatus = async (tableId, newStatus) => {
        try {
            await axios.post(
                `${url}/api/tables/${tableId}`, 
                { status: newStatus }
            );
            
            fetchAllTables();
            
            if (activeTab === 'order') {
                fetchAvailableTables();
            }
        } catch (error) {
            console.error('Error updating table status:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('staffToken');
        localStorage.removeItem('staffRole');
        navigate('/staff/login');
    };

    const getFilteredOrders = (orders) => {
        let filteredOrders = orders.filter(order => {
            if (viewType === 'unassigned') {
                return !order.assignedTo?.staffId;
            } else {
                return order.assignedTo?.staffId === staffId;
            }
        });

        if (dateFilter !== 'all') {
            const today = new Date();
            const orderDate = new Date();
            
            switch(dateFilter) {
                case 'today':
                    filteredOrders = filteredOrders.filter(order => {
                        const orderDate = new Date(order.date);
                        return orderDate.toDateString() === today.toDateString();
                    });
                    break;
                case 'week':
                    const weekAgo = new Date(today.setDate(today.getDate() - 7));
                    filteredOrders = filteredOrders.filter(order => {
                        return new Date(order.date) >= weekAgo;
                    });
                    break;
                case 'month':
                    const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                    filteredOrders = filteredOrders.filter(order => {
                        return new Date(order.date) >= monthAgo;
                    });
                    break;
            }
        }

        return filteredOrders;
    };

    const getFilteredTables = () => {
        if (tableStatusFilter === 'all') {
            return allTables;
        } else {
            return allTables.filter(table => table.status === tableStatusFilter);
        }
    };

    const renderOrderDetails = (order) => {
        if (order.deliveryType === 'delivery') {
            return (
                <div className="delivery-address">
                    <h4>Delivery Address:</h4>
                    <p>{order.address.firstName} {order.address.lastName}</p>
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                    <p>{order.address.country}</p>
                    <p><strong>Phone:</strong> {order.address.phone}</p>
                </div>
            );
        } else if (order.deliveryType === 'takeaway') {
            return (
                <div className="takeaway-info">
                    <h4>Takeaway Details:</h4>
                    <p><strong>Name:</strong> {order.address.firstName}</p>
                    <p><strong>Phone:</strong> {order.address.phone}</p>
                    <p><strong>Pickup Time:</strong> {order.address.pickupTime}</p>
                </div>
            );
        }
        return null;
    };

    const addToOrder = (food) => {
        if (!selectedTable) return;
        
        setActiveOrders(prev => {
            const tableId = selectedTable._id;
            const tableOrders = prev[tableId] || [];
            
            const existingItemIndex = tableOrders.findIndex(item => item._id === food._id);
            
            if (existingItemIndex > -1) {
                const updatedOrders = [...tableOrders];
                updatedOrders[existingItemIndex] = {
                    ...updatedOrders[existingItemIndex],
                    quantity: updatedOrders[existingItemIndex].quantity + 1
                };
                return { ...prev, [tableId]: updatedOrders };
            } else {
                return { 
                    ...prev, 
                    [tableId]: [...tableOrders, { ...food, quantity: 1 }] 
                };
            }
        });
    };

    const updateOrderQuantity = (tableId, foodId, quantity) => {
        setActiveOrders(prev => {
            const tableOrders = [...(prev[tableId] || [])];
            
            if (quantity <= 0) {
                return { 
                    ...prev, 
                    [tableId]: tableOrders.filter(item => item._id !== foodId) 
                };
            } else {
                return { 
                    ...prev, 
                    [tableId]: tableOrders.map(item => 
                        item._id === foodId ? { ...item, quantity } : item
                    )
                };
            }
        });
    };

    const calculateTableTotal = (tableId) => {
        const items = activeOrders[tableId] || [];
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const completeMeal = async () => {
        if (!currentBillTable) return;
        
        const tableId = currentBillTable._id;
        
        try {
            // Update the table status to available
            await axios.post(
                `${url}/api/tables/${tableId}`, 
                { status: 'available' }
            );
            
            // Generate PDF bill
            const doc = new jsPDF();
            
            doc.setFontSize(20);
            doc.text('Restaurant Bill', 20, 20);
            
            doc.setFontSize(12);
            doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);
            doc.text(`Table: ${currentBillTable.tableNumber}`, 20, 40);
            doc.text(`Server: ${staffName}`, 20, 50);
            
            let y = 70;
            doc.text('Item', 20, y);
            doc.text('Qty', 100, y);
            doc.text('Price', 140, y);
            doc.text('Total', 180, y);
            
            y += 10;
            const items = activeOrders[tableId] || [];
            items.forEach(item => {
                y += 10;
                doc.text(item.name, 20, y);
                doc.text(item.quantity.toString(), 100, y);
                doc.text(`$${item.price}`, 140, y);
                doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 180, y);
            });
            
            y += 20;
            doc.text(`Total Amount: $${calculateTableTotal(tableId).toFixed(2)}`, 140, y);
            
            doc.save(`bill-table${currentBillTable.tableNumber}-${Date.now()}.pdf`);
            
            // Clear the active orders for this table
            setActiveOrders(prev => {
                const updated = { ...prev };
                delete updated[tableId];
                return updated;
            });
            
            // Close the bill modal
            setShowBillModal(false);
            setCurrentBillTable(null);
            
            // Refresh available tables
            fetchAvailableTables();
            if (activeTab === 'tables') {
                fetchAllTables();
            }
        } catch (error) {
            console.error('Error completing meal:', error);
        }
    };

    const openBillModal = (table) => {
        setCurrentBillTable(table);
        setShowBillModal(true);
    };

    const renderOrderSection = () => (
        <div className="order-section">
            <div className="table-selection">
                <h3>Select Table</h3>
                <div className="table-tabs">
                    <button 
                        className={`table-tab-btn ${!selectedTable ? 'active' : ''}`}
                        onClick={() => setSelectedTable(null)}
                    >
                        All Tables
                    </button>
                    <button
                        className={`table-tab-btn active-orders ${Object.keys(activeOrders).length > 0 ? 'has-orders' : ''}`}
                        onClick={() => setSelectedTable(null)}
                    >
                        Active Orders ({Object.keys(activeOrders).length})
                    </button>
                </div>
                
                {availableTables.length === 0 ? (
                    <div className="no-tables-message">
                        No tables are currently available
                    </div>
                ) : (
                    <div className="available-tables">
                        {availableTables.map(table => {
                            const hasActiveOrder = activeOrders[table._id]?.length > 0;
                            
                            return (
                                <button
                                    key={table._id}
                                    className={`table-btn ${table.status} ${selectedTable?._id === table._id ? 'selected' : ''} ${hasActiveOrder ? 'has-active-order' : ''}`}
                                    onClick={() => setSelectedTable(table)}
                                >
                                    {hasActiveOrder && <div className="active-order-indicator">{activeOrders[table._id].length} items</div>}
                                    <span className={`table-status ${table.status}`}>
                                        {table.status}
                                    </span>
                                    <div className="table-info">
                                        <div className="table-number">Table {table.tableNumber}</div>
                                        <span className="table-capacity">{table.capacity} seats</span>
                                        <span className="table-location">{table.location}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedTable && (
                <>
                    <div className="order-items-section">
                        <h3>Add Items to Order - Table {selectedTable.tableNumber}</h3>
                        <div className="menu-categories">
                            {['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'].map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="food-grid">
                            {foods
                                .filter(food => activeCategory === 'All' || food.category === activeCategory)
                                .map(food => (
                                    <div key={food._id} className="food-item" onClick={() => addToOrder(food)}>
                                        <img src={`${url}/images/${food.image}`} alt={food.name} />
                                        <div className="food-details">
                                            <h4>{food.name}</h4>
                                            <p>${food.price}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {(activeOrders[selectedTable._id] || []).length > 0 && (
                        <div className="active-order-summary">
                            <h3>Current Order - Table {selectedTable.tableNumber}</h3>
                            <div className="order-items">
                                {activeOrders[selectedTable._id].map(item => (
                                    <div key={item._id} className="order-item">
                                        <span>{item.name}</span>
                                        <div className="quantity-control">
                                            <button onClick={() => updateOrderQuantity(selectedTable._id, item._id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateOrderQuantity(selectedTable._id, item._id, item.quantity + 1)}>+</button>
                                        </div>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                <h4>Table {selectedTable.tableNumber} Total: ${calculateTableTotal(selectedTable._id).toFixed(2)}</h4>
                                <button 
                                    className="complete-meal-btn"
                                    onClick={() => openBillModal(selectedTable)}
                                >
                                    Complete Meal & Generate Bill
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {!selectedTable && Object.keys(activeOrders).length > 0 && (
                <div className="all-active-orders">
                    <h3>All Active Orders</h3>
                    <div className="active-orders-grid">
                        {Object.entries(activeOrders).map(([tableId, items]) => {
                            const table = availableTables.find(t => t._id === tableId);
                            if (!table || items.length === 0) return null;
                            
                            return (
                                <div key={tableId} className="active-order-card">
                                    <div className="active-order-header">
                                        <h4>Table {table.tableNumber}</h4>
                                        <span>{items.length} items</span>
                                    </div>
                                    <div className="active-order-items">
                                        {items.map(item => (
                                            <div key={item._id} className="active-order-item">
                                                <span>{item.name}</span>
                                                <span>x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="active-order-footer">
                                        <p>Total: ${calculateTableTotal(tableId).toFixed(2)}</p>
                                        <div className="active-order-actions">
                                            <button 
                                                className="view-table-btn"
                                                onClick={() => setSelectedTable(table)}
                                            >
                                                View Table
                                            </button>
                                            <button 
                                                className="complete-btn"
                                                onClick={() => openBillModal(table)}
                                            >
                                                Complete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {showBillModal && currentBillTable && (
                <div className="bill-modal-overlay">
                    <div className="bill-modal">
                        <h3>Generate Bill for Table {currentBillTable.tableNumber}</h3>
                        <div className="bill-items-preview">
                            {activeOrders[currentBillTable._id].map(item => (
                                <div key={item._id} className="bill-item">
                                    <span>{item.name}</span>
                                    <span>x{item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="bill-total">
                                Total: ${calculateTableTotal(currentBillTable._id).toFixed(2)}
                            </div>
                        </div>
                        <div className="bill-actions">
                            <button 
                                className="cancel-bill-btn"
                                onClick={() => {
                                    setShowBillModal(false);
                                    setCurrentBillTable(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="confirm-bill-btn"
                                onClick={completeMeal}
                            >
                                Confirm & Generate Bill
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderTablesSection = () => (
        <div className="tables-section">
            <h3>Manage Tables</h3>
            <div className="table-status-filter">
                <select 
                    value={tableStatusFilter} 
                    onChange={(e) => setTableStatusFilter(e.target.value)}
                    className="status-select"
                >
                    <option value="all">All Tables</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="occupied">Occupied</option>
                </select>
            </div>
            <div className="tables-grid">
                {getFilteredTables().map(table => (
                    <div key={table._id} className="table-card">
                        <div className="table-header">
                            <h4>Table {table.tableNumber}</h4>
                            <span className={`status-badge ${table.status.toLowerCase()}`}>
                                {table.status}
                            </span>
                        </div>
                        <div className="table-details">
                            <p><strong>Capacity:</strong> {table.capacity} seats</p>
                            <p><strong>Location:</strong> {table.location}</p>
                        </div>
                        <div className="table-actions">
                            <select 
                                onChange={(e) => updateTableStatus(table._id, e.target.value)}
                                value={table.status}
                                className="status-select"
                            >
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="occupied">Occupied</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderReservationsSection = () => (
        <div className="reservations-section">
            <h3>Table Reservations</h3>
            <div className="reservations-grid">
                {reservations.map(reservation => (
                    <div key={reservation._id} className="reservation-card">
                        <div className="reservation-header">
                            <h4>{reservation.name}</h4>
                            <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                                {reservation.status}
                            </span>
                        </div>
                        <div className="reservation-details">
                            <p><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {reservation.time}</p>
                            <p><strong>Guests:</strong> {reservation.guests}</p>
                            <p><strong>Phone:</strong> {reservation.phone}</p>
                            {reservation.assignedTable && (
                                <p className="assigned-table">
                                    <strong>Assigned Table:</strong> Table {reservation.assignedTable.tableNumber} 
                                    ({reservation.assignedTable.capacity} seats - {reservation.assignedTable.location})
                                </p>
                            )}
                        </div>
                        <div className="reservation-actions">
                            <select 
                                onChange={(e) => handleStatusUpdate(reservation._id, e.target.value, 'reservation')}
                                value={reservation.status}
                                className="status-select"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirm</option>
                                <option value="Cancelled">Cancel</option>
                                <option value="Completed">Complete</option>
                            </select>

                            {reservation.status === 'Confirmed' && !reservation.assignedTable && (
                                <select 
                                    onChange={(e) => handleTableAssign(reservation._id, e.target.value)}
                                    className="table-select"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Assign Table</option>
                                    {availableTables
                                        .filter(table => table.capacity >= reservation.guests)
                                        .map(table => (
                                            <option key={table._id} value={table._id}>
                                                Table {table.tableNumber} ({table.capacity} seats)
                                            </option>
                                        ))
                                    }
                                </select>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="staff-dashboard">
            <nav className="dashboard-nav">
                <div className="nav-header">
                    <h2>Staff Dashboard</h2>
                    <p className="welcome-message">Welcome, {staffName}!</p>
                </div>
                <div className="nav-buttons">
                    <button 
                        className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <FaClipboardList /> Orders
                    </button>
                    <button 
                        className={`nav-btn ${activeTab === 'reservations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reservations')}
                    >
                        <FaCalendarAlt /> Reservations
                    </button>
                    <button 
                        className={`nav-btn ${activeTab === 'order' ? 'active' : ''}`}
                        onClick={() => setActiveTab('order')}
                    >
                        <FaUtensils /> Take Order
                    </button>
                    <button 
                        className={`nav-btn ${activeTab === 'tables' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tables')}
                    >
                        <FaChair /> Tables
                    </button>
                    <button className="nav-btn logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </nav>

            {activeTab === 'orders' && (
                <div className="filter-controls">
                    <div className="order-view-toggle">
                        <button 
                            className={`view-btn ${viewType === 'unassigned' ? 'active' : ''}`}
                            onClick={() => setViewType('unassigned')}
                        >
                            New Orders
                        </button>
                        <button 
                            className={`view-btn ${viewType === 'myorders' ? 'active' : ''}`}
                            onClick={() => setViewType('myorders')}
                        >
                            My Orders
                        </button>
                    </div>
                    <div className="date-filter">
                        <select 
                            value={dateFilter} 
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="date-select"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                        </select>
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : activeTab === 'orders' ? (
                    <div className="orders-section">
                        <h3>{viewType === 'unassigned' ? 'New Orders' : 'My Orders'}</h3>
                        <div className="orders-grid">
                            {getFilteredOrders(orders).map(order => (
                                <div key={order._id} className="order-card">
                                    <div className="order-header">
                                        <span className="order-id">Order #{order._id.slice(-6)}</span>
                                        <span className={`status ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="order-details">
                                        <div className="order-type">
                                            <p><strong>Type:</strong> {order.deliveryType}</p>
                                            {renderOrderDetails(order)}
                                        </div>
                                        <p><strong>Amount:</strong> ${order.amount}</p>
                                        <p><strong>Items:</strong></p>
                                        <ul>
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>{item.name} x {item.quantity}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="order-actions">
                                        {!order.assignedTo?.staffId ? (
                                            <button
                                                className="btn-assign"
                                                onClick={() => handleAssignOrder(order._id)}
                                            >
                                                Accept Order
                                            </button>
                                        ) : (
                                            <p className="assigned-info">
                                                Assigned to: {order.assignedTo.staffName}
                                                {order.assignedTo.staffId === staffId && " (You)"}
                                            </p>
                                        )}
                                        {order.assignedTo?.staffId === staffId && (
                                            <select 
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value, 'order')}
                                                value={order.status}
                                            >
                                                <option value="Food Processing">Processing</option>
                                                <option value="On The Way">On The Way</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : activeTab === 'reservations' ? (
                    renderReservationsSection()
                ) : activeTab === 'tables' ? (
                    renderTablesSection()
                ) : (
                    renderOrderSection()
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;
