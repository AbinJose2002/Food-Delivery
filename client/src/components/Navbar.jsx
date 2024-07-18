import React, { useContext } from 'react';
import { BsCart } from "react-icons/bs";
import { Link } from 'react-router-dom';
import './css/Navbar.css';
import { Button } from '@mui/material';
import { StoreContext } from '../context/StoreContext';

export default function Navbar({ setShowLogin, showLogin }) {
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
              <Link className="nav-link" to="#menu">Menu</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#contact">Contact Us</Link>
            </li>
          </ul>
          <div className="post-comp">
            <Link className='px-4 cart-icon' to='/cart'><BsCart /></Link>
            {!token?
              <Button variant="outlined" color='warning' onClick={() => setShowLogin(!showLogin)}>SignUp</Button>:
              <div>hi</div>
            }
          </div>
        </div>
      </nav>
    </div>
  );
}
