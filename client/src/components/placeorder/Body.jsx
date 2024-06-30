import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

const Body = () => {
    const {getTotalCartAmount} = useContext(StoreContext)
  return (
    <div className='container row mx-auto py-5'>
        <div className="container placeorder-left col-sm-12 col-lg-8">
            <h2 className="delivery-head">Delivery Information</h2>
            <form method="post" >
                <div className="info-name d-flex">
                <input type="text" className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="First Name"/>
                <input type="text" className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Last Name"/>
                </div>
                <br />
                <input type="email" className="form-control col-12" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email Address"/><br />
                <input type="text" className="form-control " id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Street"/><br />
                <div className="info-city d-flex">
                <input type="text" className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="City"/>
                <input type="text" className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="State"/>
                </div><br />
                <div className="info-code d-flex">
                <input type="number" className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Zipcode"/>
                <input type="text" className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Country"/>
                </div><br />
                <input type="number" className="form-control col-12" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Phone"/>
            </form>
        </div>
        <div className="placeorder-right col-sm-12 col-lg-4 d-flex flex-column align-items-end py-sm-5 py-lg-0">
            <h2 className="placeorder-cart-totals">Cart Totals</h2>
            <div className="total-sec col-sm-12 col-lg-6">
                    <div className="subtotal container pt-3">
                        <p>Subtotal</p> 
                        <p>$ {getTotalCartAmount()}</p>
                    </div><hr />
                    <div className="subtotal container pt-3">
                        <p>Delivery Fee</p>
                        <p>$ 5</p>
                    </div><hr />
                    <div className="subtotal container pt-3">
                        <p>Total</p>
                        <p>$ {getTotalCartAmount()+5}</p>
                    </div><hr />
                    <button className="btn btn-checkout" onClick={()=>navigate('/placeorder')} disabled={getTotalCartAmount()===0}>Proceed To Payment</button>
                </div>
        </div>
    </div>
  )
}

export default Body
