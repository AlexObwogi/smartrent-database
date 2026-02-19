// database/indexes/user.indexes.js
/**
 * USER SCHEMA INDEXES
 * Created by: Database Engineer
 * Last Updated: [Date]
 * 
 * This file documents all indexes for the users collection
 * Run these in MongoDB to optimize query performance
 */

const userIndexes = [
    {
        // Primary unique index for email
        fields: { email: 1 },
        options: { unique: true },
        purpose: "Fast user lookup by email (authentication)",
        queries: ["findByEmail", "login"]
    },
    {
        // Compound index for role-based filtering
        fields: { role: 1, accountStatus: 1 },
        options: {},
        purpose: "Filter users by role and account status",
        queries: ["getActiveLandlords", "getPendingAdmins"]
    },
    {
        // Index for recent user listings
        fields: { accountStatus: 1, createdAt: -1 },
        options: {},
        purpose: "Get recently registered users by status",
        queries: ["getRecentUsers", "adminDashboard"]
    },
    {
        // Index for unverified user queries
        fields: { isVerified: 1, accountStatus: 1 },
        options: {},
        purpose: "Find unverified users for reminders",
        queries: ["getUnverifiedUsers"]
    },
    {
        // Text search index
        fields: { fullName: "text" },
        options: { 
            name: "user_text_search",
            weights: { fullName: 1 }
        },
        purpose: "Search users by name",
        queries: ["searchUsers"]
    },
    {
        // Phone number lookup
        fields: { phoneNumber: 1 },
        options: { unique: true, sparse: true },
        purpose: "Find user by phone number",
        queries: ["findByPhone"]
    },
    {
        // Login attempt monitoring
        fields: { lockUntil: 1 },
        options: { sparse: true },
        purpose: "Find locked accounts",
        queries: ["cleanupLockedAccounts"]
    }
];

// MongoDB shell commands to create indexes
const mongoShellCommands = `
// Connect to your database
use your_database_name;

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1, accountStatus: 1 });
db.users.createIndex({ accountStatus: 1, createdAt: -1 });
db.users.createIndex({ isVerified: 1, accountStatus: 1 });
db.users.createIndex({ fullName: "text" }, { name: "user_text_search" });
db.users.createIndex({ phoneNumber: 1 }, { unique: true, sparse: true });
db.users.createIndex({ lockUntil: 1 }, { sparse: true });

// View all indexes
db.users.getIndexes();
`;

// Mongoose way to create indexes (for migration script)
const mongooseIndexDefinitions = [
    { email: 1 }, // unique handled in schema
    { role: 1, accountStatus: 1 },
    { accountStatus: 1, createdAt: -1 },
    { isVerified: 1, accountStatus: 1 },
    { fullName: "text" },
    { phoneNumber: 1 }, // unique handled in schema
    { lockUntil: 1 }
];

module.exports = {
    userIndexes,
    mongoShellCommands,
    mongooseIndexDefinitions
};