import express from 'express';
import { signUpUser, logInUser, logoutUser, changePassword } from '../controllers/userControllers.js';

const router = express.Router();

// POST - Register new user
router.post('/signup',signUpUser);

// POST - Login user
router.post('/login', logInUser);

// POST - Logout user
router.post('/logout', logoutUser);

// POST - Change password
router.post('/changepassword', changePassword);

export default router;
