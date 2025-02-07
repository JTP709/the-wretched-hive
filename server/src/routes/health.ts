import express from 'express';
import { get_health } from '../controllers/health';

const router = express.Router();

router.get('/', get_health);

export default router;
