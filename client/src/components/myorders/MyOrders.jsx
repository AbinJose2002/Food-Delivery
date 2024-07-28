import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './MyOrder.css'
import { assets } from '../../assets/frontendAssets/assets';

export default function MyOrders() {
  const { url, token } = useContext(StoreContext);
  const [ordersData, setOrdersData] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

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

  return (
    <div>
      <Navbar />
      {isLoading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className='container col-10 mx-auto'>
          <h1 className='my-4'>Your Orders</h1>
          {ordersData.length > 0 ? (
            <ul>
              {ordersData.map((order) => (
                <div key={order._id} className='orderItem mt-3 col-12 d-flex justify-content-center align-items-center'>
                  <div className="col-1"><img src={assets.parcel_icon} alt="" /></div>
                  <div className='px-2 py-2 col-9 orderDetails d-flex'>
                    <div className="orderItems col-5 d-flex">
                      {order.items.map((item)=>{
                        if(order.items.length === 1){
                          return <span>{item.name} x {item.quantity}</span>
                        }else{
                          return <>{item.name} x {item.quantity}, </>
                        }
                      })}
                    </div>
                    <div className="price col-2">$ {order.amount}</div>
                    <div className="quantity col-2">$ Items: {order.items.length}</div>
                    <div className="status col-3 d-flex align-items-center justify-content-center"><div className="dot dot.color"></div>{order.status}</div>
                  </div>
                  <div className="col-2"><button className='btn-tomato'>Track Order</button></div>
                </div>
              ))}
            </ul>
          ) : (
            <p>You have no recent orders.</p>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}
