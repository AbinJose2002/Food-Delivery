import React from 'react'
import './css/Home.css'

export default function Home() {
  return (
    <div className='container main-sec'>
        <h3 className='main-head1 col-lg-8'>Order Your Favorite Food Here</h3>
        <div className="row container mx-2">
        <button className="btn btn-menu"><a href="#menu" className='view-menu'>View Menu</a></button>
        </div>
    </div>
  )
}
