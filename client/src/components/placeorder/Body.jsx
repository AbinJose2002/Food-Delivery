import React, { useContext, useState, useEffect, useNavigate } from 'react'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const Body = () => {
    const { getTotalCartAmount, token, url, foodList, cartItems } = useContext(StoreContext)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
        deliveryType: 'delivery', // Add default delivery type
        pickupTime: '', // Add this field
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }))
    }

    const placeorder = async (event) => {
        event.preventDefault()
        const orderItem = []
        foodList.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item
                itemInfo['quantity'] = cartItems[item._id]
                orderItem.push(itemInfo)
            }
        })
        const orderData = {
            address: formData,
            items: orderItem,
            amount: getTotalCartAmount() + (formData.deliveryType === 'delivery' ? 5 : 0),
            deliveryType: formData.deliveryType
        }

        try {
            const response = await axios.post(`${url}/api/order/place`, orderData, {
                headers: { token }
            });

            if (response.data.success) {
                const { session_url } = response.data;
                console.log(session_url);
                if (session_url) {
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
                <h2 className="delivery-head">
                    {formData.deliveryType === 'delivery' ? 'Delivery Information' : 'Takeaway Information'}
                </h2>
                <form method="post" onSubmit={placeorder}>
                    <div className="delivery-type mb-4">
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                className="form-check-input"
                                name="deliveryType"
                                id="delivery"
                                value="delivery"
                                checked={formData.deliveryType === 'delivery'}
                                onChange={onChangeHandler}
                            />
                            <label className="form-check-label" htmlFor="delivery">Home Delivery</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                className="form-check-input"
                                name="deliveryType"
                                id="takeaway"
                                value="takeaway"
                                checked={formData.deliveryType === 'takeaway'}
                                onChange={onChangeHandler}
                            />
                            <label className="form-check-label" htmlFor="takeaway">Takeaway</label>
                        </div>
                    </div>

                    {formData.deliveryType === 'delivery' ? (
                        <>
                            <div className="info-name d-flex">
                                <input
                                    type="text"
                                    name='firstName'
                                    className="form-control col-6"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={onChangeHandler}
                                    required
                                />
                                <input
                                    type="text"
                                    name='lastName'
                                    className="form-control col-6"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={onChangeHandler}
                                    required
                                />
                            </div>
                            <br />
                            <input
                                type="email"
                                className="form-control col-12"
                                placeholder="Email Address"
                                name='email'
                                value={formData.email}
                                onChange={onChangeHandler}
                                required
                            />
                            <br />
                            <input
                                type="text"
                                className="form-control "
                                placeholder="Street"
                                name='street'
                                value={formData.street}
                                onChange={onChangeHandler}
                                required
                            />
                            <br />
                            <div className="info-city d-flex">
                                <input
                                    type="text"
                                    className="form-control col-6"
                                    placeholder="City"
                                    name='city'
                                    value={formData.city}
                                    onChange={onChangeHandler}
                                    required
                                />
                                <input
                                    type="text"
                                    className="form-control col-6"
                                    placeholder="State"
                                    name='state'
                                    value={formData.state}
                                    onChange={onChangeHandler}
                                    required
                                />
                            </div>
                            <br />
                            <div className="info-code d-flex">
                                <input
                                    type="number"
                                    className="form-control col-6"
                                    placeholder="Zipcode"
                                    name='zipcode'
                                    value={formData.zipcode}
                                    onChange={onChangeHandler}
                                    required
                                />
                                <input
                                    type="text"
                                    className="form-control col-6"
                                    placeholder="Country"
                                    name='country'
                                    value={formData.country}
                                    onChange={onChangeHandler}
                                    required
                                />
                            </div>
                            <br />
                            <input
                                type="number"
                                className="form-control col-12"
                                placeholder="Phone"
                                name='phone'
                                value={formData.phone}
                                onChange={onChangeHandler}
                                required
                            />
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Phone Number"
                                    name='phone'
                                    value={formData.phone}
                                    onChange={onChangeHandler}
                                    required
                                />
                            </div>
                            <div className="form-group mt-3">
                                <input
                                    type="time"
                                    className="form-control"
                                    placeholder="Pickup Time"
                                    name='pickupTime'
                                    value={formData.pickupTime}
                                    onChange={onChangeHandler}
                                    required
                                />
                                <small className="text-muted">
                                    Please select your preferred pickup time (Store hours: 10:00 AM - 10:00 PM)
                                </small>
                            </div>
                        </>
                    )}

                    <input
                        type='submit'
                        className="btn btn-checkout mt-3"
                        value='Proceed To Payment'
                    />
                </form>
            </div>
            <div className="placeorder-right col-sm-12 col-lg-4 d-flex flex-column align-items-end py-sm-5 py-lg-0">
                <h2 className="placeorder-cart-totals">Cart Totals</h2>
                <div className="total-sec col-sm-12 col-lg-6">
                    <div className="subtotal container pt-3">
                        <p>Subtotal</p>
                        <p>$ {getTotalCartAmount()}</p>
                    </div><hr />
                    {formData.deliveryType === 'delivery' && (
                        <>
                            <div className="subtotal container pt-3">
                                <p>Delivery Fee</p>
                                <p>$ 5</p>
                            </div><hr />
                        </>
                    )}
                    <div className="subtotal container pt-3">
                        <p>Total</p>
                        <p>$ {getTotalCartAmount() + (formData.deliveryType === 'delivery' ? 5 : 0)}</p>
                    </div><hr />

                </div>
            </div>
        </div>
    )
}

export default Body
