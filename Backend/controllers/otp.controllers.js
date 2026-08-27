import jwt from 'jsonwebtoken'; 
import User from '../models/user.model.js';
import { sendEmail } from '../utils/SendEmail.js';

export const sentOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const message = `Your verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. If you did not request this, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification OTP',
        message,
      });

      return res.status(200).json({
        success: true,
        message: `OTP sent successfully to ${user.email}`,
      });
    } catch (emailError) {
      user.otp = undefined;
      user.otpExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Could not send OTP email. Please try again.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and OTP',
      });
    }
    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Verification successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'OTP Verification Failed',
    });
  }
};