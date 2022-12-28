SELECT DISTINCT "business_id"
FROM "BusinessLocationCross"
WHERE "geohash" = $1;