import reservationModel from '../models/reservationModel.js';
import tableModel from '../models/TableModel.js';

const createReservation = async (req, res) => {
    try {
        const newReservation = new reservationModel({
            ...req.body,
            userId: req.body.userId,
        });
        await newReservation.save();
        res.json({ success: true, message: 'Reservation created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating reservation' });
    }
};

const getUserReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.find({ userId: req.body.userId })
            .sort({ date: 1, time: 1 });
        res.json({ success: true, data: reservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching reservations' });
    }
};

const updateReservation = async (req, res) => {
    try {
        const { reservationId, status } = req.body;
        
        // Find reservation and get current assigned table (if any)
        const reservation = await reservationModel.findById(reservationId).populate('assignedTable');
        
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }
        
        // Update the reservation status
        const updatedReservation = await reservationModel.findByIdAndUpdate(
            reservationId,
            { status },
            { new: true }
        ).populate('assignedTable');
        
        // Handle table status update
        if (reservation.assignedTable) {
            const tableId = reservation.assignedTable._id;
            
            // If status changed to "Confirmed", mark table as reserved
            if (status === 'Confirmed') {
                await tableModel.findByIdAndUpdate(
                    tableId,
                    { status: 'reserved' }
                );
            } 
            // If status changed to "Cancelled" or "Completed", make table available again
            else if (status === 'Cancelled' || status === 'Completed') {
                await tableModel.findByIdAndUpdate(
                    tableId,
                    { status: 'available' }
                );
            }
        }
        
        res.json({ 
            success: true, 
            message: 'Reservation updated successfully',
            data: updatedReservation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating reservation' });
    }
};

const cancelReservation = async (req, res) => {
    try {
        const { reservationId } = req.body;
        await reservationModel.findByIdAndUpdate(reservationId, { status: 'Cancelled' });
        res.json({ success: true, message: 'Reservation cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error cancelling reservation' });
    }
};

const listReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.find({})
            .populate('assignedTable')
            .sort({ date: 1, time: 1 });
        res.json({ success: true, data: reservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching reservations' });
    }
};

const assignTable = async (req, res) => {
    try {
        const { reservationId, tableId } = req.body;

        // Get reservation 
        const reservation = await reservationModel.findById(reservationId);
        
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        // Update reservation with table assignment
        const updatedReservation = await reservationModel.findByIdAndUpdate(
            reservationId,
            { assignedTable: tableId },
            { new: true }
        ).populate('assignedTable');
        
        // Immediately update table status to reserved if reservation is confirmed
        if (reservation.status === 'Confirmed') {
            await tableModel.findByIdAndUpdate(
                tableId, 
                { status: 'reserved' }
            );
        }

        res.json({ 
            success: true, 
            message: 'Table assigned successfully',
            data: updatedReservation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error assigning table' });
    }
};

export { 
    createReservation, 
    getUserReservations, 
    updateReservation, 
    cancelReservation,
    listReservations,
    assignTable
};
