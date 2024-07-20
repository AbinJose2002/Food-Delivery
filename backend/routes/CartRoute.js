import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { addItem, removeItem, getItem } from '../controllers/CartController.js'

const CartRoute = express.Router();

CartRoute.post("/add",authMiddleware,addItem)
CartRoute.post("/get",authMiddleware,getItem)
CartRoute.post("/remove",authMiddleware,removeItem)

export default CartRoute;