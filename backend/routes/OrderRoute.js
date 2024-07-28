import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {placeOrder, orderVerify, userOrders} from '../controllers/OrderController.js'

const orderRoute = express.Router()

orderRoute.post('/place',authMiddleware,placeOrder)
orderRoute.post('/verify',orderVerify)
orderRoute.post('/usersorders',authMiddleware,userOrders)

export default orderRoute