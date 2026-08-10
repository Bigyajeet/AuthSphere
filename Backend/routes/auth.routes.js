import express from 'express';
import { googleLogin } from '../controllers/auth.controllers.js';
import { getProfile } from '../controllers/auth.controllers.js';
import { protect } from '../middleware/authMiddleware.js';
const router=express.Router();

router.post('/google-login',googleLogin);
router.get('/profile',protect,getProfile);

export default router;