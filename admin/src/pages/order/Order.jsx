import React from 'react';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Order.css';
import { assets } from '../../assets/assets.js';

const Order = () => {
  const url = 'http://localhost:8080';
  const [order, setOrder] = useState([]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${url}/api/order/listorders`);
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        toast.error('Error in fetching order!');
      }
    } catch (error) {
      toast.error('Error in fetching order');
    }
  };

  const statusHandler = async (event, order_id)=>{
    const response = await axios.post(url+'/api/order/update',{
      order_id,
      status: event.target.value
    })
    if(response.data.success){
      fetchOrder();
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="col-8 mx-auto px-4 py-4">
      <h2>Orders</h2>
      {order.map((orderItem) => (
        <div key={orderItem._id} className="order-container my-3 p-3 d-flex flex-wrap align-items-start">
          <div className="col-12 col-sm-2 mb-2 mb-sm-0 img-container">
            <img src={assets.parcel_icon} alt="Parcel icon" className="img-fluid" />
          </div>
          <div className="col-12 col-sm-4 d-flex flex-column mb-2 mb-sm-0">
            {orderItem.items.map((item, index) => (
              <span key={index} className="d-block">
                {item.name} x {item.quantity}
              </span>
            ))}
            <span>
              <b>Address:</b> {orderItem.address.firstName} {orderItem.address.lastName}<br/>
              {orderItem.address.city}<br/>
              {orderItem.address.street}<br/>
              {orderItem.address.phone}
            </span>
          </div>
          <div className="col-12 col-sm-2 mb-2 mb-sm-0">
            
            $ {orderItem.amount}
          </div>
          <div className="col-12 col-sm-2 mb-2 mb-sm-0 d-flex align-items-center justify-content-center">
            <select name="" id="" className='status' onChange={(event)=>statusHandler(event,orderItem._id)} value={orderItem.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Order;
