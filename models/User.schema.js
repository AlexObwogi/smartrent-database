// database/schemas/User.schema.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: [2, "Full name must be at least 2 characters"],
            maxlength: [100, "Full name cannot exceed 100 characters"],
            index: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email address"
            ],
            index: true,
        },

        passwordHash: {
            type: String,
            required: [true, "Password is required"],
            minlength: [60, "Invalid password hash"], // bcrypt hashes are 60 chars
            maxlength: [60, "Invalid password hash"],
        },

        role: {
            type: String,
            enum: {
                values: ["Client", "Landlord", "Admin"],
                message: "{VALUE} is not a valid role. Must be Client, Landlord, or Admin"
            },
            required: [true, "User role is required"],
            index: true,
        },

        phoneNumber: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple null values while maintaining uniqueness for non-null
            validate: {
                validator: function(v) {
                    if (!v) return true; // Allow null/undefined
                    // Remove all non-digits
                    const digitsOnly = v.replace(/\D/g, '');
                    // Check if it's a valid phone number (10-15 digits)
                    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
                },
                message: props => `${props.value} is not a valid phone number! Must have 10-15 digits.`
            },
            index: true,
        },

        accountStatus: {
            type: String,
            enum: {
                values: ["active", "suspended", "deleted", "pending"],
                message: "{VALUE} is not a valid account status"
            },
            default: "pending",
            required: [true, "Account status is required"],
            index: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
            index: true, // Useful for filtering unverified users
        },

        // Optional: Add last login tracking (helpful for analytics)
        lastLoginAt: {
            type: Date,
            index: true,
        },

        // Optional: Add password reset tracking
        passwordResetToken: {
            type: String,
            select: false, // Don't return by default
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },

        // Optional: Email verification token
        emailVerificationToken: {
            type: String,
            select: false,
        },
        emailVerificationExpires: {
            type: Date,
            select: false,
        },

        // Optional: Track login attempts for security
        loginAttempts: {
            type: Number,
            default: 0,
            min: 0,
        },
        lockUntil: {
            type: Date,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ============================================
// INDEXES (Your responsibility as DB Engineer)
// ============================================

// Compound indexes for common query patterns
userSchema.index({ role: 1, accountStatus: 1 }); // For filtering users by role and status
userSchema.index({ accountStatus: 1, createdAt: -1 }); // For admin panels showing recent users
userSchema.index({ isVerified: 1, accountStatus: 1 }); // For finding unverified active users
userSchema.index({ email: 1, accountStatus: 1 }); // For login queries with status check

// Index for text search on fullName (if you need search functionality)
userSchema.index({ fullName: "text" });

// ============================================
// VIRTUAL PROPERTIES (Computed fields)
// ============================================
// These don't get stored in DB but are useful for responses

userSchema.virtual("isActive").get(function() {
    return this.accountStatus === "active";
});

userSchema.virtual("isLocked").get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.virtual("profileCompletion").get(function() {
    let score = 0;
    const totalFields = 4; // email, phone, verification, fullName
    
    if (this.email) score++;
    if (this.phoneNumber) score++;
    if (this.isVerified) score++;
    if (this.fullName && this.fullName.length > 0) score++;
    
    return Math.round((score / totalFields) * 100);
});

// ============================================
// SCHEMA OPTIONS AND CONFIGURATION
// ============================================

// Ensure virtuals are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// ============================================
// EXPORT PURE SCHEMA (NO METHODS!)
// ============================================
// Note: Backend engineer will add methods like:
// - comparePassword()
// - generateAuthToken()
// - etc.
module.exports = userSchema;