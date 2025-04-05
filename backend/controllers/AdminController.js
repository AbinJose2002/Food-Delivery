import orderModel from '../models/orderModel.js';
import staffModel from '../models/StaffModel.js';
import foodModel from '../models/FoodModel.js';

const getDashboardStats = async (req, res) => {
    try {
        // Get total sales
        const orders = await orderModel.find({ payment: true });
        const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);

        // Get active staff count
        const activeStaff = await staffModel.countDocuments({ 
            status: 'approved',
            isActive: true 
        });

        // Get popular items
        const popularItems = await orderModel.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.name',
                    totalOrders: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalOrders: -1 } },
            { $limit: 5 }
        ]);

        // Get recent orders
        const recentOrders = await orderModel.find()
            .sort({ date: -1 })
            .limit(10);

        // Get staff performance
        const staffPerformance = await orderModel.aggregate([
            { $match: { 'assignedTo.staffId': { $exists: true } } },
            {
                $group: {
                    _id: '$assignedTo.staffId',
                    staffName: { $first: '$assignedTo.staffName' },
                    totalOrders: { $sum: 1 },
                    totalSales: { $sum: '$amount' }
                }
            }
        ]);

        res.json({
            success: true,
            totalSales,
            totalOrders: orders.length,
            activeStaff,
            popularItems,
            recentOrders,
            staffPerformance
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
    }
};

export { getDashboardStats };
