MERGE INTO LoyaltyMember lm
USING dual
ON (lm.CustomerID = :customerID)
WHEN MATCHED THEN UPDATE SET
    LoyaltyID = NVL(:loyaltyID, lm.LoyaltyID),
    Points = NVL(:loyaltyPoints, lm.Points)
WHEN NOT MATCHED THEN INSERT (CustomerID, LoyaltyID, Points, UUID)
    VALUES (:customerID, :loyaltyID, NVL(:loyaltyPoints, 0), :uuid)
