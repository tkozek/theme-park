INSERT INTO Guest (CustomerID, DateOfVisit)
VALUES (:customerID, TO_DATE(:dateOfVisit, 'YYYY-MM-DD'))
