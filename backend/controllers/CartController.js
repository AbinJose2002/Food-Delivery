import userModel from '../models/UserModel.js'

//add cart
const addItem = async (req,res) => {
    try {
        const userData = await userModel.findOne({_id:req.body.userId});
        const cartData = await userData.cartData
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1
        }else{
            cartData[req.body.itemId] += 1
        }
        await userModel.findOneAndUpdate({_id:req.body.userId},{cartData})
        res.json({success:true,message:"Item Added to cart"})
    } catch (error) {
        res.json({success:false,message:"Item Not Added to cart"})
        console.log(error);        
    }
}

//remove item
const removeItem = async (req,res) => {
    try {
        const userData = await userModel.findOne({_id:req.body.userId})
        const cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findOneAndUpdate({_id:req.body.userId},{cartData})
        res.json({success:true,message:"Item Deleted form cart"})
    } catch (error) {
        res.json({success:false,message:"Item Not Deleted from cart"})
        console.log(error);  
    }
}

//get items
const getItem = async (req,res) => {
    try {
        const userData = await userModel.findOne({_id:req.body.userId})
        const cartData = await userData.cartData;
        res.json({success:true,cartData})
    } catch (error) {
        res.json({success:false,message:"Error in fetching cart"})
        console.log(error);  
    }
}

export {addItem, removeItem, getItem};