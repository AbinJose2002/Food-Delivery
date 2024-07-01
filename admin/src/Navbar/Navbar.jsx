import React from 'react'
import './Navbar.css'
import { assets } from '../assets/assets'

const Navbar = () => {
    return (
        <>
            <div className='px-5 pt-3 d-flex justify-content-between'>
                <div className="navbar-logo">
                    <h1 className='navbar-head'>Tomato.</h1>
                    <p className='navbar-para'>Admin Panel</p>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <img src={assets.profile_image} alt="" className='profile-img' />
                </div>
            </div>
            <hr className='my-0 mx-4'/>
        </>
    )
}

export default Navbar
