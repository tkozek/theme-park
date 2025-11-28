SELECT lm.CustomerID,
       c.CustomerName,
       c.Sex,
       TO_CHAR(c.DOB, 'YYYY-MM-DD') AS DateOfBirth,
       lm.LoyaltyID,
       lm.Points
FROM LoyaltyMember lm
JOIN Customer c ON c.CustomerID = lm.CustomerID
ORDER BY lm.CustomerID

