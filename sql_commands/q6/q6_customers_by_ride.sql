SELECT DISTINCT
       c.CustomerID,
       c.CustomerName,
       CASE
           WHEN lm.CustomerID IS NOT NULL THEN 'Loyalty Member'
           ELSE 'Guest'
       END AS MembershipStatus
FROM ForRide fr
JOIN Ticket2 t ON t.TicketID = fr.TicketID
JOIN Booking2 b ON b.BookingNumber = t.BookingNumber
JOIN Customer c ON c.CustomerID = b.CustomerID
LEFT JOIN LoyaltyMember lm ON lm.CustomerID = c.CustomerID
WHERE fr.RideName = :rideName
  AND b.CustomerID IS NOT NULL
ORDER BY c.CustomerName
