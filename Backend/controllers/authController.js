const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// ─────────────────────────────────────────────
// Helper: Generate a signed JWT token
// ─────────────────────────────────────────────
const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });

// ─────────────────────────────────────────────
// Helper: Build the standard user response object
// ─────────────────────────────────────────────
const userResponse = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    profilePhoto: user.profilePhoto,
    privacySettings: user.privacySettings,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    token: generateToken(user._id),
});

// ─────────────────────────────────────────────
// Helper: Create a Nodemailer transporter
// (Gmail if credentials set, else Ethereal test)
// ─────────────────────────────────────────────
const createTransporter = async () => {
    const emailPass = process.env.EMAIL_PASS || '';
    const hasRealCredentials =
        process.env.EMAIL_USER &&
        emailPass &&
        !emailPass.startsWith('PASTE_') &&
        emailPass !== 'your_gmail_app_password_here';

    if (hasRealCredentials) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
    }
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
    });
};

// ─────────────────────────────────────────────
// Helper: Generate a cryptographically secure 6-digit OTP
// ─────────────────────────────────────────────
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// ─────────────────────────────────────────────
// Helper: OTP email HTML template (CleanStreet branded)
// ─────────────────────────────────────────────
const otpEmailHtml = (name, otp) => `
<div style="font-family: 'Arial', sans-serif; max-width: 560px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #10b981, #0d9488); padding: 32px 40px; text-align: center;">
    <div style="display: inline-flex; align-items: center; gap: 10px;">
      <span style="font-size: 28px;">🌿</span>
      <span style="color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Clean<span style="color: #a7f3d0;">Street</span></span>
    </div>
    <p style="color: #d1fae5; font-size: 14px; margin: 8px 0 0;">Civic Reporting Platform</p>
  </div>

  <!-- Body -->
  <div style="padding: 36px 40px; background: #ffffff;">
    <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin: 0 0 8px;">Verify Your Email 📧</h2>
    <p style="color: #6b7280; font-size: 15px; margin: 0 0 24px;">Hi <strong style="color:#111827;">${name}</strong>, use the OTP below to verify your CleanStreet account. It expires in <strong>10 minutes</strong>.</p>

    <!-- OTP Box -->
    <div style="background: #f0fdf4; border: 2px dashed #6ee7b7; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
      <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Your One-Time Password</p>
      <div style="font-size: 40px; font-weight: 900; letter-spacing: 14px; color: #059669; font-family: monospace;">${otp}</div>
    </div>

    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6;">⚠️ Do <strong>not</strong> share this code with anyone. CleanStreet will never ask for your OTP.<br/>If you didn't create an account, you can safely ignore this email.</p>
  </div>

  <!-- Footer -->
  <div style="background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 CleanStreet · Keeping communities clean, one report at a time.</p>
  </div>
</div>
`;

// ─────────────────────────────────────────────
// @desc    Register a new user (sends OTP, no JWT yet)
// @route   POST /api/auth  OR  POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide name, email, and password');
    }

    // Check if email is already taken by a verified account
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        if (existingUser.isVerified) {
            res.status(400);
            throw new Error('An account with that email already exists');
        }
        // Re-register unverified user: update OTP + resend
        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, 10);
        existingUser.name = name;
        existingUser.password = password;          // pre-save hook hashes this
        existingUser.otpHash = otpHash;
        existingUser.otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 min
        existingUser.otpAttempts = 0;
        existingUser.otpResendCount = 0;
        await existingUser.save();
        let emailFailed = false;
        try { await sendOTPEmail(existingUser.email, existingUser.name, otp); } catch (emailErr) {
            console.error('⚠️  Email failed (user saved):', emailErr.message);
            emailFailed = true;
        }
        return res.status(200).json({
            message: emailFailed
                ? 'Account updated but email failed. Please try resend.'
                : 'OTP sent to your email. Please verify.',
            email: existingUser.email,
        });
    }

    // Generate cryptographically secure OTP and hash it before storing
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    const user = await User.create({
        name,
        email,
        password,
        otpHash,
        otpExpire: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        otpAttempts: 0,
        isVerified: false,
    });

    let emailFailed = false;
    try { await sendOTPEmail(user.email, user.name, otp); } catch (emailErr) {
        console.error('⚠️  Email failed (user saved):', emailErr.message);
        emailFailed = true;
    }

    res.status(201).json({
        message: emailFailed
            ? 'Account created but email failed. Please use Resend OTP.'
            : 'OTP sent to your email. Please verify.',
        email: user.email,
    });
};

// Internal helper to send OTP email and log preview
const sendOTPEmail = async (email, name, otp) => {
    console.log(`📤 Attempting to send OTP [${otp}] to: ${email}`);
    try {
        const transporter = await createTransporter();
        const senderEmail = process.env.EMAIL_USER || 'no-reply@cleanstreet.app';
        console.log(`📤 Sending FROM: ${senderEmail}`);
        const info = await transporter.sendMail({
            from: `"CleanStreet" <${senderEmail}>`,
            to: email,
            subject: 'CleanStreet — Your Email Verification OTP',
            html: otpEmailHtml(name, otp),
        });
        console.log(`✅ OTP email sent! MessageID: ${info.messageId}`);
        const preview = nodemailer.getTestMessageUrl(info);
        if (preview) console.log('📧 Ethereal preview (no real email):', preview);
        return preview;
    } catch (err) {
        console.error(`❌ sendOTPEmail FAILED for ${email}:`, err.message);
        console.error('   Code:', err.code);
        console.error('   Response:', err.response);
        throw err; // re-throw so the caller knows it failed
    }
};

// ─────────────────────────────────────────────
// @desc    Verify OTP and activate account
// @route   POST /api/auth/verify-otp
// @access  Public
// ─────────────────────────────────────────────
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400);
        throw new Error('Email and OTP are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        res.status(404);
        throw new Error('No account found with that email');
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error('Account is already verified. Please log in.');
    }

    if (!user.otpHash || !user.otpExpire) {
        res.status(400);
        throw new Error('No OTP found. Please request a new one.');
    }

    if (new Date() > user.otpExpire) {
        res.status(400);
        throw new Error('OTP has expired. Please request a new one.');
    }

    // Enforce attempt limit (max 5 wrong guesses)
    if (user.otpAttempts >= 5) {
        res.status(429);
        throw new Error('Too many incorrect attempts. Please request a new OTP.');
    }

    // Verify by comparing the entered OTP against the stored bcrypt hash
    const isMatch = await bcrypt.compare(otp.trim(), user.otpHash);
    if (!isMatch) {
        user.otpAttempts += 1;
        await user.save({ validateBeforeSave: false });
        const remaining = 5 - user.otpAttempts;
        res.status(400);
        throw new Error(`Invalid OTP. ${remaining} attempt(s) remaining.`);
    }

    // Success — mark verified and clear OTP data
    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpire = undefined;
    user.otpAttempts = 0;
    user.otpResendCount = 0;
    await user.save({ validateBeforeSave: false });

    res.json({
        message: 'Email verified successfully!',
        ...userResponse(user),
    });
};

// ─────────────────────────────────────────────
// @desc    Resend OTP (rate-limited: max 5 per hour)
// @route   POST /api/auth/resend-otp
// @access  Public
// ─────────────────────────────────────────────
const resendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Email is required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        res.status(404);
        throw new Error('No account found with that email');
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error('Account is already verified.');
    }

    // Rate limit: max 5 resends per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (user.otpResendResetAt && user.otpResendResetAt > oneHourAgo) {
        if (user.otpResendCount >= 5) {
            res.status(429);
            throw new Error('Too many OTP requests. Please wait before trying again.');
        }
        user.otpResendCount += 1;
    } else {
        // Reset the window
        user.otpResendCount = 1;
        user.otpResendResetAt = new Date();
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    user.otpHash = otpHash;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.otpAttempts = 0; // reset failed attempts on resend
    await user.save({ validateBeforeSave: false });

    let resendFailed = false;
    try { await sendOTPEmail(user.email, user.name, otp); } catch (emailErr) {
        console.error('⚠️  Resend email failed:', emailErr.message);
        resendFailed = true;
    }

    res.json({
        message: resendFailed
            ? 'Could not send email. Please try again later.'
            : 'A new OTP has been sent to your email.',
    });
};

// ─────────────────────────────────────────────
// @desc    Authenticate a user (login)
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // Block unverified users
    if (!user.isVerified) {
        res.status(403);
        throw new Error('Please verify your email first. Check your inbox for the OTP.');
    }

    res.json(userResponse(user));
};

// ─────────────────────────────────────────────
// @desc    Get current logged-in user's data
// @route   GET /api/auth/me
// @access  Private (requires JWT)
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// ─────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (requires JWT)
// ─────────────────────────────────────────────
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.profilePhoto = req.body.profilePhoto !== undefined ? req.body.profilePhoto : user.profilePhoto;

    if (req.body.role) {
        user.role = req.body.role.toLowerCase();
    }

    if (req.body.password && req.body.currentPassword) {
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) {
            res.status(401);
            throw new Error('Current password is incorrect');
        }
        user.password = req.body.password;
    }

    if (req.body.privacySettings) {
        user.privacySettings = { ...user.privacySettings, ...req.body.privacySettings };
    }

    const updatedUser = await user.save();
    res.json(userResponse(updatedUser));
};

// ─────────────────────────────────────────────
// @desc    Forgot password — generate reset token and send email
// @route   POST /api/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────────
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please provide an email address');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        res.status(404);
        throw new Error('No account found with that email address');
    }

    const plainToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    user.resetPasswordExpires = user.resetPasswordExpire;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${plainToken}`;

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background:#f8fafc; border-radius:12px;">
            <h2 style="color: #10b981;">🔑 Password Reset Request</h2>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>You requested a password reset for your <strong>CleanStreet</strong> account. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight:600;">Reset My Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">⏰ This link expires in <strong>30 minutes</strong>.</p>
            <p style="color: #6b7280; font-size: 14px;">If you did not request this, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
            <p style="color: #9ca3af; font-size: 12px;">CleanStreet App — Keeping communities clean.</p>
        </div>
    `;

    try {
        const transporter = await createTransporter();
        const senderEmail = process.env.EMAIL_USER || 'no-reply@cleanstreet.app';
        const info = await transporter.sendMail({
            from: `"CleanStreet App" <${senderEmail}>`,
            to: user.email,
            subject: 'CleanStreet — Password Reset Request',
            html: emailHtml,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) console.log('✅ Reset email preview URL:', previewUrl);

        res.json({ message: 'Password reset link sent to your email.', ...(previewUrl ? { previewUrl } : {}) });
    } catch (err) {
        console.error('❌ Email send error:', err.message);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error(`Email could not be sent: ${err.message}`);
    }
};

// ─────────────────────────────────────────────
// @desc    Reset password using a valid token
// @route   POST /api/auth/reset-password/:token
// @access  Public
// ─────────────────────────────────────────────
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        $or: [
            { resetPasswordExpire: { $gt: Date.now() } },
            { resetPasswordExpires: { $gt: Date.now() } },
        ],
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired reset link. Please request a new one.');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful! You can now log in with your new password.' });
};

module.exports = {
    registerUser,
    loginUser,
    verifyOTP,
    resendOTP,
    getMe,
    updateUserProfile,
    forgotPassword,
    resetPassword,
};

