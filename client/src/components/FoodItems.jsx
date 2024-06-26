import React from 'react'
import { useState } from 'react'
import './css/FoodItems.css'
import { assets } from '../assets/frontendAssets/assets'

const FoodItems = ({_id,name,image,price,description,category}) => {
  const [itemcount, setitemcount] = useState(0)
  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img src={image} alt="aa" className='food-item-img'/>
        {
              !itemcount?
                <img className='add' onClick={()=>setitemcount(prev=>prev+1)} src={assets.add_icon_white} alt="a" />:
                <div className="food-item-counter py-3 ">
                  <img src={assets.remove_icon_red} alt=""  onClick={()=>setitemcount(prev=>prev-1)}/>
                  <p className='px-2 my-auto'>{itemcount}</p>
                  <img src={assets.add_icon_green} alt="" onClick={()=>setitemcount(prev=>prev+1)}/>
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
