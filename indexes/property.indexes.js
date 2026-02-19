// database/indexes/property.indexes.js
/**
 * PROPERTY SCHEMA INDEXES
 * Created by: Database Engineer
 * Last Updated: [Date]
 * 
 * This file documents all indexes for the properties collection
 */

const propertyIndexes = [
    {
        // Geospatial index for location-based search
        fields: { location: "2dsphere" },
        options: {},
        purpose: "Find properties near a location",
        queries: ["findNearby", "searchByLocation"],
        priority: "CRITICAL"
    },
    {
        // City + Status + Price filtering
        fields: { status: 1, "address.city": 1, price: 1 },
        options: {},
        purpose: "Filter published properties by city and price",
        queries: ["searchProperties", "filterByCity"],
        priority: "HIGH"
    },
    {
        // Property type filtering
        fields: { status: 1, propertyType: 1, price: 1 },
        options: {},
        purpose: "Filter by property type and price range",
        queries: ["searchByType"],
        priority: "HIGH"
    },
    {
        // Landlord dashboard
        fields: { landlord: 1, status: 1, createdAt: -1 },
        options: {},
        purpose: "Show landlord's properties sorted by date",
        queries: ["getLandlordProperties"],
        priority: "HIGH"
    },
    {
        // Room-based filtering
        fields: { status: 1, bedrooms: 1, bathrooms: 1 },
        options: {},
        purpose: "Filter by number of bedrooms/bathrooms",
        queries: ["filterByRooms"],
        priority: "MEDIUM"
    },
    {
        // Latest listings
        fields: { status: 1, price: 1, createdAt: -1 },
        options: {},
        purpose: "Get newest properties with price filter",
        queries: ["latestListings"],
        priority: "MEDIUM"
    },
    {
        // Text search
        fields: { 
            title: "text", 
            description: "text",
            "address.city": "text",
            "address.county": "text",
            "address.neighborhood": "text" 
        },
        options: {
            weights: {
                title: 10,
                description: 5,
                "address.city": 8,
                "address.county": 7,
                "address.neighborhood": 6
            }
        },
        purpose: "Full-text search across property details",
        queries: ["searchProperties"],
        priority: "HIGH"
    },
    {
        // Availability
        fields: { availableFrom: 1, status: 1 },
        options: {},
        purpose: "Find properties available from a certain date",
        queries: ["findAvailable"],
        priority: "MEDIUM"
    },
    {
        // Popular properties
        fields: { views: -1, createdAt: -1 },
        options: {},
        purpose: "Get most viewed properties",
        queries: ["popularProperties"],
        priority: "LOW"
    },
    {
        // Admin dashboard
        fields: { status: 1, "address.county": 1, propertyType: 1, createdAt: -1 },
        options: {},
        purpose: "Admin reporting and analytics",
        queries: ["adminReports"],
        priority: "MEDIUM"
    }
];

// MongoDB shell commands
const mongoShellCommands = `
// Connect to database
use your_database_name;

// Geospatial index (MOST IMPORTANT)
db.properties.createIndex({ location: "2dsphere" });

// Compound indexes
db.properties.createIndex({ status: 1, "address.city": 1, price: 1 });
db.properties.createIndex({ status: 1, propertyType: 1, price: 1 });
db.properties.createIndex({ landlord: 1, status: 1, createdAt: -1 });
db.properties.createIndex({ status: 1, bedrooms: 1, bathrooms: 1 });
db.properties.createIndex({ status: 1, price: 1, createdAt: -1 });
db.properties.createIndex({ availableFrom: 1, status: 1 });

// Text search index
db.properties.createIndex(
    { 
        title: "text", 
        description: "text",
        "address.city": "text",
        "address.county": "text",
        "address.neighborhood": "text" 
    },
    {
        weights: {
            title: 10,
            description: 5,
            "address.city": 8,
            "address.county": 7,
            "address.neighborhood": 6
        },
        name: "property_text_search"
    }
);

// Analytics indexes
db.properties.createIndex({ views: -1, createdAt: -1 });
db.properties.createIndex({ favorites: -1, createdAt: -1 });

// Verify indexes
db.properties.getIndexes();
`;

module.exports = {
    propertyIndexes,
    mongoShellCommands
};