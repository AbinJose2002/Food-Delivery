import express from 'express'
import { userLogin, userRegister } from '../controllers/UserController.js'

const userRouter = express.Router()

userRouter.post('/login',userLogin)

export default userRouter