const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Stores user account information, hashed passwords, OTP verification, and reset token data.
 */
const userSchema = new mongoose.Schema(
    {
        // --- Core Fields ---
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },

        // --- Email Verification Fields ---
        isVerified: {
            type: Boolean,
            default: false,
        },
        otpHash: {
            type: String,       // bcrypt hash of the OTP — never stored plain
            default: undefined,
        },
        otpExpire: {
            type: Date,
            default: undefined,
        },
        otpAttempts: {
            type: Number,       // consecutive failed verify attempts
            default: 0,
        },
        otpResendCount: {
            type: Number,
            default: 0,
        },
        otpResendResetAt: {
            type: Date,
            default: undefined,
        },

        // --- Profile Fields ---
        location: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['user', 'volunteer', 'admin'],
            default: 'user',
        },
        profilePhoto: {
            type: String,
            default: '',
        },

        // --- Password Reset Fields ---
        resetPasswordToken: {
            type: String,
            default: undefined,
        },
        resetPasswordExpire: {
            type: Date,
            default: undefined,
        },
        resetPasswordExpires: {
            type: Date,
            default: undefined,
        },

        // --- Privacy Settings ---
        privacySettings: {
            profileVisibility: {
                type: String,
                enum: ['public', 'private'],
                default: 'public',
            },
            showEmail: {
                type: Boolean,
                default: true,
            },
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

// ─────────────────────────────────────────────
// Middleware: Hash password before saving
// ─────────────────────────────────────────────
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ─────────────────────────────────────────────
// Instance Method: Compare entered password with hash
// ─────────────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
