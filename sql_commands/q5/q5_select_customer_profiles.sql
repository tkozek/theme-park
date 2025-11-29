SELECT
    c.CustomerID,
    c.CustomerName,
    c.Sex,
    TO_CHAR(c.DOB, 'YYYY-MM-DD') AS DOB,
    TO_CHAR(g.DateOfVisit, 'YYYY-MM-DD') AS DateOfVisit,
    lm.LoyaltyID,
    lm.Points
FROM Customer c
LEFT JOIN Guest g ON g.CustomerID = c.CustomerID
LEFT JOIN LoyaltyMember lm ON lm.CustomerID = c.CustomerID
ORDER BY c.CustomerID
