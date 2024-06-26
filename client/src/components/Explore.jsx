import React from 'react'
import './css/Explore.css'
import {menu_list} from '../assets/frontendAssets/assets'

export default function Explore({category,setCategory}) {
  return (
    <div className='container py-5' id='menu'>
        <h2 className="explore-head py-5">Explore</h2>
        <div className="menu-list d-flex">
          {
            menu_list.map((item,key)=>(
              <div onClick={()=> setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={key} className='menu-list-items mx-4'>
                <img className={category===item.menu_name?"active1":""} src={item.menu_image} alt="" />
                <h6 className='py-3'>{item.menu_name}</h6>
              </div>
            ))
          }
        </div>
        <hr />
    </div>
  )
}
