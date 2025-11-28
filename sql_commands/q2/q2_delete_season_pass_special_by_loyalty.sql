DELETE FROM SeasonPassSpecial
WHERE UUID IN (
    SELECT UUID FROM SeasonPass2 WHERE LoyaltyID = :loyaltyID
)
