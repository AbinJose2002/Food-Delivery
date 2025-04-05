import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { 
    createReservation, 
    getUserReservations, 
    updateReservation, 
    cancelReservation,
    listReservations,
    assignTable // Add this line
} from '../controllers/ReservationController.js';

const reservationRoute = express.Router();

reservationRoute.post('/create', authMiddleware, createReservation);
reservationRoute.get('/user', authMiddleware, getUserReservations);
reservationRoute.post('/update', authMiddleware, updateReservation);
reservationRoute.post('/cancel', authMiddleware, cancelReservation);
reservationRoute.get('/list', listReservations); // Add this line
reservationRoute.post('/assign-table', authMiddleware, assignTable); // Add this line

export default reservationRoute;
