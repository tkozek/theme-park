INSERT INTO Customer (CustomerID, CustomerName, DOB, Sex)
VALUES (:customerID, :customerName, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :sex)
