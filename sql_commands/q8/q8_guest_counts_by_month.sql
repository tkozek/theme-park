SELECT
    EXTRACT(MONTH FROM g.DateOfVisit) AS visit_month,
    COUNT(*) AS guest_count
FROM Guest g
GROUP BY EXTRACT(MONTH FROM g.DateOfVisit)
HAVING COUNT(*) > 1
ORDER BY visit_month
