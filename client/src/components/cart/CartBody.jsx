import React, { useContext, useState, useEffect } from 'react'
import './CartBody.css'
import { StoreContext } from '../../context/StoreContext'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { assets } from '../../assets/frontendAssets/assets';
import { useNavigate } from 'react-router-dom';

const CartBody = () => {
    const { foodList, cartItems, removeItem, addItem, getTotalCartAmount, url } = useContext(StoreContext)
    const navigate = useNavigate()
    
    return (
        <div className='container'>
            <div className="item-header-container ">
                <hr />
                <div className="cart-items-container col-12">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Item</TableCell>
                                    <TableCell align="center">Title</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center">Remove</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {foodList.map((item, index) => {
                                    if (cartItems[item._id] > 0) {
                                        return (
                                            <TableRow key={item._id}>
                                                <TableCell align="center"><img className='item-img' src={url+'/images/'+item.image} alt="" /></TableCell>
                                                <TableCell align="center">{item.name}</TableCell>
                                                <TableCell align="center">{item.price}</TableCell>
                                                <TableCell align="center">{cartItems[item._id]}</TableCell>
                                                <TableCell align="center">
                                                    {Number(cartItems[item._id]) * Number(item.price)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <p onClick={()=>removeItem(item._id)} className="cross">x</p>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                    return null;
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            <div className="cart-bottom row">
                <div className="total-sec col-sm-12 col-lg-6">
                    <h2>Cart Total</h2>
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
                    <button className="btn btn-checkout" onClick={()=>navigate('/placeorder')} disabled={getTotalCartAmount()===0}>Proceed To Checkout</button>
                </div>
                <div className="promocode-sec col-sm-12 col-lg-6">
                    <p>If you have any promo code, Enter it here</p>
                    <div className="promo-form">
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Promo code"/>
                    <input type="submit" value="Submit" className="btn btn-promo" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartBody
