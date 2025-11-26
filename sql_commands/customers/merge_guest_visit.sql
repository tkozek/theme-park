MERGE INTO Guest g
USING dual
ON (g.CustomerID = :customerID)
WHEN MATCHED THEN UPDATE SET DateOfVisit = TO_DATE(:dateOfVisit, 'YYYY-MM-DD')
WHEN NOT MATCHED THEN INSERT (CustomerID, DateOfVisit)
    VALUES (:customerID, TO_DATE(:dateOfVisit, 'YYYY-MM-DD'))
