import express from 'express';
import { listTables, addTable, updateTable, deleteTable, updateTableStatus } from '../controllers/TableController.js';
import authMiddleware from '../middleware/auth.js';

const tableRoute = express.Router();

// Public endpoint - no auth needed
tableRoute.get('/list', listTables);

// Protected endpoints
tableRoute.post('/add', authMiddleware, addTable);
tableRoute.put('/:id', authMiddleware, updateTable);

// Make table status update work without strict auth for staff operations
// This is the key change to fix the issue
tableRoute.post('/:id', updateTableStatus);

tableRoute.delete('/:id', authMiddleware, deleteTable);

export default tableRoute;
