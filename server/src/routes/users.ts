import express from 'express';
import { get_user } from '../controllers/users';

const router = express.Router();

router.get('/', get_user);

export default router;
