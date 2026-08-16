import express from 'express';
import { googleLogin } from '../controllers/auth.controllers.js';
import { getProfile,githubLogin,githubCallback } from '../controllers/auth.controllers.js';
import { protect } from '../middleware/authMiddleware.js';
const router=express.Router();

router.post('/google-login',googleLogin);
router.get('/profile',protect,getProfile);
router.get('/github',githubLogin);
router.get('/github/callback',githubCallback);
export default router;