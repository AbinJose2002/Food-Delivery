import React from 'react'
import './css/Home.css'

export default function Home() {
  return (
    <div className='container main-sec'>
        <h1 className='main-head'>Order Your <br/>Favorite Food Here</h1>
        <p className="main-para text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius dolorum inventore adipisci ipsum consequuntur quo tenetur nisi, placeat sequi possimus autem dignissimos voluptatem corrupti ex perspiciatis natus dolore. Error, ea.</p>
        <div className="row">
        <button className="btn btn-menu"><a href="#" className='view-menu'>View Menu</a></button>
        </div>
    </div>
  )
}
