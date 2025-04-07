import express from 'express'
import { addFood, listFood, deleteFood, updateFood } from '../controllers/FoodController.js'
import multer from 'multer'
import authMiddleware from '../middleware/auth.js'

const foodRoute = express.Router()

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname;
            cb(null, uniqueFilename)
        }
    })
})

foodRoute.get('/list', listFood)
foodRoute.post('/add', upload.single('image'), addFood)
foodRoute.post('/delete', deleteFood)
// Add the new PUT endpoint for updating food items
foodRoute.put('/:id', upload.single('image'), updateFood)

export { foodRoute }