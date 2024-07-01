import foodModel from "../models/FoodModel.js";
import fs from 'fs'

const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save()
        res.json({ success: true, message: 'food added' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'food not added' })
    }
}

const listFood = async (req, res) => {
    try {
        const food = await foodModel.find({})
        res.json({ success: true, data: food })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'error' })
    }
}

const deleteFood = async (req, res) => {
    try {
        console.log(req.body.id)
        const food = await foodModel.findById(req.body.id)
        console.log(food)
        fs.unlink(`uploads/${food.image}`, () => { })
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Food Removed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error in deleting food' })
    }
}

export { addFood, listFood, deleteFood }