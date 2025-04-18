import React, { useContext } from 'react';
import { BsCart } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import './css/Navbar.css';
import { Button, Divider } from '@mui/material';  // Add Divider import
import { StoreContext } from '../context/StoreContext';
import { assets } from '../assets/frontendAssets/assets';
import { FaCalendar } from 'react-icons/fa'; // Add this import

export default function Navbar({ setShowLogin, showLogin }) {
  const navigate = useNavigate();
  const {token, settoken} = useContext(StoreContext)
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light container">
        <h1><Link className="navbar-brand" to="/">Tomato.</Link></h1>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto d-flex justify-content-center align-items-center">
            <li className="nav-item active">
              <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#menu" >Menu</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#contact">Contact Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reservation">Reservation</Link>
            </li>
          </ul>
          <div className="post-comp">
            <Link className='px-4 cart-icon' to='/cart'><BsCart /></Link>
            <div className="auth-buttons">
              {!localStorage.getItem('token') ? (
                <>
                  <Button 
                    variant="outlined" 
                    color='warning' 
                    onClick={() => setShowLogin(!showLogin)}
                    className="me-2"
                  >
                    SignUp
                  </Button>
                  {/* <Button 
                    variant="outlined" 
                    color='warning'
                    onClick={() => navigate('/staff/register')}
                    className="me-2"
                  >
                    Join as Staff
                  </Button> */}
                  <Button 
                    variant="contained" 
                    color='warning'
                    onClick={() => navigate('/staff/login')}
                  >
                    Staff Login
                  </Button>
                </>
              ) : (
                <div className='post-comp-logged'>
                  <img src={assets.profile_icon} alt="" className='profile-icon'/>
                  <div className="navbar-dropdown">
                    <ul>
                      <li onClick={()=>{navigate('/myorders')}} className='dropdown-img-container'><img src={assets.bag_icon} alt="" className='dropdown-img'/><p className='pl-2'>Orders</p></li>
                      <hr />
                      <li onClick={()=>{navigate('/myreservations')}} className='dropdown-img-container'><FaCalendar className='dropdown-img'/><p className='pl-2'>My Reservations</p></li>
                      <hr />
                      <li onClick={()=>{localStorage.removeItem('token');navigate('/');settoken('')}} className='dropdown-img-container'><img src={assets.logout_icon} alt="" className='dropdown-img' /><p className='pl-2'>Log Out</p></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
