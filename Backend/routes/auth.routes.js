import express from 'express';
import {  resetPassword,forgotPassword, googleLogin, linkedinCallback, linkedinlogin, loginUser, registerUser } from '../controllers/auth.controllers.js';
import { getProfile,githubLogin,githubCallback,facebookLogin,facebookCallBack} from '../controllers/auth.controllers.js';
import { protect } from '../middleware/authMiddleware.js';
const router=express.Router();

router.post('/google-login',googleLogin);
router.get('/profile',protect,getProfile);
router.get('/github',githubLogin);
router.get('/github/callback',githubCallback);
router.get('/facebook',facebookLogin);
router.get('/facebook/callback',facebookCallBack);
router.get('/linkedin',linkedinlogin);
router.get('/linkedin/callback',linkedinCallback);
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post("/forgot-password",forgotPassword);
router.post('/reset-password/:token', resetPassword);
export default router;