import React, { useContext, useState, useEffect, useNavigate } from 'react'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const Body = () => {
    const { getTotalCartAmount, token, url, foodList, cartItems } = useContext(StoreContext)
    const [data, setdata] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setdata(data=>({...data,[name]:value}))
    }

    const placeorder = async (event) => {
        event.preventDefault()
        const orderItem = []
        foodList.map((item)=>{
            if(cartItems[item._id]>0){
                let itemInfo = item
                itemInfo['quantity'] = cartItems[item._id]
                orderItem.push(itemInfo)
            }
        })
        const orderData = {
            address: data,
            items: orderItem,
            amount: getTotalCartAmount()+5
        }

        try {
            const response = await axios.post(`${url}/api/order/place`, orderData, {
                headers: { token }
            });
    
            if (response.data.success) {
                const { session_url } = response.data;
                console.log(session_url);
                if (session_url) {
                    // console.log('hello');
                    window.location.replace(session_url);
                } else {
                    console.error("Session URL is missing in the response.");
                }
            } else {
                console.error("Error placing order:", response.data.message);
            }
        } catch (error) {
            console.error("Error placing order:", error);
        }
    }
    

    return (
        <div className='container row mx-auto py-5'>
            <div className="container placeorder-left col-sm-12 col-lg-8">
                <h2 className="delivery-head">Delivery Information</h2>
                <form method="post" onSubmit={placeorder}>
                    <div className="info-name d-flex">
                        <input required type="text" name='firstName' className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="First Name" value={data.firstName} onChange={onChangeHandler}/>
                        <input required type="text" name='lastName' className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Last Name" value={data.lastName} onChange={onChangeHandler}/>
                    </div>
                    <br />
                    <input required type="email" className="form-control col-12" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email Address" name='email' value={data.email} onChange={onChangeHandler}/><br />
                    <input required type="text" className="form-control " id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Street" name='street' value={data.street} onChange={onChangeHandler}/><br />
                    <div className="info-city d-flex">
                        <input required type="text" className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="City" name='city' value={data.city} onChange={onChangeHandler}/>
                        <input required type="text" className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="State" name='state' value={data.state} onChange={onChangeHandler}/>
                    </div><br />
                    <div className="info-code d-flex">
                        <input required type="number" className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Zipcode" name='zipcode' value={data.zipcode} onChange={onChangeHandler}/>
                        <input required type="text" className="form-control col-6" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Country" name='country' value={data.country} onChange={onChangeHandler}/>
                    </div><br />
                    <input required type="number" className="form-control col-12" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Phone" name='phone' value={data.phone} onChange={onChangeHandler}/>
                    <input required type='submit' className="btn btn-checkout mt-3" value='Proceed To Payment'/>
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
                        <p>$ {getTotalCartAmount() + 5}</p>
                    </div><hr />
                    
                </div>
            </div>
        </div>
    )
}

export default Body
