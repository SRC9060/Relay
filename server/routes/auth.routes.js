import { Router } from 'express';
import { getDemoUsers, login, signup, getCurrentUser } from '../controllers/auth.controller.js';

const router = Router();

router.get('/demo-users', getDemoUsers);
router.post('/login', login);
router.post('/signup', signup);
router.get('/me', getCurrentUser);

export default router;
