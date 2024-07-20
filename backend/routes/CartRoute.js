import express from 'express'
import { addItem, removeItem, getItem } from '../controllers/CartController.js'

const CartRoute = express.Router();

CartRoute.post("/add",addItem)
CartRoute.post("/get",getItem)
CartRoute.post("/remove",removeItem)

export default CartRoute;