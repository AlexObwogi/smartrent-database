const mongoose = require ("mongoose");

const userSchema = new mongoose.schema (
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["Client", "Landlord", "Admin"],
            required: true,
            index: true,
        },

        phoneNumber: {
            type: String,
           validate: {
                validator: function(v) {
                    // Remove non-digits and check length between 10-15
                    const digitsOnly = v.replace(/\D/g, '');
                    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
                },
                 message: props => `${props.value} is not a valid phone number! Must have 10-15 digits.`
            },
        },

        accountStatus: {
            type: String,
            enum: ["active", "suspended", "deleted", "pending"],
            default: "pending", //new users start as pendind until email is verified.
            require: true,
            index: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    }
);

module.exports = userSchema;