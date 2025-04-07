import express from 'express'
import cors from 'cors'
import { connection } from './config/db.js'
import { foodRoute } from './routes/FoodRoute.js'
import userRouter from './routes/UserRoute.js'
import 'dotenv/config'
import CartRoute from './routes/CartRoute.js'
import orderRoute from './routes/OrderRoute.js'
import reservationRoute from './routes/ReservationRoute.js'
import staffRoute from './routes/StaffRoute.js'
import adminRoute from './routes/AdminRoute.js'
import tableRoute from './routes/TableRoute.js'
const app = express()
const port = 8080

//middleware
app.use(express.json())
app.use(cors())

//db connection
connection()

//api endpoint for food router
app.use('/api/food',foodRoute)

//api endpoint for user router
app.use('/api/user',userRouter)

//api endpoint for cart router
app.use('/api/cart',CartRoute)

//api endpoint for order router
app.use('/api/order',orderRoute)

//api endpoint for reservation router
app.use('/api/reservation', reservationRoute);

//api endpoint for staff router
app.use('/api/staff', staffRoute);

//api endpoint for admin router
app.use('/api/admin', adminRoute);

//api endpoint for table router
app.use('/api/tables', tableRoute);

//api endpoint to set the static folder uploads at images followed by the image name
app.use('/images',express.static('uploads'))

app.get("/",(req,res)=>{
    res.send('hi')
})

app.listen(port,()=>{console.log(`server listening at port ${port}`)})

