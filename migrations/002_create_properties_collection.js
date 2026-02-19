// database/migrations/002_create_properties_collection.js
/**
 * Migration: Create Properties Collection
 * 
 * Sets up the properties collection with schema validation and indexes.
 */

const mongoose = require("mongoose");
require("dotenv").config();

async function runMigration() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");
        
        const db = mongoose.connection.db;
        
        // Check if collection exists
        const collections = await db.listCollections({ name: "properties" }).toArray();
        
        if (collections.length > 0) {
            console.log("Properties collection already exists");
            
            // Update indexes
            await db.collection("properties").createIndexes([
                { key: { location: "2dsphere" }, name: "geo_index" },
                { key: { status: 1, "address.city": 1, price: 1 }, name: "city_status_price" },
                { key: { status: 1, propertyType: 1, price: 1 }, name: "type_status_price" },
                { key: { landlord: 1, status: 1, createdAt: -1 }, name: "landlord_properties" },
                { key: { status: 1, bedrooms: 1, bathrooms: 1 }, name: "rooms_filter" },
                { key: { status: 1, price: 1, createdAt: -1 }, name: "latest_listings" },
                { key: { availableFrom: 1, status: 1 }, name: "availability" },
                { 
                    key: { 
                        title: "text", 
                        description: "text",
                        "address.city": "text",
                        "address.county": "text" 
                    },
                    name: "property_text_search",
                    weights: {
                        title: 10,
                        description: 5,
                        "address.city": 8,
                        "address.county": 7
                    }
                }
            ]);
            
            console.log("Indexes verified/updated");
        } else {
            // Create collection with validation
            await db.createCollection("properties", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["landlord", "title", "description", "price", "location", "propertyType"],
                        properties: {
                            title: {
                                bsonType: "string",
                                minLength: 5,
                                maxLength: 200,
                                description: "must be a string between 5-200 chars"
                            },
                            price: {
                                bsonType: "decimal",
                                minimum: 0,
                                description: "must be a positive decimal"
                            }
                        }
                    }
                }
            });
            
            console.log("Properties collection created");
            
            // Create all indexes
            await db.collection("properties").createIndexes([
                { key: { location: "2dsphere" }, name: "geo_index" },
                { key: { status: 1, "address.city": 1, price: 1 }, name: "city_status_price" },
                { key: { status: 1, propertyType: 1, price: 1 }, name: "type_status_price" },
                { key: { landlord: 1, status: 1, createdAt: -1 }, name: "landlord_properties" },
                { key: { status: 1, bedrooms: 1, bathrooms: 1 }, name: "rooms_filter" },
                { key: { status: 1, price: 1, createdAt: -1 }, name: "latest_listings" },
                { key: { availableFrom: 1, status: 1 }, name: "availability" },
                { 
                    key: { 
                        title: "text", 
                        description: "text",
                        "address.city": "text",
                        "address.county": "text" 
                    },
                    name: "property_text_search",
                    weights: {
                        title: 10,
                        description: 5,
                        "address.city": 8,
                        "address.county": 7
                    }
                }
            ]);
            
            console.log("All indexes created");
        }
        
        // Log indexes
        const indexes = await db.collection("properties").indexes();
        console.log("\nCurrent indexes:");
        indexes.forEach(idx => {
            console.log(` - ${idx.name}: ${JSON.stringify(idx.key)}`);
        });
        
        console.log("\n✅ Properties migration completed successfully");
        
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

if (require.main === module) {
    runMigration();
}

module.exports = { runMigration };