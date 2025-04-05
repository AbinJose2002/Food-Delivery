import React from 'react';
import { 
    FaShoppingBag, 
    FaUsers, 
    FaDollarSign, 
    FaChartLine 
} from 'react-icons/fa';

const Analytics = ({ stats }) => {
    return (
        <div className="analytics">
            <div className="dashboard-grid">
                <div className="stats-section">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaDollarSign />
                            </div>
                            <div className="stat-content">
                                <h3>Total Sales</h3>
                                <p className="stat-value">${stats.totalSales.toFixed(2)}</p>
                                <span className="stat-label">Revenue</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaShoppingBag />
                            </div>
                            <div className="stat-content">
                                <h3>Total Orders</h3>
                                <p className="stat-value">{stats.totalOrders}</p>
                                <span className="stat-label">Orders Processed</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaUsers />
                            </div>
                            <div className="stat-content">
                                <h3>Active Staff</h3>
                                <p className="stat-value">{stats.activeStaff}</p>
                                <span className="stat-label">Team Members</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-widgets">
                    <div className="widget">
                        <h3>Popular Items</h3>
                        <div className="items-list">
                            {stats.popularItems.map((item, index) => (
                                <div key={item._id} className="popular-item">
                                    <span className="rank">{index + 1}</span>
                                    <div className="item-details">
                                        <h4>{item._id}</h4>
                                        <p>Orders: {item.totalOrders} | Revenue: ${item.revenue.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="widget">
                        <h3>Recent Orders</h3>
                        <div className="orders-list">
                            {stats.recentOrders.map(order => (
                                <div key={order._id} className="recent-order">
                                    <div className="order-info">
                                        <h4>Order #{order._id.slice(-6)}</h4>
                                        <p>${order.amount.toFixed(2)}</p>
                                    </div>
                                    <span className={`order-status ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
