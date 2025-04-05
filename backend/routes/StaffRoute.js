import express from 'express';
import { staffRegister, staffLogin, approveStaff, adminLogin, listStaff } from '../controllers/StaffController.js';
import authMiddleware from '../middleware/auth.js';

const staffRoute = express.Router();

staffRoute.post('/register', staffRegister);
staffRoute.post('/login', staffLogin);
staffRoute.post('/approve', authMiddleware, approveStaff);
staffRoute.post('/admin/login', adminLogin);
staffRoute.get('/list', authMiddleware, listStaff);

export default staffRoute;
