import React, { useContext } from 'react'
import './CartBody.css'
import {StoreContext} from '../../context/StoreContext'
import CartItem from './CartItem'

const CartBody = () => {
    const { food_list, cartItems, removeItem } = useContext(StoreContext)
    return (
        <div className='container'>
            <div className="item-header-container">
                <ul className="item-header-list">
                    <li className="item-header-list-elements">Items</li>
                    <li className="item-header-list-elements">Title</li>
                    <li className="item-header-list-elements">Price</li>
                    <li className="item-header-list-elements">Quantity</li>
                    <li className="item-header-list-elements">Total</li>
                    <li className="item-header-list-elements">Remove</li>
                </ul>
                <hr />
                <div className="cart-items-container">
                    {food_list.map((item,index)=>{
                        if(cartItems[item._id]>0){
                            return (<div key={index}><CartItem id={item._id} name={item.name} img={item.image} price={item.price} quantity={cartItems[item._id]}/></div>)
                        }   
                    })}
                </div>
            </div>
        </div>
    )
}

export default CartBody
