MERGE INTO LoyaltyMember lm
USING dual
ON (lm.CustomerID = :customerID)
WHEN MATCHED THEN UPDATE SET
    LoyaltyID = :loyaltyID,
    Points = :loyaltyPoints
WHEN NOT MATCHED THEN INSERT (CustomerID, LoyaltyID, Points, UUID)
    VALUES (:customerID, :loyaltyID, :loyaltyPoints, :uuid)
