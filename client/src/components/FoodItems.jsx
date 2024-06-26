import React, { useContext } from 'react'
import './css/FoodItems.css'
import { assets } from '../assets/frontendAssets/assets'
import { StoreContext } from '../context/StoreContext'

const FoodItems = ({id,name,image,price,description,category}) => {
  const {cartItems, addItem, removeItem} = useContext(StoreContext)
  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img src={image} alt="aa" className='food-item-img'/>
        {
              !cartItems[id]?
                <img className='add' onClick={()=>addItem(id)} src={assets.add_icon_white} alt="a" />:
                <div className="food-item-counter py-1 px-2 ">
                  <img src={assets.remove_icon_red} alt=""  onClick={()=>removeItem(id)}/>
                  <p className='px-2 my-auto'>{cartItems[id]}</p>
                  <img src={assets.add_icon_green} alt="" onClick={()=>addItem(id)}/>
                </div>
              
            }
        </div>
        <div className="food-item-info">
          <h3>{name}</h3>
          <img src={assets.rating_starts} alt="" />
          <p className='desc'>{description}</p>
          <h3 className='price'>$ {price}</h3>
        </div>
    </div>
  )
}

export default FoodItems
