SELECT g.CustomerID, c.CustomerName, g.DateOfVisit
FROM Guest g
LEFT JOIN Customer c ON c.CustomerID = g.CustomerID
ORDER BY  g.CustomerID
