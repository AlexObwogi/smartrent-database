**Decision 1:** Referencing Over Embedding

We chose referencing instead of embedding related documents to avoid document bloat and support scalability.

>**Example:**
Properties reference landlord via ObjectId instead of storing properties inside the user document.

Reason:

1. Prevent large document growth
2. Avoid MongoDB 16MB document limit
3. Improve flexibility for analytics queries

**Decision 2:** Email Normalization

Emails are stored in lowercase to prevent duplicates caused by case sensitivity.

**Decision 3:** Role Enum Enforcement

Roles are restricted to:

>1. client
>2. landlord
>3. admin

This ensures data consistency and prevents invalid role entries.

**Decision 4:** Reviews Reference Both Property and Client

* Reviews will reference:
* Property (what is being reviewed)
* Client (who wrote the review)

Reason:

* Accountability
* Analytics compatibility
* Prevent duplicate reviews
* Enable user-specific review history

**Decision 5:** Reviews Restricted to Completed Bookings

Reviews require a booking reference.

Only users with completed bookings can leave a review.

>Compound unique index added on (property + client) to prevent duplicate reviews.

Should price be stored as Number or Decimal? 
>In mongoDB normal **Number** is floating point. Floating point causes precision errors.

>0.1 + 0.2 is not equal to 0.3 

>For money we use: 

>mongoose.Schema.Types.Decimal128
that prevents rounding errors.

**Decision 6:** Price Stored as Decimal128

>Price uses Decimal128 instead of Number to avoid floating-point precision errors.

**Decision 7:** GeoJSON for Location

>Properties use GeoJSON (Point) structure to enable geospatial queries and future map-based filtering.

**Decision 8:** Property Status Enum

Properties include status field:

* draft
* published
* rented
* archived

This improves lifecycle management and data control.

**Decision 9:** Average Rating Calculated Dynamically

>Average rating will be computed using aggregation queries instead of being stored directly to prevent inconsistency.