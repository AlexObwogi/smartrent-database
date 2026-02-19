// database/migrations/001_create_users_collection.js
/**
 * Migration: Create Users Collection
 * 
 * This migration sets up the users collection with proper indexes.
 * Run this when setting up the database for the first time.
 * 
 * Usage: 
 *   node database/migrations/001_create_users_collection.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

async function runMigration() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("Connected to database");
        
        const db = mongoose.connection.db;
        
        // Check if collection exists
        const collections = await db.listCollections({ name: "users" }).toArray();
        
        if (collections.length > 0) {
            console.log("Users collection already exists");
            
            // Still ensure indexes are up to date
            await db.collection("users").createIndexes([
                { key: { email: 1 }, name: "email_unique", unique: true },
                { key: { role: 1, accountStatus: 1 }, name: "role_status" },
                { key: { accountStatus: 1, createdAt: -1 }, name: "status_created" },
                { key: { isVerified: 1, accountStatus: 1 }, name: "verified_status" },
                { key: { fullName: "text" }, name: "user_text_search" },
                { key: { phoneNumber: 1 }, name: "phone_unique", unique: true, sparse: true },
                { key: { lockUntil: 1 }, name: "locked_accounts", sparse: true }
            ]);
            
            console.log("Indexes verified/updated");
        } else {
            // Create collection with validation
            await db.createCollection("users", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["fullName", "email", "passwordHash", "role", "accountStatus"],
                        properties: {
                            fullName: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            email: {
                                bsonType: "string",
                                pattern: "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
                                description: "must be a valid email and is required"
                            }
                        }
                    }
                }
            });
            
            console.log("Users collection created");
            
            // Create indexes
            await db.collection("users").createIndexes([
                { key: { email: 1 }, name: "email_unique", unique: true },
                { key: { role: 1, accountStatus: 1 }, name: "role_status" },
                { key: { accountStatus: 1, createdAt: -1 }, name: "status_created" },
                { key: { isVerified: 1, accountStatus: 1 }, name: "verified_status" },
                { key: { fullName: "text" }, name: "user_text_search" },
                { key: { phoneNumber: 1 }, name: "phone_unique", unique: true, sparse: true },
                { key: { lockUntil: 1 }, name: "locked_accounts", sparse: true }
            ]);
            
            console.log("Indexes created");
        }
        
        // Log all indexes for verification
        const indexes = await db.collection("users").indexes();
        console.log("\nCurrent indexes:");
        indexes.forEach(idx => console.log(` - ${idx.name}: ${JSON.stringify(idx.key)}`));
        
        console.log("\n✅ Migration completed successfully");
        
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from database");
    }
}

// Run migration if called directly
if (require.main === module) {
    runMigration();
}

module.exports = { runMigration };