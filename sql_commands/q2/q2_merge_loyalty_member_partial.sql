UPDATE LoyaltyMember SET
    LoyaltyID = NVL(:loyaltyID, LoyaltyID),
    Points = NVL(:loyaltyPoints, Points)
WHERE 
    CustomerID = :CustomerID
