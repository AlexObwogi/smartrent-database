**SmartRent Database Architecture (V1)**

**Database Technology**

Database: MongoDB (Atlas)
Data Model: Document-based (BSON)
Relationship Strategy: Referencing using ObjectId
ODM: Mongoose

**Core Collections**

1. users
2. properties
3. bookings
4. payments
5. reviews

**Architectural Principles**

1. Avoid over-embedding
2. Use referencing for scalability
3. Enforce validation at schema level
4. Normalize critical fields (email)
5. Prepare structure for AI analytics
6. Design with indexing in mind
