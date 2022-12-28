UPDATE "TableBusinesses"
SET 
    "address" = $2, 
    "city" = $3,  
    "province" = $4, 
    "country" = $5, 
    "lat" = $6, 
    "long" = $7
WHERE
    "business_id" = $1;