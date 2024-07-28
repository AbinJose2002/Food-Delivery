import React, { useContext, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const Verify = () => {
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);
  const [searchParams] = useSearchParams();

  const verifyPayment = async () => {
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    if (success === 'true') {
      try {
        const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
        if (response.data.success) {
          navigate('/myorders');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div>
      <Navbar />
      <Footer />
    </div>
  );
};

export default Verify;
