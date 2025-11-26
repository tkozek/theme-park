WITH avg_points_per_year AS (
    SELECT
        EXTRACT(YEAR FROM c.DOB) AS birth_year,
        AVG(lm.Points) AS avg_points
    FROM Customer c
    JOIN LoyaltyMember lm ON lm.CustomerID = c.CustomerID
    WHERE c.DOB IS NOT NULL
    GROUP BY EXTRACT(YEAR FROM c.DOB)
)
SELECT birth_year, avg_points
FROM avg_points_per_year
WHERE avg_points = (SELECT MIN(avg_points) FROM avg_points_per_year)
ORDER BY birth_year
