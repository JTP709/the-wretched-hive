import express from 'express';
import {
  signup,
  login,
  logout,
  forgot_password,
  reset_password,
} from '../controllers/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgot_password);
router.post('/reset-password', reset_password);

export default router;
