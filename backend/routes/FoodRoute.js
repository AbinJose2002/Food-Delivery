import express from 'express'
import { addFood, listFood, deleteFood } from '../controllers/FoodController.js'
import multer from 'multer'

const foodRouter = express.Router()

//image storing, setting up multer
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req,file,cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: storage})

foodRouter.post('/add',upload.single('image'),addFood)
foodRouter.post('/delete',deleteFood)
foodRouter.get('/list',listFood)
export  {foodRouter}