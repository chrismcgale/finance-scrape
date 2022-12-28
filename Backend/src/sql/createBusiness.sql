INSERT INTO "TableBusinesses"
("business_id", "address", "city",  "province", "country", "lat", "long")
VALUES
(DEFAULT, $1, $2, $3, $4, $5, $6)
RETURNING "business_id";