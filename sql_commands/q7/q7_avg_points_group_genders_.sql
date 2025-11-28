SELECT
    C.Sex AS gender,
    ROUND(AVG(L.Points), 2) AS average_points
FROM Customer C
JOIN LoyaltyMember L ON L.CustomerID = C.CustomerID
GROUP BY C.Sex
ORDER BY C.Sex