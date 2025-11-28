SELECT sps.UUID,
       sps.RateCode
FROM SeasonPassSpecial sps
WHERE sps.UUID IN (
    SELECT UUID FROM SeasonPass2 WHERE LoyaltyID = :loyaltyID
)
ORDER BY sps.UUID, sps.RateCode
