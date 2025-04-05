import userModel from "../models/UserModel.js";
import orderModel from "../models/orderModel.js";
import Order from "../models/orderModel.js";
import staffModel from "../models/StaffModel.js"; // Add this import
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const INR_TO_USD = 0.012; // Current conversion rate (1 INR = 0.012 USD)

// Placing order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
        const { deliveryType } = req.body;
        
        // Validate based on delivery type
        if (deliveryType === 'delivery') {
            // Validate delivery address
            const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
            for (const field of requiredFields) {
                if (!req.body.address[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `Missing required field: ${field}`
                    });
                }
            }
        } else if (deliveryType === 'takeaway') {
            // Validate takeaway info
            if (!req.body.address.phone || !req.body.address.pickupTime) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone and pickup time are required for takeaway orders'
                });
            }
        }

        const newOrder = new Order({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            deliveryType: req.body.deliveryType,
        });

        // Convert prices from INR to USD cents (1 USD = 100 cents)
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "usd", // Changed to USD
                product_data: {
                    name: item.name,
                },
                // Convert INR to USD cents and ensure minimum amount
                unit_amount: Math.max(50, Math.round(item.price * INR_TO_USD * 100)),
            },
            quantity: item.quantity,
        }));

        if (req.body.deliveryType === 'delivery') {
            const deliveryFeeUSD = Math.round(5 * INR_TO_USD * 100); // Convert 5 INR delivery fee to USD cents
            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Delivery Charges",
                    },
                    unit_amount: Math.max(50, deliveryFeeUSD),
                },
                quantity: 1,
            });
        }

        // Calculate total amount in USD cents
        const totalAmount = line_items.reduce((sum, item) => 
            sum + (item.price_data.unit_amount * item.quantity), 0);

        // Ensure minimum amount requirement
        if (totalAmount < 50) {
            return res.status(400).json({ 
                success: false, 
                message: 'Order amount too small. Minimum order amount is $0.50.' 
            });
        }

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });
        
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error('Order creation error:', error);
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

const assignOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const staffDetails = await staffModel.findById(req.body.userId);
        
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.assignedTo.staffId) {
            return res.status(400).json({ success: false, message: 'Order already assigned' });
        }

        await orderModel.findByIdAndUpdate(orderId, {
            assignedTo: {
                staffId: staffDetails._id,
                staffName: staffDetails.name,
                assignedAt: new Date()
            },
            status: 'Food Processing'
        });

        res.json({ success: true, message: 'Order assigned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error assigning order' });
    }
};

export {placeOrder, orderVerify, userOrders, listOrders, updateStatus, assignOrder};
