import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true },
    location: { type: String, enum: ['indoor', 'outdoor'], default: 'indoor' },
    status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' }
});

const tableModel = mongoose.models.tables || mongoose.model('tables', tableSchema);

export default tableModel;
