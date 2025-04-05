import express from 'express';
import { getDashboardStats } from '../controllers/AdminController.js';
import authMiddleware from '../middleware/auth.js';

const adminRoute = express.Router();

adminRoute.get('/dashboard', authMiddleware, getDashboardStats);

export default adminRoute;
