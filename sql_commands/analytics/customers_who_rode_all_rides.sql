WITH ride_counts AS (
    SELECT COUNT(*) AS ride_total FROM Ride
),
customer_rides AS (
    SELECT DISTINCT b.CustomerID, fr.RideName
    FROM Booking2 b
    JOIN Ticket2 t ON t.BookingNumber = b.BookingNumber
    JOIN ForRide fr ON fr.TicketID = t.TicketID
)
SELECT c.CustomerID, c.CustomerName
FROM Customer c
JOIN customer_rides cr ON cr.CustomerID = c.CustomerID
WHERE (SELECT ride_total FROM ride_counts) > 0
GROUP BY c.CustomerID, c.CustomerName
HAVING COUNT(DISTINCT cr.RideName) = (SELECT ride_total FROM ride_counts)
ORDER BY c.CustomerID
