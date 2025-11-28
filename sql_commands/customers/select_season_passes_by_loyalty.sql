SELECT UUID,
       SeasonPassLevel,
       SeasonStart,
       SeasonEnd
FROM SeasonPass2
WHERE LoyaltyID = :loyaltyID
ORDER BY UUID
