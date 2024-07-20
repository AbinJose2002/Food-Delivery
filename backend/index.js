import express from 'express'
import cors from 'cors'
import { connection } from './config/db.js'
import { foodRouter } from './routes/FoodRoute.js'
import userRouter from './routes/UserRoute.js'
import 'dotenv/config'
import CartRoute from './routes/CartRoute.js'
const app = express()
const port = 8080

//middleware
app.use(express.json())
app.use(cors())

//db connection
connection()

//api endpoint for food router
app.use('/api/food',foodRouter)

//api endpoint for user router
app.use('/api/user',userRouter)

//api endpoint for cart router
app.use('/api/cart',CartRoute)

//api endpoint to set the static folder uploads at images followed by the image name
app.use('/images',express.static('uploads'))

app.get("/",(req,res)=>{
    res.send('hi')
})

app.listen(port,()=>{console.log(`server listening at port ${port}`)})

