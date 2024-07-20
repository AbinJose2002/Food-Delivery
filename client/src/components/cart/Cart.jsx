import React from 'react'
import Navbar from '../Navbar'
import CartBody from './CartBody'
import Footer from '../Footer'

const Cart = ({setShowLogin, showLogin}) => {
  return (
    <div className='cart'>
      <Navbar setShowLogin={setShowLogin} showLogin={showLogin} />
      <CartBody/>
      <Footer/>
    </div>
  )
}

export default Cart
