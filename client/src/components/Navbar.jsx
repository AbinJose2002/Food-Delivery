import React from 'react'
import { BsCart } from "react-icons/bs";
import './css/Navbar.css'
import { Button } from '@mui/material';

export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light container">
  <h1><a className="navbar-brand" href="#">Tomato.</a></h1>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto d-flex justify-content-center align-items-center">
      <li className="nav-item active">
        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Menu</a>
      </li>
      
      <li className="nav-item">
        <a className="nav-link" href="#">Contact Us</a>
      </li>
    </ul>
     <div className="post-comp">
     <a className='px-4 cart-icon'> <BsCart /></a>
     <Button variant="outlined" color='warning'>SignUp</Button>
     </div>

  </div>
</nav>
    </div>
  )
}
