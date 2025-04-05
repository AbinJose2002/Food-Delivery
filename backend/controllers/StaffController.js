import staffModel from '../models/StaffModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const staffRegister = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        
        const existingStaff = await staffModel.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStaff = new staffModel({
            name,
            email,
            password: hashedPassword,
            role,
            phone
        });

        await newStaff.save();
        res.json({ success: true, message: 'Staff registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error in staff registration' });
    }
};

const staffLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const staff = await staffModel.findOne({ email });

        if (!staff) {
            return res.status(400).json({ success: false, message: 'Staff not found' });
        }

        if (staff.status === 'pending') {
            return res.status(400).json({ success: false, message: 'Your account is pending approval' });
        }

        if (staff.status === 'rejected') {
            return res.status(400).json({ success: false, message: 'Your registration was not approved' });
        }

        if (!staff.isActive) {
            return res.status(400).json({ success: false, message: 'Account is deactivated' });
        }

        const validPassword = await bcrypt.compare(password, staff.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: staff._id, role: staff.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ 
            success: true, 
            token, 
            staffData: { 
                id: staff._id,    // Add id to response
                name: staff.name, 
                role: staff.role 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error in staff login' });
    }
};

const approveStaff = async (req, res) => {
    try {
        const { staffId, status } = req.body;
        const admin = await staffModel.findById(req.body.userId);
        
        if (admin.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admins can approve staff' });
        }

        await staffModel.findByIdAndUpdate(staffId, { status });
        res.json({ success: true, message: `Staff ${status} successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating staff status' });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password, adminKey } = req.body;

        if (adminKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ success: false, message: 'Invalid admin key' });
        }

        const admin = await staffModel.findOne({ email, role: 'admin' });

        if (!admin) {
            return res.status(400).json({ success: false, message: 'Admin not found' });
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error in admin login' });
    }
};

const listStaff = async (req, res) => {
    try {
        const staffList = await staffModel.find({}).select('-password');
        res.json({ success: true, data: staffList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching staff list' });
    }
};

export { staffRegister, staffLogin, approveStaff, adminLogin, listStaff };
