import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './MyOrder.css'
import { assets } from '../../assets/frontendAssets/assets';
import { FaTruck, FaShoppingBag } from 'react-icons/fa'; // Add this import

export default function MyOrders() {
  const { url, token } = useContext(StoreContext);
  const [ordersData, setOrdersData] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null); 

    try {
      const response = await axios.post(url + '/api/order/usersorders', {}, { headers: { token } });
      setOrdersData(response.data.data);
    } catch (error) {
      setError(error);
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getOrderTypeIcon = (type) => {
    if (!type) return null; // Add this null check
    return type === 'delivery' ? 
      <FaTruck className="me-1" /> : 
      <FaShoppingBag className="me-1" />;
  };

  const formatOrderType = (type) => {
    // Add a null check before attempting to use string methods
    if (!type) return 'N/A'; // Return a default value if type is undefined
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getFilteredOrders = () => {
    if (statusFilter === 'all') return ordersData;
    return ordersData.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
  };

  return (
    <div>
      <Navbar />
      {isLoading ? (
        <div className="text-center py-5">
          <div className="loading-spinner"></div>
          <p className="mt-3">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger m-4">Error: {error.message}</div>
      ) : (
        <div className='container col-10 mx-auto'>
          <div className="d-flex justify-content-between align-items-center my-4">
            <h1>Your Orders</h1>
            <div className="status-filter">
              <select 
                className="form-select" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="food processing">Processing</option>
                <option value="on the way">On The Way</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
          {getFilteredOrders().length > 0 ? (
            <ul>
              {getFilteredOrders().map((order) => (
                <div key={order._id} className='orderItem mt-3 col-12 d-flex justify-content-center align-items-center'>
                  <div className="col-1"><img src={assets.parcel_icon} alt="" /></div>
                  <div className='px-2 py-2 col-9 orderDetails d-flex'>
                    <div className="orderItems col-4 d-flex">
                      {order.items.map((item, idx)=>{
                        if(order.items.length === 1){
                          return <span key={idx}>{item.name} x {item.quantity}</span>
                        } else {
                          return <span key={idx}>{item.name} x {item.quantity}, </span>
                        }
                      })}
                    </div>
                    <div className="price col-2">$ {order.amount}</div>
                    <div className="quantity col-2">Items: {order.items.length}</div>
                    <div className="type col-2 d-flex align-items-center">
                      {getOrderTypeIcon(order.deliveryType)}
                      <span className={`badge ${order.deliveryType === 'delivery' ? 'bg-primary' : 'bg-success'}`}>
                        {formatOrderType(order.deliveryType)}
                      </span>
                    </div>
                    <div className="status col-2 d-flex align-items-center justify-content-center">
                      <span className="status-dot" style={{ 
                        color: order.status === "Delivered" ? "green" : 
                               order.status === "Food Processing" ? "orange" : "blue" 
                      }}>&#x25cf;</span>
                      {order.status}
                    </div>
                  </div>
                  <div className="col-2"><button className='btn-tomato'>Track Order</button></div>
                </div>
              ))}
            </ul>
          ) : (
            <p>No orders found for the selected status.</p>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}
