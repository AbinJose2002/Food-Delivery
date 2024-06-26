import React from 'react'
import './css/Explore.css'
import {menu_list} from '../assets/frontendAssets/assets'

export default function Explore() {
  return (
    <div className='container py-5'>
        <h2 className="explore-head py-5">Explore</h2>
        <div className="menu-list d-flex">
          {
            menu_list.map((item,key)=>(
              <div key={key} className='menu-list-items mx-4'>
                <img src={item.menu_image} alt="" />
                <h6 className='py-2'>{item.menu_name}</h6>
              </div>
            ))
          }
        </div>

    </div>
  )
}
