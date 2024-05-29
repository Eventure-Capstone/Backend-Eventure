import express from "express";
//import userServices from '../services/user_service.js';
import controller from '../controllers/user_controller.js';

const router = express.Router();

// CREATE - POST
router.post('/', controller.register);

export { router };
