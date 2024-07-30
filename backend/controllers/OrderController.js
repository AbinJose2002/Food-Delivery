import userModel from "../models/UserModel.js";
import orderModel from "../models/orderModel.js";
import Order from "../models/orderModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "https://food-delivery-frontend-vfyu.onrender.com";
    try {
        const newOrder = new Order({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100*80, // Assuming the price is in rupees
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 2 * 100*80, // Assuming delivery charges are in rupees
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error in placing order' });
    }
};

const orderVerify = async (req,res) => {
    const {orderId, success} = req.body
    try {
        if(success=='true'){
            await orderModel.findByIdAndUpdate(orderId,{payment:'true'})
            res.json({success:'true', message:'Paid'})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false,message:"Payment failed"})
        }   
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'Payment error'})
    }
}

const userOrders = async (req, res) => {
    try {
        const order = await orderModel.find({userId: req.body.userId})
        res.json({success:true, data: order})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Error in fetching orders!'})
    }
}

const listOrders = async (req,res) =>{
    try {
        const orders = await orderModel.find({})
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error in fetch order"})
    }
}

const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.order_id,{status:req.body.status})
        res.json({success:true, message:"Status Updated"})
    } catch (error) {
        console.log(error);
        resjson({success:false,message:"Status Update unsuccess"})
    }
}

export {placeOrder, orderVerify, userOrders, listOrders, updateStatus};
