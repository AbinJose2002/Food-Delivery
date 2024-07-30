import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {placeOrder, orderVerify, userOrders, listOrders, updateStatus} from '../controllers/OrderController.js'

const orderRoute = express.Router()

orderRoute.post('/place',authMiddleware,placeOrder)
orderRoute.post('/verify',orderVerify)
orderRoute.post('/usersorders',authMiddleware,userOrders)
orderRoute.get('/listorders',listOrders)
orderRoute.post('/update',updateStatus)

export default orderRoute