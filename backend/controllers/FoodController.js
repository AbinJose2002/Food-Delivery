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
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: 'Food not found' });
        }

        const filePath = `uploads/${food.image}`;
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting image:', err);
            } else {
                console.log('Image deleted successfully');
            }
        });

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: 'Food Removed' });
    } catch (error) {
        console.error('Error deleting food:', error);
        res.json({ success: false, message: 'Error in deleting food' });
    }
};

const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await foodModel.findById(id);
        
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food not found' });
        }
        
        // Update data
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category
        };
        
        // If there's a new image, update it and delete the old one
        if (req.file) {
            updateData.image = req.file.filename;
            
            // Delete old image
            const oldImagePath = `uploads/${food.image}`;
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Error deleting old image:', err);
                } else {
                    console.log('Old image deleted successfully');
                }
            });
        }
        
        const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true });
        
        res.json({ 
            success: true, 
            message: 'Food updated successfully',
            data: updatedFood 
        });
    } catch (error) {
        console.error('Error updating food:', error);
        res.status(500).json({ success: false, message: 'Error updating food' });
    }
};

export { addFood, listFood, deleteFood, updateFood }