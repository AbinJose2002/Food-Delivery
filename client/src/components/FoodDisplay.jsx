import React, { useContext } from 'react'
import './css/FoodDisplay.css'
import { StoreContext } from '../context/StoreContext'
import FoodItems from './FoodItems'

const FoodDisplay = ({category}) => {
    const {foodList, url} = useContext(StoreContext)
    return (
        <div className="food-display container" id="food-display">
            <h2 className='py-4'>Top Dishes Near You</h2>
            <div className="food-list">
                {
                    foodList.map((item,index)=>{
                        if(category==="All" || category===item.category){

                            return (<FoodItems key={index} id={item._id} name={item.name} image={url+'/images/'+item.image} price={item.price} description={item.description} category={item.category}/>)
                        }
                    })
                }
            </div>
        </div>
    )
}

export default FoodDisplay
