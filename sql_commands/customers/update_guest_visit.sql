UPDATE Guest SET DateOfVisit = TO_DATE(:dateOfVisit, 'YYYY-MM-DD') WHERE CustomerID = :customerID
