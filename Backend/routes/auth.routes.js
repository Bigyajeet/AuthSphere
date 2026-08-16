import express from 'express';
import {  googleLogin } from '../controllers/auth.controllers.js';
import { getProfile,githubLogin,githubCallback,facebookLogin,facebookCallBack} from '../controllers/auth.controllers.js';
import { protect } from '../middleware/authMiddleware.js';
const router=express.Router();

router.post('/google-login',googleLogin);
router.get('/profile',protect,getProfile);
router.get('/github',githubLogin);
router.get('/github/callback',githubCallback);
router.get('/facebook',facebookLogin);
router.get('/facebook/callback',facebookCallBack);
export default router;