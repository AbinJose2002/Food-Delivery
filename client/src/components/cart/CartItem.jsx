import React from 'react'
import './CartBody.css'
import { assets } from '../../assets/frontendAssets/assets'

const CartItem = ({name, id, img, price, quantity}) => {
  return (
    <div key={id} >
      <ul className="item-header-list">
        <li className="item-header-list-elements"><img src={img} alt="" /></li>
        <li className="item-header-list-elements">{name}</li>
        <li className="item-header-list-elements">{price}</li>
        <li className="item-header-list-elements">{quantity}</li>
        <li className="item-header-list-elements">{quantity*price}</li>
        <li className="item-header-list-elements">Remove</li>
      </ul>
    </div>
  )
}

export default CartItem
