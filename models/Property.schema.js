// database/schemas/Property.schema.js
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
    {
        landlord: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Landlord reference is required"],
            index: true,
            validate: {
                validator: function(v) {
                    return mongoose.Types.ObjectId.isValid(v);
                },
                message: "Invalid landlord ID format"
            }
        },

        title: {
            type: String,
            required: [true, "Property title is required"],
            trim: true,
            minlength: [5, "Title must be at least 5 characters"],
            maxlength: [200, "Title cannot exceed 200 characters"],
            index: true,
        },

        description: {
            type: String,
            required: [true, "Property description is required"],
            minlength: [20, "Description must be at least 20 characters"],
            maxlength: [5000, "Description cannot exceed 5000 characters"],
        },

        price: {
            type: mongoose.Schema.Types.Decimal128,
            required: [true, "Price is required"],
            validate: {
                validator: function(v) {
                    return v > 0;
                },
                message: "Price must be greater than 0"
            },
            get: function(v) {
                return parseFloat(v.toString());
            },
            index: true,
        },

        // GEOJSON Location field for geospatial queries
        location: {
            type: {
                type: String,
                enum: {
                    values: ["Point"],
                    message: "Location type must be 'Point'"
                },
                required: [true, "Location type is required"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: [true, "Coordinates are required"],
                validate: {
                    validator: function(coords) {
                        // Validate [longitude, latitude] format
                        return coords.length === 2 &&
                               coords[0] >= -180 && coords[0] <= 180 && // longitude
                               coords[1] >= -90 && coords[1] <= 90;     // latitude
                    },
                    message: "Coordinates must be [longitude, latitude] with valid ranges"
                }
            },
        },

        // Detailed address fields
        address: {
            county: {
                type: String,
                required: [true, "County is required"],
                trim: true,
                index: true,
            },
            city: {
                type: String,
                required: [true, "City is required"],
                trim: true,
                index: true,
            },
            street: {
                type: String,
                trim: true,
            },
            postalCode: {
                type: String,
                trim: true,
                index: true,
            },
            // Full address string for display
            formattedAddress: {
                type: String,
                trim: true,
            },
            // Additional location details
            neighborhood: {
                type: String,
                trim: true,
                index: true,
            },
            landmarks: [String],
        },

        propertyType: {
            type: String,
            enum: {
                values: ["apartment", "house", "studio", "villa", "commercial", "land"],
                message: "{VALUE} is not a valid property type"
            },
            required: [true, "Property type is required"],
            index: true,
        },

        // Property specifications
        bedrooms: {
            type: Number,
            min: [0, "Bedrooms cannot be negative"],
            default: 0,
            index: true,
        },

        bathrooms: {
            type: Number,
            min: [0, "Bathrooms cannot be negative"],
            default: 0,
            index: true,
        },

        // Area/size of property
        area: {
            value: {
                type: Number,
                min: [1, "Area must be at least 1"],
                required: function() {
                    return this.propertyType !== "land"; // Required for non-land properties
                }
            },
            unit: {
                type: String,
                enum: ["sqm", "sqft", "acre"],
                default: "sqm",
            }
        },

        // Property features/amenities
        features: [{
            type: String,
            enum: [
                "furnished", "unfurnished", "semi-furnished",
                "parking", "security", "elevator", "pool",
                "gym", "garden", "balcony", "terrace",
                "airConditioning", "heating", "wifi",
                "petsAllowed", "childrenAllowed", "smokingAllowed"
            ]
        }],

        // Utility costs included
        utilitiesIncluded: [{
            type: String,
            enum: ["water", "electricity", "gas", "internet", "trash", "maintenance"]
        }],

        // Media
        images: [{
            url: {
                type: String,
                required: true,
            },
            publicId: String, // For cloud storage reference
            isPrimary: {
                type: Boolean,
                default: false,
            },
            caption: String,
            uploadedAt: {
                type: Date,
                default: Date.now,
            }
        }],

        videos: [{
            url: String,
            platform: {
                type: String,
                enum: ["youtube", "vimeo", "custom"],
            },
            thumbnail: String,
        }],

        virtualTour: String, // URL to 3D tour

        // Availability
        availableFrom: {
            type: Date,
            index: true,
        },

        minimumStay: {
            value: Number,
            unit: {
                type: String,
                enum: ["days", "months", "years"],
                default: "months",
            }
        },

        maximumStay: {
            value: Number,
            unit: {
                type: String,
                enum: ["days", "months", "years"],
            }
        },

        // Status and visibility
        status: {
            type: String,
            enum: {
                values: ["draft", "published", "rented", "archived", "pending", "unavailable"],
                message: "{VALUE} is not a valid status"
            },
            default: "draft",
            required: [true, "Property status is required"],
            index: true,
        },

        // Rental terms
        depositRequired: {
            type: Boolean,
            default: true,
        },
        depositAmount: {
            type: mongoose.Schema.Types.Decimal128,
            validate: {
                validator: function(v) {
                    return !v || v > 0;
                },
                message: "Deposit amount must be positive"
            }
        },

        leaseTerms: {
            type: String,
            enum: ["month-to-month", "6-months", "1-year", "2-years", "negotiable"],
            default: "1-year",
        },

        // Contact preferences
        contactPreference: {
            type: [String],
            enum: ["phone", "email", "whatsapp", "in-app"],
            default: ["in-app"],
        },

        // Statistics and engagement
        views: {
            type: Number,
            default: 0,
            min: 0,
            index: true,
        },

        inquiries: {
            type: Number,
            default: 0,
            min: 0,
        },

        favorites: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Timestamps for key events
        publishedAt: Date,
        lastViewedAt: Date,
        lastInquiryAt: Date,

        // Metadata for flexible extensions
        metadata: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        },

        // Soft delete
        deletedAt: Date,
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
        toJSON: { 
            virtuals: true,
            getters: true, // Apply getters like Decimal128 conversion
        },
        toObject: { 
            virtuals: true,
            getters: true,
        },
    }
);

// ============================================
// INDEXES - CRITICAL FOR PERFORMANCE
// ============================================

// Geospatial index for location-based queries (MOST IMPORTANT)
propertySchema.index({ location: "2dsphere" });

// Compound indexes for common query patterns
propertySchema.index({ status: 1, "address.city": 1, price: 1 }); // Filter by city and price
propertySchema.index({ status: 1, propertyType: 1, price: 1 }); // Filter by type and price
propertySchema.index({ landlord: 1, status: 1, createdAt: -1 }); // Landlord's properties
propertySchema.index({ status: 1, bedrooms: 1, bathrooms: 1 }); // Filter by rooms
propertySchema.index({ status: 1, price: 1, createdAt: -1 }); // Latest listings by price range

// Text search index
propertySchema.index({ 
    title: "text", 
    description: "text",
    "address.city": "text",
    "address.county": "text",
    "address.neighborhood": "text" 
}, {
    name: "property_text_search",
    weights: {
        title: 10,      // Title matches are most important
        description: 5,  // Description matches are medium
        "address.city": 8, // City matches are high
        "address.county": 7,
        "address.neighborhood": 6
    }
});

// Availability and date-based queries
propertySchema.index({ availableFrom: 1, status: 1 });
propertySchema.index({ minimumStay: 1, maximumStay: 1 });

// Analytics and reporting
propertySchema.index({ views: -1, createdAt: -1 });
propertySchema.index({ inquiries: -1, createdAt: -1 });
propertySchema.index({ favorites: -1, createdAt: -1 });

// Compound index for admin dashboards
propertySchema.index({ 
    status: 1, 
    "address.county": 1, 
    propertyType: 1,
    createdAt: -1 
});

// ============================================
// VIRTUAL PROPERTIES
// ============================================

// Check if property is available
propertySchema.virtual("isAvailable").get(function() {
    return this.status === "published" && 
           (!this.availableFrom || this.availableFrom <= new Date());
});

// Format price with currency
propertySchema.virtual("formattedPrice").get(function() {
    if (!this.price) return "N/A";
    const priceNum = this.price.toString();
    return `KES ${parseInt(priceNum).toLocaleString()}/month`;
});

// Full address string
propertySchema.virtual("fullAddress").get(function() {
    const parts = [];
    if (this.address?.street) parts.push(this.address.street);
    if (this.address?.neighborhood) parts.push(this.address.neighborhood);
    if (this.address?.city) parts.push(this.address.city);
    if (this.address?.county) parts.push(this.address.county);
    if (this.address?.postalCode) parts.push(this.address.postalCode);
    return parts.join(", ");
});

// Primary image URL
propertySchema.virtual("primaryImage").get(function() {
    if (!this.images || this.images.length === 0) {
        return "/images/default-property.jpg";
    }
    const primary = this.images.find(img => img.isPrimary);
    return primary ? primary.url : this.images[0].url;
});

// Image count
propertySchema.virtual("imageCount").get(function() {
    return this.images?.length || 0;
});

// Price per bedroom (useful for comparisons)
propertySchema.virtual("pricePerBedroom").get(function() {
    if (!this.price || !this.bedrooms || this.bedrooms === 0) return null;
    const priceNum = parseFloat(this.price.toString());
    return priceNum / this.bedrooms;
});

// Days since published
propertySchema.virtual("daysOnMarket").get(function() {
    if (!this.publishedAt) return null;
    const days = Math.floor((Date.now() - this.publishedAt) / (1000 * 60 * 60 * 24));
    return days;
});

// ============================================
// SCHEMA OPTIONS
// ============================================

// Ensure getters are applied
propertySchema.set('toJSON', { 
    virtuals: true, 
    getters: true,
    transform: function(doc, ret) {
        // Convert Decimal128 to number for JSON
        if (ret.price) ret.price = parseFloat(ret.price.toString());
        if (ret.depositAmount) ret.depositAmount = parseFloat(ret.depositAmount.toString());
        return ret;
    }
});

// ============================================
// EXPORT PURE SCHEMA
// ============================================
module.exports = propertySchema;