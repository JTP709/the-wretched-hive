import express from 'express';
import {
  signup,
  login,
  logout,
  forgot_password,
  reset_password,
} from '../controllers/auth';
import { csrfProtection } from '../middleware/csrf';

const router = express.Router();

router.post('/signup', csrfProtection, signup);
router.post('/login', csrfProtection, login);
router.post('/logout', csrfProtection, logout);
router.post('/forgot-password', csrfProtection, forgot_password);
router.post('/reset-password', csrfProtection, reset_password);

export default router;
