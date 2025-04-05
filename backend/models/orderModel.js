import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    firstName: { type: String, required: function() { return this.parent().deliveryType === 'delivery'; } },
    lastName: { type: String, required: function() { return this.parent().deliveryType === 'delivery'; } },
    email: { type: String, required: function() { return this.parent().deliveryType === 'delivery'; } },
    street: { type: String, required: function() { return this.parent().deliveryType === 'delivery'; } },
    city: { type: String, required: function() { return this.parent().deliveryType === 'delivery'; } },
    state: { type: String, required: function() { return this.parent().deliveryType === 'delivery'; } },
    zipcode: { type: String, required: function() { return this.parent().deliveryType === 'delivery'; } },
    country: { type: String, required: function() { return this.parent().deliveryType === 'delivery'; } },
    phone: { type: String, required: true },
    pickupTime: { type: String, required: function() { return this.parent().deliveryType === 'takeaway'; } }
});

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: addressSchema, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
    deliveryType: { type: String, required: true, enum: ['delivery', 'takeaway'] },
    assignedTo: { 
        staffId: { type: String, default: null },
        staffName: { type: String, default: null },
        assignedAt: { type: Date }
    }
});

const orderModel = mongoose.models.orders || mongoose.model('orders', orderSchema);

export default orderModel;