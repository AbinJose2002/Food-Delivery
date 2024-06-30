import React from 'react'
import Navbar from '../Navbar'
import CartBody from './CartBody'
import Footer from '../Footer'

const Cart = () => {
  return (
    <div className='cart'>
      <Navbar/>
      <CartBody/>
      <Footer/>
    </div>
  )
}

export default Cart
