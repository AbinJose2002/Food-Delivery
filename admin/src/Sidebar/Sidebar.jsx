import React from 'react'
import { assets } from '../assets/assets'
import './Sidebar.css'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='col-2 sidebar'>
        <div className="sidebar-options d-flex flex-column py-4 px-4">
            <Link to='/add' className="sidebar-option d-flex py-3">
                <img src={assets.add_icon} alt="" />
                <p className='px-2'>Add Item</p>
            </Link>
            <Link to='/list' className="sidebar-option d-flex py-3">
                <img src={assets.order_icon}  alt="" />
                <p className='px-2'>List Item</p>
            </Link>
            <Link to='order' className="sidebar-option d-flex py-3">
                <img src={assets.order_icon} alt="" />
                <p className='px-2'>Orders</p>
            </Link>
        </div>
    </div>
  )
}

export default Sidebar
