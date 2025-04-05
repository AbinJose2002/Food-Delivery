import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff' },
    phone: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

const staffModel = mongoose.models.staff || mongoose.model('staff', staffSchema);

export default staffModel;
