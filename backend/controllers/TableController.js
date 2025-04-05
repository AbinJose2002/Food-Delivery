import tableModel from '../models/TableModel.js';
import staffModel from '../models/StaffModel.js';

const listTables = async (req, res) => {
    try {
        const tables = await tableModel.find({}).sort({ tableNumber: 1 });
        res.json({ success: true, data: tables });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching tables' });
    }
};

const addTable = async (req, res) => {
    try {
        const staff = await staffModel.findById(req.body.userId);
        if (!staff || staff.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admins can add tables' });
        }

        const newTable = new tableModel(req.body);
        await newTable.save();
        res.json({ success: true, message: 'Table added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error adding table' });
    }
};

const updateTable = async (req, res) => {
    try {
        const staff = await staffModel.findById(req.body.userId);
        if (!staff || staff.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admins can update tables' });
        }

        const { id } = req.params;
        await tableModel.findByIdAndUpdate(id, req.body);
        res.json({ success: true, message: 'Table updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating table' });
    }
};

const deleteTable = async (req, res) => {
    try {
        const staff = await staffModel.findById(req.body.userId);
        if (!staff || staff.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admins can delete tables' });
        }

        const { id } = req.params;
        await tableModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Table deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting table' });
    }
};

const updateTableStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`Updating table ${id} status to ${status}`);

        if (!['available', 'occupied', 'reserved'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be available, occupied, or reserved.'
            });
        }

        const updatedTable = await tableModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedTable) {
            return res.status(404).json({ 
                success: false, 
                message: 'Table not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Table status updated successfully',
            data: updatedTable
        });
    } catch (error) {
        console.error('Error updating table status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating table status' 
        });
    }
};

export { listTables, addTable, updateTable, deleteTable, updateTableStatus };
