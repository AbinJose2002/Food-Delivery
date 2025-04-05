import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    specialRequests: { type: String },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'] },
    createdAt: { type: Date, default: Date.now },
    assignedTable: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'tables' 
    }
});

const reservationModel = mongoose.models.reservations || mongoose.model('reservations', reservationSchema);

export default reservationModel;
